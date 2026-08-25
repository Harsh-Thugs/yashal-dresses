import React, { useState, useEffect, useMemo } from 'react';
import BrandStyles from './components/BrandStyles';
import CurtainIntro from './components/CurtainIntro';
import Header from './components/Header';
import Hero from './components/Hero';
import FestiveBanner from './components/FestiveBanner';
import CategoryRail from './components/CategoryRail';
import ProductCard from './components/ProductCard';
import ProductPage from './components/ProductPage';
import Lookbook from './components/Lookbook';
import ShopPage from './components/ShopPage';
import CartDrawer from './components/CartDrawer';
import { CheckoutPage, RazorpayGatewayModal, ConfirmationPage } from './components/CheckoutModal';
import AdminDashboard from './components/AdminDashboard';
import { LoginModal, MerchantLoginModal } from './components/LoginModal';
import InquiryModal from './components/InquiryModal';
import FloatingInquiryButton from './components/FloatingInquiryButton';
import Footer from './components/Footer';
import OrdersPage from './components/OrdersPage';

import {
  INITIAL_CATEGORIES,
  INITIAL_BRANDS,
  INITIAL_PRODUCTS,
  INITIAL_ORDERS,
  STORE_CONTACT,
  money
} from './data/initialData';

import {
  getFirebaseInstance,
  saveProductToFirestore,
  deleteProductFromFirestore,
  saveOrderToFirestore,
  seedFirestoreCatalog,
  sendOrderConfirmationEmail
} from './utils/firebase';

import {
  getActiveFirebaseConfig,
  saveCustomFirebaseConfig,
  isFirebaseConfigured
} from './utils/firebaseConfig';

import { collection, onSnapshot } from 'firebase/firestore';

