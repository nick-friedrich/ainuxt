// AI Generation Reference: See /ai/README.md for guidelines and patterns.
import { defineNuxtRouteMiddleware, navigateTo } from '#app';
import { useLocalePath } from '#imports';
import { useAuth } from '~/composables/useAuth';

export default defineNuxtRouteMiddleware((to, from) => {
  // Skip middleware on server
  if (import.meta.server) return;

  const { isLoggedIn } = useAuth();
  const localePath = useLocalePath();

  // If user is logged in, redirect away from guest pages (login/register)
  if (isLoggedIn.value) {
    console.log('Guest middleware: User logged in, redirecting to /');
    return navigateTo(localePath('/'));
  }
  console.log('Guest middleware: User not logged in, allowing access.');
}); 