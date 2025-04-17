<script setup lang="ts">
// AI Generation Reference: See /ai/README.md for guidelines and patterns.
import { computed } from "vue";

// Define valid button types, colors, sizes, shapes
type ButtonColor =
  | "primary"
  | "secondary"
  | "accent"
  | "info"
  | "success"
  | "warning"
  | "error"
  | "ghost"
  | "link"
  | "neutral"
  | null;
type ButtonSize = "xs" | "sm" | "md" | "lg" | null;
type ButtonShape = "circle" | "square" | null;

const props = defineProps<{
  type?: "button" | "submit" | "reset";
  color?: ButtonColor;
  size?: ButtonSize;
  shape?: ButtonShape;
  outline?: boolean;
  wide?: boolean;
  block?: boolean;
  disabled?: boolean;
  loading?: boolean;
  loadingText?: string;
  iconLeft?: string; // Nuxt Icon name (e.g., heroicons:arrow-left)
  iconRight?: string; // Nuxt Icon name
}>();

const buttonClasses = computed(() => {
  return {
    btn: true,
    [`btn-${props.color}`]: props.color,
    [`btn-${props.size}`]: props.size,
    [`btn-${props.shape}`]: props.shape,
    "btn-outline": props.outline,
    "btn-wide": props.wide,
    "btn-block": props.block,
    // 'btn-disabled': props.disabled || props.loading, // Use :disabled attribute instead for accessibility
  };
});

const defaultLoadingText = "Loading..."; // Consider i18n key
</script>

<template>
  <button
    :type="type || 'button'"
    :class="buttonClasses"
    :disabled="disabled || loading"
  >
    <span
      v-if="loading"
      class="loading loading-spinner"
      :class="{ 'mr-2': !$slots.default }"
    ></span>
    <Icon v-if="iconLeft && !loading" :name="iconLeft" class="mr-2" />
    <span v-if="loading && loadingText">{{ loadingText }}</span>
    <span v-else-if="!loading || !loadingText">
      <slot />
      <!-- Default button text goes here -->
    </span>
    <Icon v-if="iconRight && !loading" :name="iconRight" class="ml-2" />
  </button>
</template>
