/**
 * Firebase Configuration for Yashal Dresses
 * 
 * You can set these values in 3 ways:
 * 1. Directly in this file below.
 * 2. In a `.env` file (e.g. VITE_FIREBASE_API_KEY=...).
 * 3. Directly in the Merchant Dashboard UI (Admin Settings -> Firebase Connect).
 */

const LOCAL_STORAGE_FIREBASE_KEY = 'yd_firebase_custom_config_v1';

export function getActiveFirebaseConfig() {
  const envConfig = {
    apiKey: import.meta.env?.VITE_FIREBASE_API_KEY || "",
    authDomain: import.meta.env?.VITE_FIREBASE_AUTH_DOMAIN || "",
    projectId: import.meta.env?.VITE_FIREBASE_PROJECT_ID || "",
    storageBucket: import.meta.env?.VITE_FIREBASE_STORAGE_BUCKET || "",
    messagingSenderId: import.meta.env?.VITE_FIREBASE_MESSAGING_SENDER_ID || "",
    appId: import.meta.env?.VITE_FIREBASE_APP_ID || "",
    measurementId: import.meta.env?.VITE_FIREBASE_MEASUREMENT_ID || "",
  };

  if (typeof window !== "undefined") {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_FIREBASE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.projectId && parsed.apiKey) {
          return { ...envConfig, ...parsed };
        }
      }
    } catch (e) {
      console.warn("Could not read custom Firebase config from localStorage", e);
    }
  }
  return envConfig;
}

export function saveCustomFirebaseConfig(config) {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(LOCAL_STORAGE_FIREBASE_KEY, JSON.stringify(config));
    } catch (e) {
      console.error("Failed to save custom Firebase config", e);
    }
  }
}

export function clearCustomFirebaseConfig() {
  if (typeof window !== "undefined") {
    try {
      localStorage.removeItem(LOCAL_STORAGE_FIREBASE_KEY);
    } catch (e) {
      console.error("Failed to remove custom Firebase config", e);
    }
  }
}

export function isFirebaseConfigured(config = getActiveFirebaseConfig()) {
  return Boolean(
    config.apiKey &&
    config.projectId &&
    !config.apiKey.includes("YOUR_") &&
    !config.projectId.includes("YOUR_")
  );
}