export default function App() {
  // Page Routing: 'home' | 'shop' | 'product' | 'checkout' | 'confirmation' | 'admin' | 'orders'
  const [page, setPage] = useState('home');
  const [activeCategory, setActiveCategory] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [query, setQuery] = useState('');

  // Datasets
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem('yd_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  const [categories, setCategories] = useState(() => {
    const saved = localStorage.getItem('yd_categories');
    return saved ? JSON.parse(saved) : INITIAL_CATEGORIES;
  });

  const [brands, setBrands] = useState(() => {
    const saved = localStorage.getItem('yd_brands');
    return saved ? JSON.parse(saved) : INITIAL_BRANDS;
  });

  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem('yd_orders');
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  // Cart & Wishlist
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('yd_cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [wishlist, setWishlist] = useState(() => {
    const saved = localStorage.getItem('yd_wishlist');
    return saved ? JSON.parse(saved) : [];
  });
  const [isCartOpen, setIsCartOpen] = useState(false);

  // User & Auth
  const [user, setUser] = useState(null);
  const [isUserLoginOpen, setIsUserLoginOpen] = useState(false);
  const [isMerchantLockOpen, setIsMerchantLockOpen] = useState(false);
  const [isAdminUnlocked, setIsAdminUnlocked] = useState(() => {
    return sessionStorage.getItem('yd_admin_unlocked') === 'true';
  });

  // Admin Modals & State
  const [editingProduct, setEditingProduct] = useState(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);

  // Inquiries
  const [isInquiryOpen, setIsInquiryOpen] = useState(false);
  const [inquiryProduct, setInquiryProduct] = useState(null);

  // Payment Gateway & Active Order Flow
  const [paymentDraft, setPaymentDraft] = useState(null);
  const [confirmedOrder, setConfirmedOrder] = useState(null);

  // Firebase Config State
  const [firebaseConfig, setFirebaseConfig] = useState(() => getActiveFirebaseConfig());
  const [isFirebaseLive, setIsFirebaseLive] = useState(false);

  // Persist local changes to localStorage
  useEffect(() => { localStorage.setItem('yd_products', JSON.stringify(products)); }, [products]);
  useEffect(() => { localStorage.setItem('yd_categories', JSON.stringify(categories)); }, [categories]);
  useEffect(() => { localStorage.setItem('yd_brands', JSON.stringify(brands)); }, [brands]);
  useEffect(() => { localStorage.setItem('yd_orders', JSON.stringify(orders)); }, [orders]);
  useEffect(() => { localStorage.setItem('yd_cart', JSON.stringify(cart)); }, [cart]);
  useEffect(() => { localStorage.setItem('yd_wishlist', JSON.stringify(wishlist)); }, [wishlist]);

  // Realtime Firebase Firestore Listeners
  useEffect(() => {
    const { db, isLive } = getFirebaseInstance();
    setIsFirebaseLive(isLive);
    if (!isLive || !db) return;

    // Listen to Products
    const unsubProds = onSnapshot(collection(db, 'yd_products'), (snap) => {
      if (!snap.empty) {
        const loaded = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        setProducts(loaded);
      }
    }, (err) => console.warn('Firestore products listener:', err));

    // Listen to Categories
    const unsubCats = onSnapshot(collection(db, 'yd_categories'), (snap) => {
      if (!snap.empty) {
        const loaded = snap.docs.map(d => ({ ...d.data() }));
        setCategories(loaded);
      }
    }, (err) => console.warn('Firestore categories listener:', err));

    // Listen to Brands
    const unsubBrands = onSnapshot(collection(db, 'yd_brands'), (snap) => {
      if (!snap.empty) {
        const loaded = snap.docs.map(d => ({ ...d.data() }));
        setBrands(loaded);
      }
    }, (err) => console.warn('Firestore brands listener:', err));

    // Listen to Orders
    const unsubOrders = onSnapshot(collection(db, 'yd_orders'), (snap) => {
      if (!snap.empty) {
        const loaded = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        setOrders(loaded);
      }
    }, (err) => console.warn('Firestore orders listener:', err));

    return () => {
      unsubProds();
      unsubCats();
      unsubBrands();
      unsubOrders();
    };
  }, [firebaseConfig]);

  // Browser Navigation History (pushState / popstate)
  useEffect(() => {
    const handlePopState = (e) => {
      if (e.state) {
        if (e.state.page) setPage(e.state.page);
        if (e.state.productId) {
          const p = products.find(prod => prod.id === e.state.productId);
          if (p) setSelectedProduct(p);
        }
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [products]);

  const navigateTo = (targetPage, prod = null) => {
    setPage(targetPage);
    if (prod) {
      setSelectedProduct(prod);
      window.history.pushState({ page: targetPage, productId: prod.id }, '', `#${targetPage}/${prod.id}`);
    } else {
      window.history.pushState({ page: targetPage }, '', `#${targetPage}`);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Cart Handlers
  const addToCart = (product, size = 'M', qty = 1) => {
    setCart((prev) => {
      const idx = prev.findIndex((i) => i.id === product.id && i.size === size);
      if (idx > -1) {
        const updated = [...prev];
        updated[idx].qty += qty;
        return updated;
      }
      return [...prev, { id: product.id, size, qty }];
    });
    setIsCartOpen(true);
  };

  const updateCartQty = (id, size, delta) => {
    setCart((prev) => {
      return prev
        .map((i) => (i.id === id && i.size === size ? { ...i, qty: i.qty + delta } : i))
        .filter((i) => i.qty > 0);
    });
  };

  const removeCartItem = (id, size) => {
    setCart((prev) => prev.filter((i) => !(i.id === id && i.size === size)));
  };

  const toggleWishlist = (productId) => {
    setWishlist((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  // Admin Product Handlers
  const handleSaveProduct = async (productData) => {
    setProducts((prev) => {
      const exists = prev.some((p) => p.id === productData.id);
      if (exists) {
        return prev.map((p) => (p.id === productData.id ? productData : p));
      }
      return [productData, ...prev];
    });

    // Sync to Firestore
    await saveProductToFirestore(productData);
  };

  const handleDeleteProduct = async (productId) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    await deleteProductFromFirestore(productId);
  };

  const handleQuickToggleStock = async (productId) => {
    const prod = products.find((p) => p.id === productId);
    if (!prod) return;
    const isNowInStock = !prod.inStock;
    const updated = { ...prod, inStock: isNowInStock };
    setProducts((prev) => prev.map((p) => (p.id === productId ? updated : p)));
    await saveProductToFirestore(updated);
  };

  const handleSaveFirebaseConfig = (newCfg) => {
    saveCustomFirebaseConfig(newCfg);
    setFirebaseConfig(newCfg);
  };

  const handleSeedFirebase = async () => {
    const { db } = getFirebaseInstance();
    if (db) {
      await seedFirestoreCatalog(db);
      alert('✓ Initial 52 bespoke garments seeded to Firebase Firestore!');
    }
  };

  // Order & Payment Flow
  const handleProceedToPayment = (orderDraft) => {
    setPaymentDraft(orderDraft);
  };

  const handlePaymentSuccess = async (txId) => {
    const newOrder = {
      id: `ORD-${Math.floor(10000 + Math.random() * 90000)}`,
      date: new Date().toISOString(),
      customer: paymentDraft.customer,
      items: paymentDraft.items,
      subtotal: paymentDraft.subtotal,
      shipping: paymentDraft.shipping,
      total: paymentDraft.total,
      paymentMethod: paymentDraft.paymentMethod,
      transactionId: txId,
      status: 'Confirmed',
    };

    setOrders((prev) => [newOrder, ...prev]);
    setCart([]);
    setPaymentDraft(null);
    setConfirmedOrder(newOrder);
    setPage('confirmation');

    // Save to Firestore
    await saveOrderToFirestore(newOrder);

    // Auto-dispatch confirmation email
    await sendOrderConfirmationEmail(newOrder);
  };

  // Resolve currently active product dynamically so edits in admin reflect immediately
  const activeProduct = useMemo(() => {
    if (!selectedProduct) return null;
    return products.find((p) => p.id === selectedProduct.id) || selectedProduct;
  }, [products, selectedProduct]);

  return (
    <div className="yd-root min-h-screen flex flex-col">
      <BrandStyles />
      <CurtainIntro />

      {/* Header */}
      <Header
        page={page}
        setPage={(pg) => navigateTo(pg)}
        query={query}
        setQuery={setQuery}
        cartCount={cart.reduce((sum, it) => sum + it.qty, 0)}
        onCartClick={() => setIsCartOpen(true)}
        user={user}
        onLoginClick={() => setIsUserLoginOpen(true)}
        onMenuClick={() => setIsCartOpen(true)}
        isAdminMode={page === 'admin'}
        setIsAdminMode={(val) => {
          if (val) {
            if (isAdminUnlocked) navigateTo('admin');
            else setIsMerchantLockOpen(true);
          } else {
            navigateTo('home');
          }
        }}
        onInquiryClick={() => {
          setInquiryProduct(null);
          setIsInquiryOpen(true);
        }}
      />

      {/* Main Content Router */}
      <main className="flex-1">
        {page === 'home' && (
          <>
            <Hero
              setPage={(pg) => navigateTo(pg)}
              setActiveCategory={(cat) => {
                setActiveCategory(cat);
                navigateTo('shop');
              }}
              products={products}
            />
            <FestiveBanner
              setPage={(pg) => navigateTo(pg)}
              setActiveCategory={(cat) => {
                setActiveCategory(cat);
                navigateTo('shop');
              }}
            />
            <CategoryRail
              categories={categories}
              activeCategory={activeCategory}
              setActiveCategory={(cat) => {
                setActiveCategory(cat);
                navigateTo('shop');
              }}
            />

            {/* Curated Bestsellers Grid */}
            <section className="max-w-7xl mx-auto px-4 md:px-6 py-12">
              <div className="flex justify-between items-end mb-8">
                <div>
                  <span className="font-mono text-xs text-[var(--mustard-deep)] uppercase tracking-widest block mb-1">
                    ATELIER SPOTLIGHT
                  </span>
                  <h2 className="font-display text-2xl md:text-3xl font-semibold">
                    Signature Ready-to-Wear
                  </h2>
                </div>
                <button
                  onClick={() => navigateTo('shop')}
                  className="font-mono text-xs text-[var(--ink)] hover:text-[var(--mustard-deep)] font-semibold flex items-center gap-1"
                >
                  Explore All 52 Designs →
                </button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                {(products || []).slice(0, 8).map((p, idx) => (
                  <ProductCard
                    key={p.id}
                    p={p}
                    index={idx}
                    brands={brands}
                    wishlist={wishlist}
                    toggleWish={toggleWishlist}
                    onOpen={(prod) => navigateTo('product', prod)}
                  />
                ))}
              </div>
            </section>

            <Lookbook
              products={products}
              onOpen={(prod) => navigateTo('product', prod)}
              setPage={(pg) => navigateTo(pg)}
            />
          </>
        )}

        {page === 'shop' && (
          <ShopPage
            query={query}
            setQuery={setQuery}
            activeCategory={activeCategory}
            setActiveCategory={setActiveCategory}
            categories={categories}
            products={products}
            brands={brands}
            wishlist={wishlist}
            toggleWish={toggleWishlist}
            onOpen={(prod) => navigateTo('product', prod)}
          />
        )}

        {page === 'product' && activeProduct && (
          <ProductPage
            product={activeProduct}
            products={products}
            brands={brands}
            setPage={(pg) => navigateTo(pg)}
            goBack={() => navigateTo('shop')}
            addToCart={addToCart}
            wishlist={wishlist}
            toggleWish={toggleWishlist}
            onOpen={(prod) => navigateTo('product', prod)}
          />
        )}

        {page === 'checkout' && (
          <CheckoutPage
            cart={cart}
            products={products}
            setPage={(pg) => navigateTo(pg)}
            onProceedToPayment={handleProceedToPayment}
            user={user}
          />
        )}

        {page === 'confirmation' && confirmedOrder && (
          <ConfirmationPage
            order={confirmedOrder}
            setPage={(pg) => navigateTo(pg)}
            onSendEmailConfirmation={sendOrderConfirmationEmail}
          />
        )}

        {page === 'orders' && (
          <OrdersPage
            orders={orders}
            products={products}
            setPage={(pg) => navigateTo(pg)}
          />
        )}

        {page === 'admin' && (
          <AdminDashboard
            products={products}
            setProducts={setProducts}
            categories={categories}
            setCategories={setCategories}
            brands={brands}
            setBrands={setBrands}
            orders={orders}
            onLogout={() => {
              setIsAdminUnlocked(false);
              sessionStorage.removeItem('yd_admin_unlocked');
              navigateTo('home');
            }}
            onOpenAddProductModal={() => {
              setEditingProduct(null);
              setIsProductModalOpen(true);
            }}
            onSeedFirebase={handleSeedFirebase}
            firebaseStatus={isFirebaseLive}
            firebaseConfig={firebaseConfig}
            onSaveFirebaseConfig={handleSaveFirebaseConfig}
            editingProduct={editingProduct}
            setEditingProduct={setEditingProduct}
            isProductModalOpen={isProductModalOpen}
            setIsProductModalOpen={setIsProductModalOpen}
            onSaveProduct={handleSaveProduct}
            onDeleteProduct={handleDeleteProduct}
            onQuickToggleStock={handleQuickToggleStock}
          />
        )}
      </main>

      {/* Floating Inquiry Button & Modal */}
      <FloatingInquiryButton onClick={() => { setInquiryProduct(null); setIsInquiryOpen(true); }} />
      <InquiryModal
        open={isInquiryOpen}
        close={() => setIsInquiryOpen(false)}
        initialProduct={inquiryProduct}
      />

      {/* Cart Drawer */}
      <CartDrawer
        open={isCartOpen}
        close={() => setIsCartOpen(false)}
        cart={cart}
        products={products}
        updateQty={(id, delta, size) => updateCartQty(id, size, delta)}
        removeItem={(id, size) => removeCartItem(id, size)}
        setPage={(pg) => {
          setIsCartOpen(false);
          navigateTo(pg);
        }}
        user={user}
        openLogin={() => setIsUserLoginOpen(true)}
      />

      {/* User Login Modal */}
      <LoginModal
        open={isUserLoginOpen}
        close={() => setIsUserLoginOpen(false)}
        onLogin={(userData) => {
          setUser(userData);
          setIsUserLoginOpen(false);
        }}
      />

      {/* Merchant PIN Lock Modal */}
      <MerchantLoginModal
        open={isMerchantLockOpen}
        close={() => setIsMerchantLockOpen(false)}
        onUnlock={() => {
          setIsAdminUnlocked(true);
          sessionStorage.setItem('yd_admin_unlocked', 'true');
          navigateTo('admin');
        }}
      />

      {/* Razorpay Gateway Simulation Modal */}
      <RazorpayGatewayModal
        orderDraft={paymentDraft}
        onSuccess={handlePaymentSuccess}
        onCancel={() => setPaymentDraft(null)}
      />

      {/* Footer */}
      <Footer
        setPage={(pg) => navigateTo(pg)}
        setActiveCategory={(cat) => {
          setActiveCategory(cat);
          navigateTo('shop');
        }}
        onOpenInquiry={() => {
          setInquiryProduct(null);
          setIsInquiryOpen(true);
        }}
      />
    </div>
  );
}
