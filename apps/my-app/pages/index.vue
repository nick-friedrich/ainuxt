<!-- AI Generation Reference: See ~/_ai/README.md for guidelines and patterns. -->
<script setup lang="ts">
const markdownContent = `# Hello, world!

This is some test markdown content.

## Features
- Bullet points
- **Bold text**
- *Italic text*

> Here's a blockquote`;
</script>

<template>
  <div>
    <button class="btn btn-primary">{{ $t("myapp.testBtn") }}</button>
    <MarkdownRenderer size="sm" :content="markdownContent" />
  </div>
</template>
