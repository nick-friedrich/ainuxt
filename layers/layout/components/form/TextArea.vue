<script setup lang="ts">
// AI Generation Reference: See /ai/README.md for guidelines and patterns.
import { computed } from "vue";

// Using defineProps for better type inference
const props = defineProps<{
  modelValue: string | undefined;
  id: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  error?: string;
  rows?: number;
}>();

// Using defineEmits for event declaration
const emit = defineEmits<{
  (e: "update:modelValue", value: string | undefined): void;
}>();

// Computed property to handle v-model binding
const value = computed({
  get: () => props.modelValue,
  set: (val) => emit("update:modelValue", val),
});

const isInvalid = computed(() => !!props.error);
const numRows = computed(() => props.rows || 3); // Default to 3 rows
</script>

<template>
  <fieldset class="fieldset w-full">
    <legend class="fieldset-legend">
      {{ label }}
      <span v-if="required" class="text-error">*</span>
    </legend>
    <textarea
      :id="id"
      v-model="value"
      class="textarea textarea-bordered w-full"
      :class="{ 'textarea-error': isInvalid }"
      :placeholder="placeholder"
      :required="required"
      :aria-invalid="isInvalid"
      :rows="numRows"
    ></textarea>
    <!-- Error message using fieldset-label -->
    <p v-if="error" class="fieldset-label text-error mt-1">
      {{ error }}
    </p>
  </fieldset>
</template>
