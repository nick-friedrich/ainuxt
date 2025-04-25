<!-- AI Generation Reference: See ~/_ai/README.md for guidelines and patterns. -->
<script setup lang="ts">
// Import the cookie consent composable
import { useCookieConsent } from "../composables/useCookieConsent";
import { onMounted, watch, ref } from "vue";

// Get the consent state from the composable
const { consent } = useCookieConsent();

// Track if scripts have been loaded
const scriptsLoaded = ref(false);

// Create a function to load your tracking scripts
function loadTrackingScripts() {
  console.log("[tracking] Loading tracking scripts...");

  // ===== ADD YOUR TRACKING SCRIPTS HERE =====

  // Example: Google Tag Manager
  const GTM_ID = ""; // Replace with your GTM-XXXXXX ID
  if (GTM_ID) {
    console.log(`[tracking] Loading Google Tag Manager with ID: ${GTM_ID}`);

    // GTM script for <head>
    const gtmScript = document.createElement("script");
    gtmScript.innerHTML = `
      (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
      new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
      j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
      'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
      })(window,document,'script','dataLayer','${GTM_ID}');
    `;
    document.head.appendChild(gtmScript);

    // GTM noscript element for <body>
    const gtmNoScript = document.createElement("noscript");
    const gtmIframe = document.createElement("iframe");
    gtmIframe.src = `https://www.googletagmanager.com/ns.html?id=${GTM_ID}`;
    gtmIframe.height = "0";
    gtmIframe.width = "0";
    gtmIframe.style.display = "none";
    gtmIframe.style.visibility = "hidden";
    gtmNoScript.appendChild(gtmIframe);
    document.body.appendChild(gtmNoScript);
  }

  // Example: Facebook Pixel
  const FB_PIXEL_ID = ""; // Replace with your Facebook Pixel ID
  if (FB_PIXEL_ID) {
    console.log(`[tracking] Loading Facebook Pixel with ID: ${FB_PIXEL_ID}`);

    // Facebook Pixel base code
    const fbPixelScript = document.createElement("script");
    fbPixelScript.innerHTML = `
      !function(f,b,e,v,n,t,s)
      {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
      n.callMethod.apply(n,arguments):n.queue.push(arguments)};
      if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
      n.queue=[];t=b.createElement(e);t.async=!0;
      t.src=v;s=b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t,s)}(window, document,'script',
      'https://connect.facebook.net/en_US/fbevents.js');
      fbq('init', '${FB_PIXEL_ID}');
      fbq('track', 'PageView');
    `;
    document.head.appendChild(fbPixelScript);

    // Facebook Pixel noscript
    const fbNoScript = document.createElement("noscript");
    const fbImg = document.createElement("img");
    fbImg.height = 1;
    fbImg.width = 1;
    fbImg.style.display = "none";
    fbImg.src = `https://www.facebook.com/tr?id=${FB_PIXEL_ID}&ev=PageView&noscript=1`;
    fbNoScript.appendChild(fbImg);
    document.body.appendChild(fbNoScript);
  }

  // Example: Custom Analytics Script
  const customScript = `
    // Add your custom tracking script here
    console.log('[tracking] Custom tracking initialized');
    // window.myAnalytics = { initialized: true };
  `;
  if (customScript.trim()) {
    console.log("[tracking] Loading custom script");
    const customScriptElement = document.createElement("script");
    customScriptElement.innerHTML = customScript;
    document.head.appendChild(customScriptElement);
  }

  // ===== END OF TRACKING SCRIPTS =====
}

// Watch for consent changes
watch(
  () => consent.value,
  (newValue, oldValue) => {
    console.log("[tracking] Consent changed:", newValue, oldValue);

    if (newValue === "accepted") {
      if (!scriptsLoaded.value && process.client) {
        loadTrackingScripts();
        scriptsLoaded.value = true;
      }
    } else if (newValue === "declined") {
      // If scripts were previously loaded and now consent is declined, reload
      if (scriptsLoaded.value) {
        console.log(
          "[tracking] Consent declined after scripts were loaded, reloading page..."
        );
        scriptsLoaded.value = false;
        setTimeout(() => window.location.reload(), 50);
      }
    }
    // We don't need to do anything when consent is null now, since that shouldn't happen anymore
  },
  { immediate: true }
);

// onMounted only for things that MUST run after DOM is available
onMounted(() => {
  console.log(
    "[tracking] TrackingScripts component mounted, consent:",
    consent.value
  );
  // No duplicate logic here since the watch with immediate:true handles initial check
});
</script>

<!-- This component doesn't render anything visible -->
<template>
  <!-- Empty template - this component only adds scripts -->
</template>
