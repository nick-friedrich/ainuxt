<!-- AI Generation Reference: See /ai/README.md for guidelines and patterns. -->
<script setup lang="ts">
// This is the header with auth which will override the base layout header.
// AI Generation Reference: See /ai/README.md for guidelines and patterns.
import { useAuth } from "~/composables/useAuth";
import { useRouter } from "vue-router";
import { useLocalePath } from "#imports";
import { computed } from "vue";

const { fetchUser } = useAuth();
await fetchUser();

const navigationItems = [
  { labelKey: "layout.navigation.home", to: "/" },
  { labelKey: "layout.navigation.contact", to: "/contact" },
  { labelKey: "layout.navigation.blog", to: "/blog" },
  // Add more navigation items here as needed
];

const loggedInNavigationItems = [
  { labelKey: "layout.navigation.dashboard", to: "/dashboard" },
];

// Auth state and actions
const { isLoggedIn, user, logout } = useAuth();
const isAdmin = computed(() =>
  user.value?.roles?.some((role: any) => role.name === "ADMIN")
);
const router = useRouter();
const localePath = useLocalePath();

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
    // Redirect to localized home page after logout
    router.push(localePath("/"));
  }
  // Handle logout failure if needed
}

// Handle avatar loading errors
function handleAvatarError(event: Event) {
  // Hide the image if it fails to load
  if (event.target instanceof HTMLImageElement) {
    event.target.style.display = "none";
  }
  // The fallback text will show since the image is hidden
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
        <div
          tabindex="0"
          role="button"
          class="btn btn-circle btn-primary overflow-hidden p-0"
        >
          <!-- Use avatar if available, otherwise show initial -->
          <img
            v-if="user?.avatarUrl"
            :src="user.avatarUrl"
            :alt="user?.name || user?.email"
            class="w-full h-full object-cover"
            @error="handleAvatarError"
          />
          <span
            v-else
            class="inline-flex items-center justify-center w-full h-full text-xl"
            >{{
              user?.name?.charAt(0).toUpperCase() ||
              user?.username?.charAt(0).toUpperCase() ||
              user?.email?.charAt(0).toUpperCase() ||
              "U"
            }}</span
          >
        </div>
        <ul
          tabindex="0"
          class="menu menu-sm dropdown-content bg-base-100 rounded-box z-[50] mt-3 w-52 p-2 shadow"
        >
          <li class="p-2 font-semibold">
            {{ user?.name || user?.username || user?.email }}
          </li>
          <li
            v-if="user?.email && (user?.name || user?.username)"
            class="px-2 text-xs text-base-content/70"
          >
            {{ user?.email }}
          </li>
          <li><hr class="border-base-300 my-1" /></li>
          <li>
            <NuxtLinkLocale to="/dashboard" @click="closeDropdown">
              {{ $t("layout.navigation.dashboard", "Dashboard") }}
            </NuxtLinkLocale>
          </li>
          <li v-if="isAdmin">
            <NuxtLinkLocale to="/page" @click="closeDropdown">
              {{ $t("layout.navigation.page", "Page") }}
            </NuxtLinkLocale>
          </li>
          <li>
            <NuxtLinkLocale to="/profile" @click="closeDropdown">
              {{ $t("layout.navigation.profile", "Profile") }}
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
