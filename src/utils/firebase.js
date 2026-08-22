import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDocs,
  onSnapshot,
  deleteDoc,
  writeBatch
} from "firebase/firestore";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL
} from "firebase/storage";
import { getActiveFirebaseConfig, isFirebaseConfigured } from "./firebaseConfig";
import { INITIAL_PRODUCTS, INITIAL_CATEGORIES, INITIAL_BRANDS } from "../data/initialData";

let firebaseApp = null;
let firestoreDb = null;
let firebaseStorage = null;

/**
 * Initializes Firebase dynamically if valid config is present.
 */
export function getFirebaseInstance() {
  const config = getActiveFirebaseConfig();
  const configured = isFirebaseConfigured(config);

  if (!configured) {
    return { app: null, db: null, storage: null, isLive: false };
  }

  try {
    if (!getApps().length) {
      firebaseApp = initializeApp(config);
    } else {
      firebaseApp = getApp();
    }
    firestoreDb = getFirestore(firebaseApp);
    firebaseStorage = getStorage(firebaseApp);
    return { app: firebaseApp, db: firestoreDb, storage: firebaseStorage, isLive: true };
  } catch (err) {
    console.error("Firebase initialization failed:", err);
    return { app: null, db: null, storage: null, isLive: false };
  }
}

/**
 * Compresses an image client-side before uploading to ensure fast page loads.
 */
export async function compressImage(file, maxWidth = 1200, quality = 0.85) {
  return new Promise((resolve) => {
    if (!file.type.startsWith("image/")) {
      resolve(file);
      return;
    }

    const img = new Image();
    const reader = new FileReader();

    reader.onload = (e) => {
      img.src = e.target.result;
    };

    img.onload = () => {
      const canvas = document.createElement("canvas");
      let width = img.width;
      let height = img.height;

      if (width > maxWidth) {
        height = Math.round((height * maxWidth) / width);
        width = maxWidth;
      }

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            resolve(file);
            return;
          }
          const compressedFile = new File([blob], file.name, {
            type: "image/jpeg",
            lastModified: Date.now(),
          });
          resolve(compressedFile);
        },
        "image/jpeg",
        quality
      );
    };

    img.onerror = () => resolve(file);
    reader.readAsDataURL(file);
  });
}

/**
 * Uploads a garment photo to Firebase Storage with progress tracking.
 * Falls back to Base64 data URL if Firebase is not connected.
 */
export async function uploadGarmentPhoto(file, garmentId, onProgress = null) {
  const { storage, isLive } = getFirebaseInstance();

  // If Firebase is not configured, fall back to Base64 locally
  if (!isLive || !storage) {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (onProgress) onProgress(100);
        resolve({
          url: reader.result,
          isCloud: false,
          message: "Saved locally (Connect Firebase in Merchant Settings for Cloud CDN sync)"
        });
      };
      reader.readAsDataURL(file);
    });
  }

  try {
    // Compress image client side first
    const processedFile = await compressImage(file);
    const cleanId = (garmentId || "garment").replace(/[^a-zA-Z0-9_-]/g, "");
    const filename = `garments/${cleanId}_${Date.now()}_${file.name.replace(/\s+/g, "_")}`;
    const storageRef = ref(storage, filename);

    const uploadTask = uploadBytesResumable(storageRef, processedFile, {
      contentType: processedFile.type || "image/jpeg",
      customMetadata: { garmentId: cleanId }
    });

    return new Promise((resolve, reject) => {
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          if (onProgress) onProgress(progress);
        },
        (error) => {
          console.error("Firebase Storage upload error:", error);
          // Fallback to local Base64 on upload error
          const reader = new FileReader();
          reader.onloadend = () => {
            resolve({
              url: reader.result,
              isCloud: false,
              message: "Cloud upload error, saved locally as fallback: " + error.message
            });
          };
          reader.readAsDataURL(file);
        },
        async () => {
          const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
          resolve({
            url: downloadUrl,
            isCloud: true,
            message: "Uploaded successfully to Firebase Cloud Storage!"
          });
        }
      );
    });
  } catch (err) {
    console.error("Upload handler exception:", err);
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve({ url: reader.result, isCloud: false, message: err.message });
      };
      reader.readAsDataURL(file);
    });
  }
}

/**
 * Real-time listener for Products in Firestore.
 */
export function subscribeToLiveProducts(onProductsUpdated) {
  const { db, isLive } = getFirebaseInstance();
  if (!isLive || !db) return () => {};

  const colRef = collection(db, "yd_products");
  const unsubscribe = onSnapshot(
    colRef,
    async (snapshot) => {
      if (snapshot.empty) {
        // Initial setup: auto-seed catalog to Firestore
        console.log("Firestore yd_products is empty. Seeding initial catalog...");
        await seedFirestoreCatalog(db);
        return;
      }
      const prods = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));
      onProductsUpdated(prods);
    },
    (err) => {
      console.warn("Firestore products snapshot listener warning:", err);
    }
  );

  return unsubscribe;
}

