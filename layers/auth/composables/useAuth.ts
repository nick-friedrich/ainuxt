// AI Generation Reference: See /ai/README.md for guidelines and patterns.
import { ref, computed } from 'vue';
import { useState, useFetch } from '#app';

// User type (adjust as needed)
type Role = { id: number; name: string };
export type AuthUser = {
  id: string;
  email: string;
  name?: string;
  roles: Role[];
  emailVerifiedAt?: Date;
} | null;

// State key for Nuxt useState
const USER_STATE_KEY = 'user';

export function useAuth() {
  // Global user state
  const user = useState<AuthUser>(USER_STATE_KEY, () => null);
  const isLoggedIn = computed(() => !!user.value);
  const loading = ref(false);
  const error = ref<string | null>(null);

  // Fetch current user from API
  async function fetchUser() {
    loading.value = true;
    error.value = null;
    try {
      const { data } = await useFetch<AuthUser>(() => '/api/auth/user', { method: 'GET' });
      user.value = data.value ?? null;
      return user.value;
    } catch (err: any) {
      user.value = null;
      error.value = err?.message || 'Failed to fetch user.';
      return null;
    } finally {
      loading.value = false;
    }
  }

  // Login
  async function login(email: string, password: string) {
    loading.value = true;
    error.value = null;
    try {
      const { data, error: fetchError } = await useFetch<AuthUser>('/api/auth/login', {
        method: 'POST',
        body: { email, password },
      });
      if (fetchError.value) throw fetchError.value;
      user.value = data.value ?? null;
      return true;
    } catch (err: any) {
      error.value = err?.data?.message || err?.message || 'Login failed.';
      user.value = null;
      return false;
    } finally {
      loading.value = false;
    }
  }

  // Register
  async function register(email: string, password: string, locale: string) {
    loading.value = true;
    error.value = null;
    try {
      const { data, error: fetchError } = await useFetch('/api/auth/register', {
        method: 'POST',
        body: { email, password, locale },
      });
      if (fetchError.value) throw fetchError.value;
      return data.value;
    } catch (err: any) {
      error.value = err?.data?.message || err?.message || 'Registration failed.';
      return { error: error.value };
    } finally {
      loading.value = false;
    }
  }

  // Logout
  async function logout() {
    loading.value = true;
    error.value = null;
    try {
      const { data: _data, error: fetchError } = await useFetch('/api/auth/logout', {
        method: 'POST',
      });
      if (fetchError.value) throw fetchError.value;
      user.value = null;
      return true;
    } catch (err: any) {
      error.value = err?.data?.message || err?.message || 'Logout failed.';
      return false;
    } finally {
      loading.value = false;
    }
  }

  return {
    user,
    isLoggedIn,
    loading,
    error,
    fetchUser,
    login,
    register,
    logout,
  };
} 