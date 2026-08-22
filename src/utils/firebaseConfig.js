/**
 * Firebase Configuration for Yashal Dresses
 * 
 * You can set these values in 3 ways:
 * 1. Directly in this file below.
 * 2. In a `.env` file (e.g. VITE_FIREBASE_API_KEY=...).
 * 3. Directly in the Merchant Dashboard UI (Admin Settings -> Firebase Connect).
 */

const LOCAL_STORAGE_FIREBASE_KEY = 'yd_firebase_custom_config_v1';

// Default Firebase credentials provided for yashal-2a13e
const DEFAULT_FIREBASE_CONFIG = {
  apiKey: "AIzaSyDLPawgTqfZr2zugOGAZegOE1z4hiARe0Y",
  authDomain: "yashal-2a13e.firebaseapp.com",
  databaseURL: "https://yashal-2a13e-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "yashal-2a13e",
  storageBucket: "yashal-2a13e.firebasestorage.app",
  messagingSenderId: "677490942717",
  appId: "1:677490942717:web:bd9ec655ebcdb5d705d494",
  measurementId: "G-2ZT1KR1MQF"
};

export function getActiveFirebaseConfig() {
  if (typeof window !== "undefined") {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_FIREBASE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.projectId && parsed.apiKey) {
          return { ...DEFAULT_FIREBASE_CONFIG, ...parsed };
        }
      }
    } catch (e) {
      console.warn("Could not read custom Firebase config from localStorage", e);
    }
  }
  return DEFAULT_FIREBASE_CONFIG;
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
