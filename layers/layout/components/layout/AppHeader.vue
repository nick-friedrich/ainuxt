<!-- AI Generation Reference: See ~/_ai/README.md for guidelines and patterns. -->
<script setup lang="ts">
// Basic navigation items
const navigationItems = [
  { labelKey: "layout.navigation.home", to: "/" },
  { labelKey: "layout.navigation.contact", to: "/contact" },
  // Add more navigation items here as needed
];

// Function to close the mobile dropdown
function closeDropdown() {
  // Ensure currentTarget is an HTMLElement and has blur method
  if (document.activeElement instanceof HTMLElement) {
    document.activeElement.blur();
  }
}
</script>

<template>
  <div class="navbar bg-base-100 shadow-sm lg:px-6">
    <!-- Navbar Start (Mobile Dropdown + Desktop Logo) -->
    <div class="navbar-start">
      <!-- Mobile Dropdown -->
      <div class="dropdown">
        <div tabindex="0" role="button" class="btn btn-ghost lg:hidden">
          <Icon name="heroicons:bars-3" class="h-5 w-5" />
        </div>
        <ul
          tabindex="0"
          class="menu menu-sm dropdown-content bg-base-100 rounded-box z-[50] mt-3 w-52 p-2 shadow"
        >
          <li
            v-for="item in navigationItems"
            :key="item.to"
            @click="closeDropdown"
          >
            <NuxtLinkLocale :to="item.to">{{
              $t(item.labelKey)
            }}</NuxtLinkLocale>
          </li>
        </ul>
      </div>
      <!-- Desktop Logo -->
      <NuxtLinkLocale
        to="/"
        class="btn btn-ghost hidden text-xl normal-case lg:flex"
      >
        Simple Boilerplate
      </NuxtLinkLocale>
    </div>

    <!-- Navbar Center (Desktop Links Only) -->
    <div class="navbar-center hidden lg:flex">
      <ul class="menu menu-horizontal px-1">
        <li v-for="item in navigationItems" :key="item.to">
          <NuxtLinkLocale :to="item.to" class="btn btn-sm btn-ghost">{{
            $t(item.labelKey)
          }}</NuxtLinkLocale>
        </li>
      </ul>
    </div>

    <!-- Navbar End (Theme & Language) -->
    <div class="navbar-end flex items-center gap-2">
      <ThemeSwitcher />
      <LanguageSwitcher />
    </div>
  </div>
</template>

<style scoped>
/* Header specific styles if needed */
</style>
