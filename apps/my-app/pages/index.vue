<!-- AI Generation Reference: See ~/_ai/README.md for guidelines and patterns. -->
<script setup lang="ts">
const { data, error } = useFetch("/api/hello");
</script>

<template>
  <div>
    <pre>{{ data }}</pre>
    <pre>{{ error }}</pre>
    <button class="btn btn-primary">{{ $t("myapp.testBtn") }}</button>
  </div>
</template>
