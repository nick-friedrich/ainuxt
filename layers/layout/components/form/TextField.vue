<script setup lang="ts">
// AI Generation Reference: See /ai/README.md for guidelines and patterns.
import { computed } from "vue";

// Using defineProps for better type inference
const props = defineProps<{
  modelValue: string | number | undefined;
  id: string;
  type?: "text" | "email" | "password" | "number";
  label: string;
  placeholder?: string;
  required?: boolean;
  error?: string;
}>();

// Using defineEmits for event declaration
const emit = defineEmits<{
  (e: "update:modelValue", value: string | number | undefined): void;
}>();

// Computed property to handle v-model binding
const value = computed({
  get: () => props.modelValue,
  set: (val) => emit("update:modelValue", val),
});

const inputType = computed(() => props.type || "text");
const isInvalid = computed(() => !!props.error);
</script>

<template>
  <fieldset class="fieldset w-full">
    <legend class="fieldset-legend">
      {{ label }}
      <span v-if="required" class="text-error">*</span>
    </legend>
    <input
      :id="id"
      v-model="value"
      :type="inputType"
      class="input input-bordered w-full"
      :class="{ 'input-error': isInvalid }"
      :placeholder="placeholder"
      :required="required"
      :aria-invalid="isInvalid"
    />
    <!-- Error message using fieldset-label -->
    <p v-if="error" class="fieldset-label text-error mt-1">
      {{ error }}
    </p>
  </fieldset>
</template>