/**
 * Real-time listener for Categories in Firestore.
 */
export function subscribeToLiveCategories(onCategoriesUpdated) {
  const { db, isLive } = getFirebaseInstance();
  if (!isLive || !db) return () => {};

  const colRef = collection(db, "yd_categories");
  const unsubscribe = onSnapshot(
    colRef,
    async (snapshot) => {
      if (snapshot.empty) return;
      const cats = snapshot.docs.map((doc) => ({
        ...doc.data()
      }));
      if (cats.length) onCategoriesUpdated(cats);
    },
    (err) => console.warn("Firestore categories snapshot error:", err)
  );

  return unsubscribe;
}

/**
 * Real-time listener for Brands in Firestore.
 */
export function subscribeToLiveBrands(onBrandsUpdated) {
  const { db, isLive } = getFirebaseInstance();
  if (!isLive || !db) return () => {};

  const colRef = collection(db, "yd_brands");
  const unsubscribe = onSnapshot(
    colRef,
    (snapshot) => {
      if (snapshot.empty) return;
      const brands = snapshot.docs.map((doc) => ({
        ...doc.data()
      }));
      if (brands.length) onBrandsUpdated(brands);
    },
    (err) => console.warn("Firestore brands snapshot error:", err)
  );

  return unsubscribe;
}

/**
 * Real-time listener for Orders in Firestore.
 */
export function subscribeToLiveOrders(onOrdersUpdated) {
  const { db, isLive } = getFirebaseInstance();
  if (!isLive || !db) return () => {};

  const colRef = collection(db, "yd_orders");
  const unsubscribe = onSnapshot(
    colRef,
    (snapshot) => {
      if (snapshot.empty) return;
      const orders = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));
      onOrdersUpdated(orders);
    },
    (err) => console.warn("Firestore orders snapshot error:", err)
  );

  return unsubscribe;
}

/**
 * Saves or updates a product in Firestore.
 */
export async function saveProductToFirestore(product) {
  const { db, isLive } = getFirebaseInstance();
  if (!isLive || !db || !product?.id) return false;

  try {
    const docRef = doc(db, "yd_products", String(product.id));
    await setDoc(docRef, product, { merge: true });
    return true;
  } catch (err) {
    console.error("Failed to save product to Firestore:", err);
    return false;
  }
}

/**
 * Deletes a product from Firestore.
 */
export async function deleteProductFromFirestore(productId) {
  const { db, isLive } = getFirebaseInstance();
  if (!isLive || !db || !productId) return false;

  try {
    const docRef = doc(db, "yd_products", String(productId));
    await deleteDoc(docRef);
    return true;
  } catch (err) {
    console.error("Failed to delete product from Firestore:", err);
    return false;
  }
}

/**
 * Saves or updates category list in Firestore.
 */
export async function syncCategoriesToFirestore(categories) {
  const { db, isLive } = getFirebaseInstance();
  if (!isLive || !db || !categories?.length) return false;

  try {
    const batch = writeBatch(db);
    categories.forEach((c) => {
      const docId = c.name.replace(/[^a-zA-Z0-9_-]/g, "_");
      const ref = doc(db, "yd_categories", docId);
      batch.set(ref, c, { merge: true });
    });
    await batch.commit();
    return true;
  } catch (err) {
    console.error("Failed to sync categories to Firestore:", err);
    return false;
  }
}

/**
 * Saves a completed order to Firestore.
 */
export async function saveOrderToFirestore(order) {
  const { db, isLive } = getFirebaseInstance();
  if (!isLive || !db || !order?.id) return false;

  try {
    const docRef = doc(db, "yd_orders", String(order.id));
    await setDoc(docRef, order, { merge: true });
    return true;
  } catch (err) {
    console.error("Failed to save order to Firestore:", err);
    return false;
  }
}

/**
 * Seeds initial store catalog into Firestore when first connected.
 */
export async function seedFirestoreCatalog(db) {
  if (!db) return;
  try {
    const batch = writeBatch(db);

    INITIAL_PRODUCTS.forEach((prod) => {
      const ref = doc(db, "yd_products", String(prod.id));
      batch.set(ref, prod, { merge: true });
    });

    INITIAL_CATEGORIES.forEach((cat) => {
      const docId = cat.name.replace(/[^a-zA-Z0-9_-]/g, "_");
      const ref = doc(db, "yd_categories", docId);
      batch.set(ref, cat, { merge: true });
    });

    INITIAL_BRANDS.forEach((b) => {
      const docId = b.name.replace(/[^a-zA-Z0-9_-]/g, "_");
      const ref = doc(db, "yd_brands", docId);
      batch.set(ref, b, { merge: true });
    });

    await batch.commit();
    console.log("Firestore catalog successfully populated with initial boutique garments.");
  } catch (err) {
    console.error("Error seeding initial data to Firestore:", err);
  }
}
