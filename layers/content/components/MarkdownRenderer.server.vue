<!-- AI Generation Reference: See ~/_ai/README.md for guidelines and patterns. -->
<script setup lang="ts">
import { parseMarkdownSafe } from "../server/utils/markdown";

// Define props
const props = defineProps<{
  /**
   * Markdown content to render
   */
  content: string;

  /**
   * Size of prose typography
   * @default 'base'
   */
  size?: "sm" | "base" | "lg" | "xl" | "2xl";

  /**
   * Use dark mode typography
   * @default false
   */
  dark?: boolean;

  /**
   * Additional classes to apply to the prose container
   */
  class?: string;
}>();

// Generate prose classes
function getProseClasses() {
  const classes = ["prose"];

  // Add size variant if specified and not the default
  if (props.size && props.size !== "base") {
    classes.push(`prose-${props.size}`);
  }

  // Add dark mode if enabled
  if (props.dark) {
    classes.push("prose-invert");
  }

  // Add custom classes
  if (props.class) {
    classes.push(props.class);
  }

  return classes.join(" ");
}

// Render markdown content
function renderMarkdown() {
  try {
    return parseMarkdownSafe(props.content);
  } catch (error) {
    console.error("Error rendering markdown:", error);
    return '<p class="text-red-500">Error rendering markdown content</p>';
  }
}
</script>

<template>
  <div :class="getProseClasses()">
    <!-- Render the markdown content -->
    <div v-html="renderMarkdown()" />
  </div>
</template>
