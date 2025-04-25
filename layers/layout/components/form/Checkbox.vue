<script setup lang="ts">
// AI Generation Reference: See /ai/README.md for guidelines and patterns.
import { computed } from "vue";

// Using defineProps for better type inference
const props = defineProps<{
  modelValue: boolean;
  id: string;
  label: string;
  color?:
    | "neutral"
    | "primary"
    | "secondary"
    | "accent"
    | "success"
    | "warning"
    | "info"
    | "error";
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  required?: boolean;
  error?: string;
}>();

// Using defineEmits for event declaration
const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
}>();

// Computed property to handle v-model binding
const checked = computed({
  get: () => props.modelValue,
  set: (val) => emit("update:modelValue", val),
});

// Computed class for the checkbox
const checkboxClass = computed(() => {
  const classes = ["checkbox"];

  // Add color modifier if specified
  if (props.color) {
    classes.push(`checkbox-${props.color}`);
  }

  // Add size modifier if specified
  if (props.size) {
    classes.push(`checkbox-${props.size}`);
  }

  return classes.join(" ");
});

const isInvalid = computed(() => !!props.error);
</script>

<template>
  <fieldset class="fieldset w-full">
    <div class="flex items-center gap-2">
      <input
        :id="id"
        v-model="checked"
        type="checkbox"
        :class="[checkboxClass, { 'border-error': isInvalid }]"
        :required="required"
        :aria-invalid="isInvalid"
      />
      <legend class="cursor-pointer" @click="checked = !checked">
        {{ label }}
        <span v-if="required" class="text-error">*</span>
      </legend>
    </div>
    <!-- Error message using fieldset-label -->
    <p v-if="error" class="fieldset-label text-error mt-1">
      {{ error }}
    </p>
  </fieldset>
</template>
