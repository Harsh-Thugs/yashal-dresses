import React, { useState, useEffect, useMemo } from 'react';
import { Routes, Route, useNavigate, useLocation, useParams } from 'react-router-dom';
import { StoreProvider } from './StoreContext';

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
import { CheckoutPage, ConfirmationPage } from './components/CheckoutModal';
import { loadRazorpayScript } from './utils/razorpay';
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
  sendOrderConfirmationEmail,
  saveCategoryToFirestore,
  deleteCategoryFromFirestore,
  saveBrandToFirestore,
  deleteBrandFromFirestore,
  syncCategoriesToFirestore
} from './utils/firebase';

import {
  getActiveFirebaseConfig,
  isFirebaseConfigured
} from './utils/firebaseConfig';

import { collection, onSnapshot } from 'firebase/firestore';

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();

  const [activeCategory, setActiveCategory] = useState(null);
  const [query, setQuery] = useState('');

  // Datasets
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [categories, setCategories] = useState(INITIAL_CATEGORIES);
  const [brands, setBrands] = useState(INITIAL_BRANDS);

  const brandMap = useMemo(() => {
    const map = {};
    if (brands && brands.length) {
      brands.forEach(b => {
        map[b.name] = b;
      });
    }
    return map;
  }, [brands]);
  const [orders, setOrders] = useState(INITIAL_ORDERS);

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
  const [adminUser, setAdminUser] = useState(null);
  const isAdminUnlocked = Boolean(adminUser);

  useEffect(() => {
    let unsubscribe = () => {};
    import('./utils/firebase').then(({ subscribeToAuthChanges }) => {
      unsubscribe = subscribeToAuthChanges((u) => setAdminUser(u));
    });
    return () => unsubscribe();
  }, []);

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
  const [isFirebaseLive, setIsFirebaseLive] = useState(false);

  // Persist local changes to localStorage
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
  }, []);

  // Navigation effect for scroll-to-top
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);

  // Cart Handlers
  const addToCart = (product, size = 'M', qty = 1, color = null) => {
    setCart((prev) => {
      const idx = prev.findIndex((i) => i.id === product.id && i.size === size && (i.color || null) === (color || null));
      if (idx > -1) {
        const updated = [...prev];
        updated[idx].qty += qty;
        return updated;
      }
      return [...prev, { id: product.id, size, qty, color: color || null }];
    });
    setIsCartOpen(true);
  };

  const updateCartQty = (id, size, delta, color = null) => {
    setCart((prev) => {
      return prev
        .map((i) => (i.id === id && i.size === size && (i.color || null) === (color || null) ? { ...i, qty: i.qty + delta } : i))
        .filter((i) => i.qty > 0);
    });
  };

  const removeCartItem = (id, size, color = null) => {
    setCart((prev) => prev.filter((i) => !(i.id === id && i.size === size && (i.color || null) === (color || null))));
  };

  const toggleWishlist = (productId) => {
    setWishlist((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  // Admin Category & Brand Handlers
  const handleSaveCategory = async (newCategory) => {
    setCategories((prev) => {
      const exists = prev.some((c) => c.name.toLowerCase() === newCategory.name.toLowerCase());
      if (exists) return prev;
      return [...prev, newCategory];
    });
    await saveCategoryToFirestore(newCategory);
  };

  const handleDeleteCategory = async (categoryName) => {
    setCategories((prev) => prev.filter((c) => c.name !== categoryName));
    await deleteCategoryFromFirestore(categoryName);
  };

  const handleSaveBrand = async (newBrand) => {
    setBrands((prev) => {
      const exists = prev.some((b) => b.name.toLowerCase() === newBrand.name.toLowerCase());
      if (exists) return prev;
      return [...prev, newBrand];
    });
    await saveBrandToFirestore(newBrand);
  };

  const handleDeleteBrand = async (brandName) => {
    setBrands((prev) => prev.filter((b) => b.name !== brandName));
    await deleteBrandFromFirestore(brandName);
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



  const handleSeedFirebase = async () => {
    const { db } = getFirebaseInstance();
    if (db) {
      await seedFirestoreCatalog(db);
      alert('✓ Initial 52 bespoke garments seeded to Firebase Firestore!');
    }
  };

  // Order & Payment Flow
  const handleProceedToPayment = async (orderDraft) => {
    if (orderDraft.paymentMethod === "Cash on Delivery") {
      setPaymentDraft(orderDraft);
      handlePaymentSuccess(`COD-${Date.now()}`, orderDraft);
      return;
    }

    const res = await loadRazorpayScript();
    if (!res) {
      alert("Razorpay SDK failed to load. Are you online?");
      return;
    }

    try {
      const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:5000' : '');
      const orderResponse = await fetch(`${API_URL}/api/create-razorpay-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: orderDraft.total })
      });
      
      const orderData = await orderResponse.json();

      if (!orderResponse.ok) {
        throw new Error(orderData.error || 'Failed to initialize order');
      }

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Yashal Dresses Atelier",
        description: "Bespoke Garment Purchase",
        image: "https://yashaldresses.com/logo.png",
        order_id: orderData.id,
        handler: async function (response) {
          try {
            // Verify Signature on Backend
            const verifyRes = await fetch(`${API_URL}/api/verify-payment`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature
              })
            });
            const verifyData = await verifyRes.json();
            
            if (verifyData.success) {
              handlePaymentSuccess(response.razorpay_payment_id, orderDraft);
            } else {
              alert("Payment Verification Failed. Do not panic, if money was deducted it will be refunded. Error: " + verifyData.error);
            }
          } catch (err) {
            alert("Network error during payment verification. Please contact support.");
          }
        },
        prefill: {
          name: orderDraft.customer.name,
          email: orderDraft.customer.email,
          contact: orderDraft.customer.phone
        },
        theme: {
          color: "#D4AF37"
        }
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.on('payment.failed', function (response) {
        alert(`Payment Failed: ${response.error.description}`);
      });
      paymentObject.open();

    } catch (err) {
      console.error(err);
      alert("Could not securely connect to payment gateway. Please try again later or select COD.");
    }
  };

  const handlePaymentSuccess = async (txId, draft = paymentDraft) => {
    const newOrder = {
      id: `ORD-${Math.floor(10000 + Math.random() * 90000)}`,
      date: new Date().toISOString(),
      customer: draft.customer,
      items: draft.items,
      subtotal: draft.subtotal,
      shipping: draft.shipping,
      total: draft.total,
      paymentMethod: draft.paymentMethod,
      transactionId: txId,
      status: 'Confirmed',
    };

    setOrders((prev) => [newOrder, ...prev]);
    setCart([]);
    setPaymentDraft(null);
    setConfirmedOrder(newOrder);
    navigate('/confirmation');

    // Save to Firestore
    await saveOrderToFirestore(newOrder);

    // Auto-dispatch confirmation email
    await sendOrderConfirmationEmail(newOrder);
  };



  return (
    <StoreProvider 
      products={products}
      orders={orders}
      categories={categories}
      brands={brands}
      cart={cart}
      updateCartQty={updateCartQty}
      removeCartItem={removeCartItem}
      user={user}
      openLogin={() => setIsUserLoginOpen(true)}
      query={query}
      setQuery={setQuery}
      activeCategory={activeCategory}
      setActiveCategory={setActiveCategory}
      wishlist={wishlist}
      toggleWishlist={toggleWishlist}
      setIsCartOpen={setIsCartOpen}
    >
      <div className="yd-root min-h-screen flex flex-col w-full overflow-x-hidden">

      <CurtainIntro />

      {/* Header */}
      <Header
        query={query}
        setQuery={setQuery}
        isAdminMode={location.pathname === '/admin' && isAdminUnlocked}
        setIsAdminMode={(val) => {
          if (val) {
            if (isAdminUnlocked) {
              navigate('/admin');
            } else {
              setIsMerchantLockOpen(true);
            }
          } else {
            import('./utils/firebase').then(({ adminSignOut }) => adminSignOut());
            navigate('/');
          }
        }}
        onInquiryClick={() => {
          setInquiryProduct(null);
          setIsInquiryOpen(true);
        }}
      />

      {/* Main Content Router */}
      <main className="flex-1 w-full overflow-x-hidden min-w-0">
        <Routes>
          <Route path="/" element={
            <>
              <Hero
                setActiveCategory={(cat) => {
                  setActiveCategory(cat);
                  navigate('/shop');
                }}
                products={products}
              />
              <FestiveBanner
                setActiveCategory={(cat) => {
                  setActiveCategory(cat);
                  navigate('/shop');
                }}
              />
              <CategoryRail
                categories={categories}
                activeCategory={activeCategory}
                setActiveCategory={(cat) => {
                  setActiveCategory(cat);
                  navigate('/shop');
                }}
              />

              <section className="w-full max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-8 sm:py-12 overflow-x-hidden min-w-0">
                <div className="flex justify-between items-end mb-6 sm:mb-8">
                  <div>
                    <span className="font-mono text-xs text-[var(--mustard-deep)] uppercase tracking-widest block mb-1">
                      ATELIER SPOTLIGHT
                    </span>
                    <h2 className="font-display text-xl sm:text-2xl md:text-3xl font-semibold">
                      Signature Ready-to-Wear
                    </h2>
                  </div>
                  <button
                    onClick={() => navigate('/shop')}
                    className="font-mono text-xs text-[var(--ink)] hover:text-[var(--mustard-deep)] font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    Explore All Designs →
                  </button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 min-w-0 w-full">
                  {(products || []).slice(0, 8).map((p, idx) => (
                    <ProductCard
                      key={p.id}
                      p={p}
                      index={idx}
                      brands={brandMap}
                      wishlist={wishlist}
                      toggleWish={toggleWishlist}
                      onOpen={(prod) => navigate(`/product/${prod.id}`)}
                    />
                  ))}
                </div>
              </section>

              <Lookbook
                products={products}
                onOpen={(prod) => navigate(`/product/${prod.id}`)}
              />
            </>
          } />

          <Route path="/shop" element={
            <ShopPage
              onOpen={(prod) => navigate(`/product/${prod.id}`)}
            />
          } />

          <Route path="/product/:id" element={
            <ProductPageWrapper 
              products={products}
              brands={brandMap}
              addToCart={addToCart}
              wishlist={wishlist}
              toggleWish={toggleWishlist}
              onOpenInquiry={(prod) => {
                setInquiryProduct(prod);
                setIsInquiryOpen(true);
              }}
            />
          } />

          <Route path="/checkout" element={
            <CheckoutPage
              cart={cart}
              products={products}
              onProceedToPayment={handleProceedToPayment}
              user={user}
            />
          } />

          <Route path="/confirmation" element={
            confirmedOrder ? (
              <ConfirmationPage
                order={confirmedOrder}
                onSendEmailConfirmation={sendOrderConfirmationEmail}
              />
            ) : null
          } />

          <Route path="/orders" element={
            <OrdersPage
              orders={orders}
              products={products}
            />
          } />

          <Route path="/admin" element={
            isAdminUnlocked ? (
              <AdminDashboard
                products={products}
                setProducts={setProducts}
                categories={categories}
                setCategories={setCategories}
                onSaveCategory={handleSaveCategory}
                onDeleteCategory={handleDeleteCategory}
                brands={brands}
                setBrands={setBrands}
                onSaveBrand={handleSaveBrand}
                onDeleteBrand={handleDeleteBrand}
                orders={orders}
                onLogout={() => {
                  import('./utils/firebase').then(({ adminSignOut }) => adminSignOut());
                  navigate('/');
                }}
                onOpenAddProductModal={() => {
                  setEditingProduct(null);
                  setIsProductModalOpen(true);
                }}
                onSeedFirebase={handleSeedFirebase}
                firebaseStatus={isFirebaseLive}
                editingProduct={editingProduct}
                setEditingProduct={setEditingProduct}
                isProductModalOpen={isProductModalOpen}
                setIsProductModalOpen={setIsProductModalOpen}
                onSaveProduct={handleSaveProduct}
                onDeleteProduct={handleDeleteProduct}
                onQuickToggleStock={handleQuickToggleStock}
              />
            ) : (
              <div className="max-w-md mx-auto my-20 p-8 text-center bg-[var(--ivory)] rounded-xl shadow-2xl border-2 border-[var(--mustard)]">
                <p className="font-mono text-xs text-[var(--mustard-deep)] uppercase tracking-widest font-bold mb-2">RESTRICTED WORKROOM</p>
                <h2 className="font-display text-2xl font-semibold mb-3">Merchant Authentication Required</h2>
                <p className="text-sm text-gray-700 mb-6">Login with an authorized atelier account to manage live inventory and orders.</p>
                <button
                  onClick={() => setIsMerchantLockOpen(true)}
                  className="yd-btn yd-btn-primary px-6 py-3 w-full font-bold shadow cursor-pointer"
                  style={{ background: 'var(--ink)', color: 'var(--ivory)' }}
                >
                  Admin Login
                </button>
              </div>
            )
          } />
        </Routes>
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
        updateQty={(id, delta, size, color) => updateCartQty(id, size, delta, color)}
        removeItem={(id, size, color) => removeCartItem(id, size, color)}
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
          setIsMerchantLockOpen(false);
          navigate('/admin');
        }}
      />



      {/* Footer */}
      <Footer
        setActiveCategory={(cat) => {
          setActiveCategory(cat);
          navigate('/shop');
        }}
        onOpenInquiry={() => {
          setInquiryProduct(null);
          setIsInquiryOpen(true);
        }}
      />
    </div>
    </StoreProvider>
  );
}

function ProductPageWrapper({ products, brands, addToCart, wishlist, toggleWish, onOpenInquiry }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const product = products.find(p => p.id === id);

  if (!product) {
    return (
      <div className="max-w-md mx-auto my-20 p-8 text-center bg-white rounded-xl shadow-lg border border-[var(--line)]">
        <h2 className="font-display text-2xl font-semibold mb-3">Garment Not Found</h2>
        <p className="text-sm text-gray-600 mb-6">The selected piece is no longer on the rack or could not be loaded.</p>
        <button
          onClick={() => navigate('/shop')}
          className="yd-btn yd-btn-primary px-6 py-3 w-full font-bold cursor-pointer"
          style={{ background: 'var(--ink)', color: 'var(--ivory)' }}
        >
          Browse All Garments
        </button>
      </div>
    );
  }

  return (
    <ProductPage
      product={product}
      products={products}
      brands={brands}
      goBack={() => navigate(-1)}
      addToCart={addToCart}
      wishlist={wishlist}
      toggleWish={toggleWish}
      onOpen={(prod) => navigate(`/product/${prod.id}`)}
      onOpenInquiry={onOpenInquiry}
    />
  );
}