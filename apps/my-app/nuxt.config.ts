// AI Generation Reference: See ~/_ai/README.md for guidelines and patterns.
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  app: {
    head: {
      title: 'My App',
      meta: [
        { name: 'description', content: 'My App description' },
      ],
    }
  },
  // Expose DATABASE_URL to the server runtime
  runtimeConfig: {
    // Keys defined here are available server-side only
    databaseUrl: process.env.DATABASE_URL, // Read from the app's .env
    // public:
    //   Keys defined here are available client-side
    public: {
      appName: 'My App',

      auth: {
        // We override this defaults to false in the auth layer
        autoLoginAfterRegister: true,
      }
    }

  },

  extends: [
    // Not sure if we need to keep this here, but let's keep it for now
    '../../layers/base', // Use the relative path to the base layer

    // I commented this out and it still works
    // But we cannot remove /assets/css/main.css, this will break the styling
    // TODO: Figure out if we can symlink the .css from the layer to everywhere
    // '@layers/styling', // using pnpm workspace to link the layer

    // Commenting out to see if we need it here because its already imported via i18n -> layout -> auth 
    // '../../layers/i18n',

    // The layout layer is extended by the auth layer, so we don't need to extend it here.
    // '../../layers/layout',

    // The auth layer also imports the layout layer, and also i18n
    '../../layers/auth',


    // Now imported from the base layer
    // '../../layers/database', // Path relative to this nuxt.config.ts

    '../../layers/contact',
    '../../layers/content',
    '../../layers/blog',
    '../../layers/page',
  ],

  experimental: {
    componentIslands: {
      selectiveClient: 'deep'
    }
  },

  i18n: {
    defaultLocale: 'en',
    locales: [
      {
        code: 'en',
        file: 'en.json',
      },
      {
        code: 'de',
        file: 'de.json',
      }
    ],

  },




  // Alias for easier imports
  alias: {
    '@': '.',
  },
})
