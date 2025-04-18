<!-- AI Generation Reference: See /ai/README.md for guidelines and patterns. -->
<script setup lang="ts">
// This is the header with auth which will override the base layout header.
// AI Generation Reference: See /ai/README.md for guidelines and patterns.
import { useAuth } from "~/composables/useAuth";
const { fetchUser } = useAuth();
await fetchUser();

import { useRouter } from "vue-router";

const navigationItems = [
  { labelKey: "layout.navigation.home", to: "/" },
  { labelKey: "layout.navigation.contact", to: "/contact" },
  // Add more navigation items here as needed
];

const loggedInNavigationItems = [
  { labelKey: "layout.navigation.dashboard", to: "/dashboard" },
];

// Auth state and actions
const { isLoggedIn, user, logout } = useAuth();
const router = useRouter();

// Function to close the dropdown by blurring the clicked element (li)
function closeDropdown() {
  // Ensure currentTarget is an HTMLElement and has blur method
  if (document.activeElement instanceof HTMLElement) {
    document.activeElement.blur();
  }
}

// Logout handler
async function handleLogout() {
  closeDropdown(); // Close the dropdown first
  const success = await logout();
  if (success) {
    // Redirect to home or login page after logout
    router.push("/");
  }
  // Handle logout failure if needed
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
          <li v-if="isLoggedIn"><hr class="border-base-300 my-1" /></li>
          <li
            v-if="isLoggedIn"
            v-for="item in loggedInNavigationItems"
            :key="item.to"
            @click="closeDropdown"
          >
            <NuxtLinkLocale :to="item.to">{{
              $t(item.labelKey)
            }}</NuxtLinkLocale>
          </li>
          <li><hr class="border-base-300 my-1" /></li>
          <li v-if="!isLoggedIn" @click="closeDropdown">
            <NuxtLinkLocale to="/login">{{
              $t("layout.navigation.login", "Login")
            }}</NuxtLinkLocale>
          </li>
          <li v-if="isLoggedIn" @click="handleLogout">
            <a>{{ $t("layout.navigation.logout", "Logout") }}</a>
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
        <li
          v-if="isLoggedIn"
          v-for="item in loggedInNavigationItems"
          :key="item.to"
        >
          <NuxtLinkLocale :to="item.to" class="btn btn-sm btn-ghost">{{
            $t(item.labelKey)
          }}</NuxtLinkLocale>
        </li>
      </ul>
    </div>

    <!-- Navbar End (Actions) -->
    <div class="navbar-end flex items-center gap-2">
      <ThemeSwitcher />
      <LanguageSwitcher />

      <!-- Conditional Login Button -->
      <NuxtLinkLocale
        v-if="!isLoggedIn"
        to="/login"
        class="btn btn-ghost btn-circle"
      >
        <Icon name="heroicons:key" class="h-5 w-5" />
      </NuxtLinkLocale>

      <!-- User Dropdown Menu (if logged in) -->
      <div v-if="isLoggedIn" class="dropdown dropdown-end">
        <div tabindex="0" role="button" class="btn btn-circle btn-primary">
          <!-- Placeholder: Use user?.name or initial -->
          <span class="text-xl">{{
            user?.email?.charAt(0).toUpperCase() || "U"
          }}</span>
        </div>
        <ul
          tabindex="0"
          class="menu menu-sm dropdown-content bg-base-100 rounded-box z-[50] mt-3 w-52 p-2 shadow"
        >
          <li class="p-2 font-semibold">{{ user?.email }}</li>
          <li><hr class="border-base-300 my-1" /></li>
          <li>
            <NuxtLinkLocale to="/dashboard" @click="closeDropdown">
              {{ $t("layout.navigation.dashboard", "Dashboard") }}
            </NuxtLinkLocale>
          </li>
          <li>
            <NuxtLinkLocale to="/profile" @click="closeDropdown">
              {{ $t("layout.navigation.profile", "Profile") }}
            </NuxtLinkLocale>
          </li>
          <li>
            <NuxtLinkLocale to="/settings" @click="closeDropdown">
              {{ $t("layout.navigation.settings", "Settings") }}
            </NuxtLinkLocale>
          </li>
          <li><hr class="border-base-300 my-1" /></li>
          <li>
            <a @click="handleLogout">{{
              $t("layout.navigation.logout", "Logout")
            }}</a>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Header specific styles if needed */
/* Style removed as z-index added directly to class */
</style>
