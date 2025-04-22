// file: layers/i18n/server/plugins/0.translations.server.ts
import { glob } from 'glob';
import path from 'node:path';
import fs from 'node:fs/promises';

// Define a type for your merged translations structure if needed
type Translations = Record<string, any>; // Or a more specific type

// Helper for deep merging objects (basic implementation)
function deepMerge(target: any, source: any) {
  for (const key in source) {
    if (source.hasOwnProperty(key)) {
      const targetValue = target[key];
      const sourceValue = source[key];

      if (sourceValue && typeof sourceValue === 'object' && !Array.isArray(sourceValue) &&
        targetValue && typeof targetValue === 'object' && !Array.isArray(targetValue)) {
        deepMerge(targetValue, sourceValue);
      } else {
        target[key] = sourceValue;
      }
    }
  }
  return target;
}


// Helper to access nested properties by dot notation
function getNestedValue(obj: any, path: string): string | undefined {
  const keys = path.split('.');
  return keys.reduce((o, key) => (o && typeof o === 'object' && o[key] !== undefined) ? o[key] : undefined, obj);
}

// Function to find the monorepo root
async function findMonorepoRoot(startDir: string): Promise<string | null> {
  let currentDir = startDir;
  while (true) {
    try {
      await fs.access(path.join(currentDir, 'pnpm-workspace.yaml'));
      return currentDir;
    } catch (e) {
      const parentDir = path.dirname(currentDir);
      if (parentDir === currentDir) { return null; }
      currentDir = parentDir;
    }
  }
}

// Standard function export, Nitro will wrap it
export default async (nitroApp: any) => {
  console.log('🔌 [i18n Layer Plugin] Loading server-side translations...');
  const startDir = process.cwd();
  const workspaceRoot = await findMonorepoRoot(startDir);

  if (!workspaceRoot) {
    console.error('❌ [i18n Layer Plugin] Could not find monorepo root (pnpm-workspace.yaml).');
    nitroApp.hooks.hook('request', (event: any) => {
      if (!event.context.t) {
        event.context.t = (key: string) => key;
      }
    });
    return;
  }

  console.log(`🔍 [i18n Layer Plugin] Monorepo Root Found: ${workspaceRoot}`);
  const pattern = path.join(workspaceRoot, '{layers,apps}', '*', 'i18n', 'locales', '*.json').replace(/\\/g, '/');
  console.log(`🔍 [i18n Layer Plugin] Glob Pattern: ${pattern}`);

  const mergedTranslations: Translations = {};
  const defaultLocale = 'en';

  try {
    const files = await glob(pattern, { absolute: true });
    console.log(`🌐 [i18n Layer Plugin] Found ${files.length} translation files.`);

    for (const file of files) {
      try {
        const locale = path.basename(file, '.json');
        const content = await fs.readFile(file, 'utf-8');
        const jsonData = JSON.parse(content);
        if (!mergedTranslations[locale]) { mergedTranslations[locale] = {}; }
        deepMerge(mergedTranslations[locale], jsonData);
      } catch (parseError) {
        console.error(`❌ [i18n Layer Plugin] Error parsing ${file}:`, parseError);
      }
    }

    console.log(`✅ [i18n Layer Plugin] Translations loaded for locales: ${Object.keys(mergedTranslations).join(', ')}`);

    nitroApp.hooks.hook('request', (event: any) => {
      if (event.context.t) return;

      event.context.t = (
        key: string,
        params: Record<string, string | number> = {},
        locale?: string
      ): string => {
        const currentLocale = locale || defaultLocale;
        let translation = getNestedValue(mergedTranslations[currentLocale], key);
        if (translation === undefined && currentLocale !== defaultLocale) {
          translation = getNestedValue(mergedTranslations[defaultLocale], key);
        }
        let finalTranslation = translation !== undefined ? String(translation) : key;
        Object.keys(params).forEach(param => {
          finalTranslation = finalTranslation.replace(new RegExp(`{${param}}`, 'g'), String(params[param]));
        });
        return finalTranslation;
      };
    });

  } catch (error) {
    console.error('❌ [i18n Layer Plugin] Failed to load server-side translations:', error);
    nitroApp.hooks.hook('request', (event: any) => {
      if (!event.context.t) {
        event.context.t = (key: string) => key;
      }
    });
  }
};

/* Project Root: server/types/h3.d.ts
import 'h3';
declare module 'h3' {
  interface H3EventContext {
    t: (key: string, params?: Record<string, string | number>, locale?: string) => string;
  }
}
*/