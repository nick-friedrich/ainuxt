// AI Generation Reference: See ~/_ai/README.md for guidelines and patterns.
import { ref, watch } from 'vue'
import type { CookieRef } from '#app' // Import the type

// Define the type for consent status
export type CookieConsentStatus = 'accepted' | 'declined' | null

/**
 * Composable to manage cookie consent state using Nuxt's useCookie.
 */
export function useCookieConsent() {
  // Use Nuxt's useCookie for SSR-friendly state persistence
  // It automatically handles serialization and client/server differences.
  const consent: CookieRef<CookieConsentStatus> = useCookie<CookieConsentStatus>('cookie_consent', {
    default: () => null, // Default value if cookie doesn't exist
    maxAge: 365 * 24 * 60 * 60, // Store consent for 1 year
  })

  // Use useState for cross-component reactivity - this is crucial!
  // The banner visibility needs to be shared across all components using this composable
  const showBanner = useState<boolean>('cookie-banner-visible', () => consent.value === null)

  /** Accept cookies and hide banner */
  function acceptCookies() {
    consent.value = 'accepted'
    showBanner.value = false // Explicitly hide banner
    console.log(`[tracking] Cookie consent accepted`)
  }

  /** Decline cookies and hide banner */
  function declineCookies() {
    consent.value = 'declined'
    showBanner.value = false // Explicitly hide banner
    console.log(`[tracking] Cookie consent declined`)
  }

  /** Show the cookie banner manually without changing consent status */
  function showCookieSettings() {
    console.log('[tracking] Showing consent options dialog, current consent:', consent.value)
    showBanner.value = true // Just show the banner, don't change consent
    console.log('[tracking] Banner visibility set to:', showBanner.value)
  }

  // No need for explicit initializeConsent, useCookie handles it.

  return {
    consent, // The cookie ref itself (can be read directly)
    showBanner, // Reactive boolean for banner visibility (now using useState)
    acceptCookies,
    declineCookies,
    showCookieSettings, // Function to show settings without changing consent
  }
}
