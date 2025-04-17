<script setup lang="ts">
const { data, error } = useFetch("/api/hello");
</script>

<template>
  <div>
    <pre>{{ data }}</pre>
    <pre>{{ error }}</pre>
  </div>
</template>
