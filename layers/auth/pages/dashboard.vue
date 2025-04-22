<script setup lang="ts">
// AI Generation Reference: See /ai/README.md for guidelines and patterns.
import { useAuth } from "~/composables/useAuth";
import { onServerPrefetch } from "vue";

definePageMeta({
  middleware: ["auth"], // Apply the auth middleware
});

const { user, fetchUser } = useAuth();
// Fetch user data on server before rendering to keep SSR and client in sync
onServerPrefetch(fetchUser);
</script>

<template>
  <div>
    <h1 class="mb-4 text-2xl font-bold">Dashboard</h1>
    <p class="mb-6">
      This page is protected. Only logged-in users can see this.
    </p>

    <div v-if="user" class="card bg-base-200 shadow-xl">
      <div class="card-body">
        <h2 class="card-title">User Information</h2>
        <p><strong>ID:</strong> {{ user.id }}</p>
        <p><strong>Email:</strong> {{ user.email }}</p>
        <p><strong>Name:</strong> {{ user.name || "N/A" }}</p>
        <p><strong>Roles:</strong></p>
        <ul class="list-inside list-disc">
          <li v-for="role in user.roles" :key="role.id">{{ role.name }}</li>
        </ul>
      </div>
    </div>
  </div>
</template>
