import { INITIAL_PRODUCTS, INITIAL_CATEGORIES, INITIAL_BRANDS } from '../data/initialData.js';

const STORAGE_KEYS = {
  PRODUCTS: 'yd_products_v3',
  CATEGORIES: 'yd_categories_v3',
  BRANDS: 'yd_brands_v3',
  ORDERS: 'yd_orders_v3',
  CART: 'yd_cart_v3',
  WISHLIST: 'yd_wishlist_v3',
  USER: 'yd_user_v3',
};

// Safe JSON parser
function safeParse(key, fallback) {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : fallback;
  } catch (err) {
    console.error(`Error loading key ${key}:`, err);
    return fallback;
  }
}

// Safe JSON setter
function safeSave(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error(`Error saving key ${key}:`, err);
  }
}

export function loadProducts() {
  return safeParse(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
}

export function saveProducts(products) {
  safeSave(STORAGE_KEYS.PRODUCTS, products);
}

export function loadCategories() {
  return safeParse(STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES);
}

export function saveCategories(categories) {
  safeSave(STORAGE_KEYS.CATEGORIES, categories);
}

export function loadBrands() {
  return safeParse(STORAGE_KEYS.BRANDS, INITIAL_BRANDS);
}

export function saveBrands(brands) {
  safeSave(STORAGE_KEYS.BRANDS, brands);
}

export function loadOrders() {
  const defaultOrders = [
    {
      id: "YD-ORD-2201",
      date: "10 Aug 2026",
      total: 3298,
      status: "Delivered",
      paymentMethod: "Razorpay (UPI)",
      transactionId: "PAY_UPI_9948271",
      items: [{ id: "YD-114", name: "Denim Trucker Jacket", size: "M", qty: 1, price: 2499 }, { id: "YD-100", name: "Ink Oxford Shirt", size: "L", qty: 1, price: 1499 }],
      address: { name: "Harsh Sharma", phone: "9876543210", line1: "102 MG Road, Koregaon Park", city: "Pune", state: "Maharashtra", pincode: "411001" },
    },
  ];
  return safeParse(STORAGE_KEYS.ORDERS, defaultOrders);
}

export function saveOrders(orders) {
  safeSave(STORAGE_KEYS.ORDERS, orders);
}

export function loadCart() {
  return safeParse(STORAGE_KEYS.CART, []);
}

export function saveCart(cart) {
  safeSave(STORAGE_KEYS.CART, cart);
}

export function loadWishlist() {
  return safeParse(STORAGE_KEYS.WISHLIST, []);
}

export function saveWishlist(wishlist) {
  safeSave(STORAGE_KEYS.WISHLIST, wishlist);
}

export function loadUser() {
  return safeParse(STORAGE_KEYS.USER, null);
}

export function saveUser(user) {
  safeSave(STORAGE_KEYS.USER, user);
}

/**
 * Deducts stock from products when an order is completed.
 */
export function deductStockForOrder(orderItems, currentProducts) {
  const updatedProducts = currentProducts.map((prod) => {
    // Find all order items for this product
    const itemsForProd = orderItems.filter((item) => item.id === prod.id);
    if (!itemsForProd.length) return prod;

    const newStock = { ...prod.stock };
    itemsForProd.forEach((item) => {
      const currentQty = newStock[item.size] || 0;
      newStock[item.size] = Math.max(0, currentQty - item.qty);
    });

    const totalRemaining = Object.values(newStock).reduce((sum, q) => sum + q, 0);
    const inStock = totalRemaining > 0 && prod.inStock;

    return {
      ...prod,
      stock: newStock,
      inStock,
    };
  });

  saveProducts(updatedProducts);
  return updatedProducts;
}

