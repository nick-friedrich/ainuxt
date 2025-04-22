// AI Generation Reference: See /ai/README.md for guidelines and patterns.
import { defineNuxtRouteMiddleware, navigateTo } from '#app';
import { useLocalePath } from '#imports';
import { useAuth } from '~/composables/useAuth';

export default defineNuxtRouteMiddleware((to, from) => {
  // Skip middleware on server
  if (import.meta.server) return;

  const { isLoggedIn } = useAuth();
  const localePath = useLocalePath();

  // Check if user is logged in
  if (!isLoggedIn.value) {
    // Redirect to localized login page preserving intended path
    const loginPath = localePath('/login');
    console.log('Auth middleware: User not logged in, redirecting to /login');
    return navigateTo(`${loginPath}?redirect=${encodeURIComponent(to.fullPath)}`);
  }
  console.log('Auth middleware: User logged in, proceeding.');
}); 