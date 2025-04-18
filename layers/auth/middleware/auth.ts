// AI Generation Reference: See /ai/README.md for guidelines and patterns.
import { defineNuxtRouteMiddleware, navigateTo } from '#app';
import { useAuth } from '~/composables/useAuth';

export default defineNuxtRouteMiddleware((to, from) => {
  // Skip middleware on server
  if (import.meta.server) return;

  const { isLoggedIn } = useAuth();

  // Check if user is logged in
  if (!isLoggedIn.value) {
    // Redirect to login page, preserving the intended destination
    console.log('Auth middleware: User not logged in, redirecting to /login');
    return navigateTo(`/login?redirect=${encodeURIComponent(to.fullPath)}`);
  }
  console.log('Auth middleware: User logged in, proceeding.');
}); 