import React, { useState, useEffect } from "react";
import { LogOut, Truck, RotateCcw, ShieldCheck } from "lucide-react";
import BrandStyles from "./components/BrandStyles";
import CurtainIntro from "./components/CurtainIntro";
import Header from "./components/Header";
import CategoryRail from "./components/CategoryRail";
import Hero from "./components/Hero";
import ProductCard from "./components/ProductCard";
import FestiveBanner from "./components/FestiveBanner";
import Lookbook from "./components/Lookbook";
import ShopPage from "./components/ShopPage";
import ProductPage from "./components/ProductPage";
import CartDrawer from "./components/CartDrawer";
import LoginModal from "./components/LoginModal";
import CheckoutPage, { ConfirmationPage } from "./components/CheckoutModal";
import OrdersPage from "./components/OrdersPage";
import AdminDashboard from "./components/AdminDashboard";
import Footer from "./components/Footer";
import MobileNav from "./components/MobileNav";
import InquiryModal from "./components/InquiryModal";
import FloatingInquiryButton from "./components/FloatingInquiryButton";

import {
  loadProducts, saveProducts as storageSaveProducts,
  loadCategories, saveCategories as storageSaveCategories,
  loadBrands, saveBrands as storageSaveBrands,
  loadOrders, saveOrders as storageSaveOrders,
  loadCart, saveCart as storageSaveCart,
  loadWishlist, saveWishlist as storageSaveWishlist,
  loadUser, saveUser as storageSaveUser,
  deductStockForOrder
} from "./utils/storage";
import { sendOrderConfirmationEmail } from "./utils/emailSync.js";

/* --------------------------------- HOME PAGE --------------------------------- */
function HomePage({ setPage, setActiveCategory, onOpen, wishlist, toggleWish, products, categories, brands }) {
  const bestsellers = products.filter((p) => p.tag === "Bestseller").slice(0, 4);
  const fresh = products.filter((p) => p.tag === "New").slice(0, 4);

  return (
    <div>
      <Hero setPage={setPage} setActiveCategory={setActiveCategory} products={products} />

      {/* Category / Segment Rail Section */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 py-14">
        <div className="flex items-end justify-between mb-6">
          <div>
            <p className="font-mono text-[11px] tracking-widest yd-mustard">01 · SHOP BY SEGMENT</p>
            <h2 className="font-display text-2xl md:text-3xl mt-1 font-semibold" style={{ color: "#8A5A3B" }}>
              Every rack, tagged.
            </h2>
          </div>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none snap-x snap-mandatory">
          {categories.map((c) => {
            const p = products.find((x) => x.category === c.name) || products[0];
            return (
              <button
                key={c.name}
                onClick={() => { setActiveCategory(c.name); setPage("shop"); }}
                className="tag-card text-left shrink-0 w-32 snap-start group"
              >
                <div className="tag-hole" />
                <div className="h-24 overflow-hidden relative">
                  {p?.image ? (
                    <img src={p.image} alt={c.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  ) : (
                    <div className="w-full h-full" style={{ background: `linear-gradient(155deg, ${p?.c1 || "#1B2A4A"}, ${p?.c2 || "#0D1830"})` }} />
                  )}
                </div>
                <div className="tag-stitch px-2.5 py-2">
                  <p className="text-[12.5px] leading-tight font-medium group-hover:text-[var(--mustard-deep)] transition-colors">{c.name}</p>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Bestsellers Section */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 pb-14">
        <div className="flex items-end justify-between mb-6">
          <div>
            <p className="font-mono text-[11px] tracking-widest yd-mustard">02 · MOST WORN</p>
            <h2 className="font-display text-2xl md:text-3xl mt-1 font-semibold">Bestsellers this month.</h2>
          </div>
          <button onClick={() => setPage("shop")} className="font-mono text-xs underline underline-offset-4 hidden sm:block">
            View all garments →
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
          {bestsellers.map((p, i) => (
            <ProductCard key={p.id} p={p} index={i} onOpen={onOpen} wishlist={wishlist} toggleWish={toggleWish} brands={brands} />
          ))}
        </div>
      </section>

      {/* Festive Banner */}
      <FestiveBanner setPage={setPage} setActiveCategory={setActiveCategory} />

      {/* Guarantees Bar */}
      <section className="yd-ink-bg py-14">
        <div className="max-w-7xl mx-auto px-4 md:px-6 grid md:grid-cols-3 gap-8 text-center">
          {[
            { icon: Truck, title: "Free shipping ₹999+", d: "Delivered in 3–5 working days, pan-India." },
            { icon: RotateCcw, title: "7-day easy returns", d: "Didn't fit right? Send it back, no questions." },
            { icon: ShieldCheck, title: "Razorpay secure checkout", d: "Cards, UPI QR & Netbanking protected." },
          ].map((f) => (
            <div key={f.title} className="flex flex-col items-center gap-2">
              <f.icon size={22} className="yd-mustard" />
              <p className="text-sm font-medium">{f.title}</p>
              <p className="text-xs text-white/60 max-w-[220px]">{f.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Fresh Arrivals Section */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 py-14">
        <div className="flex items-end justify-between mb-6">
          <div>
            <p className="font-mono text-[11px] tracking-widest yd-mustard">03 · JUST IN</p>
            <h2 className="font-display text-2xl md:text-3xl mt-1 font-semibold">Fresh off the rack.</h2>
          </div>
          <button onClick={() => setPage("shop")} className="font-mono text-xs underline underline-offset-4 hidden sm:block">
            View all garments →
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
          {fresh.map((p, i) => (
            <ProductCard key={p.id} p={p} index={i} onOpen={onOpen} wishlist={wishlist} toggleWish={toggleWish} brands={brands} />
          ))}
        </div>
      </section>

      {/* Lookbook Section */}
      <Lookbook products={products} onOpen={onOpen} />
    </div>
  );
}

/* ----------------------------------- MAIN APP ---------------------------------- */
export default function App() {
  const [page, setPage] = useState("home");
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Persistent States
  const [products, setProductsState] = useState(() => loadProducts());
  const [categories, setCategoriesState] = useState(() => loadCategories());
  const [brands, setBrandsState] = useState(() => loadBrands());
  const [orders, setOrdersState] = useState(() => loadOrders());
  const [cart, setCartState] = useState(() => loadCart());
  const [wishlist, setWishlistState] = useState(() => loadWishlist());
  const [user, setUserState] = useState(() => loadUser());

  // UI Modal States
  const [cartOpen, setCartOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [lastOrder, setLastOrder] = useState(null);
  const [flights, setFlights] = useState([]);
  const [showInquiryModal, setShowInquiryModal] = useState(false);
  const [inquiryProduct, setInquiryProduct] = useState(null);

  const handleOpenInquiry = (prod = null) => {
    setInquiryProduct(prod);
    setShowInquiryModal(true);
  };

  // Persistence Wrappers
  const updateProducts = (newProds) => {
    setProductsState(newProds);
    storageSaveProducts(newProds);
  };

  const updateCategories = (newCats) => {
    setCategoriesState(newCats);
    storageSaveCategories(newCats);
  };

  const updateBrands = (newBrands) => {
    setBrandsState(newBrands);
    storageSaveBrands(newBrands);
  };

  const updateOrders = (newOrders) => {
    setOrdersState(newOrders);
    storageSaveOrders(newOrders);
  };

  const updateCart = (newCart) => {
    setCartState(newCart);
    storageSaveCart(newCart);
  };

  const updateWishlist = (newWishlist) => {
    setWishlistState(newWishlist);
    storageSaveWishlist(newWishlist);
  };

  const updateUser = (newUser) => {
    setUserState(newUser);
    storageSaveUser(newUser);
  };

  // Add to Bag with flying tag animation
  const addToCart = (product, size, qty, origin) => {
    if (!product || !size) return;
    updateCart((c) => {
      const idx = c.findIndex((i) => i.id === product.id && i.size === size);
      if (idx > -1) {
        const next = [...c];
        next[idx] = { ...next[idx], qty: next[idx].qty + qty };
        return next;
      }
      return [...c, { id: product.id, size, qty }];
    });

    if (origin && typeof window !== "undefined") {
      const targetX = window.innerWidth - (window.innerWidth < 768 ? 56 : 90);
      const targetY = 28;
      const id = Date.now() + Math.random();
      setFlights((f) => [
        ...f,
        { id, x: origin.x, y: origin.y, dx: targetX - origin.x, dy: targetY - origin.y, c1: product.c1 || "#1B2A4A", c2: product.c2 || "#0D1830" }
      ]);
      setTimeout(() => setFlights((f) => f.filter((fl) => fl.id !== id)), 750);
      setTimeout(() => setCartOpen(true), 600);
    } else {
      setCartOpen(true);
    }
  };

  const updateQty = (id, size, delta) => {
    updateCart((c) =>
      c.map((i) => (i.id === id && i.size === size ? { ...i, qty: Math.max(1, i.qty + delta) } : i))
    );
  };

  const removeItem = (id, size) => {
    updateCart((c) => c.filter((i) => !(i.id === id && i.size === size)));
  };

  const toggleWish = (id) => {
    updateWishlist((w) => (w.includes(id) ? w.filter((x) => x !== id) : [...w, id]));
  };

  // Place order & deduct stock
  const placeOrder = (items, total, address, paymentMethod, transactionId) => {
    const order = {
      id: `YD-ORD-${Math.floor(2200 + Math.random() * 7000)}`,
      date: new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }),
      total,
      status: "Placed",
      paymentMethod,
      transactionId,
      items: items.map((i) => ({ id: i.id, name: i.product.name, size: i.size, qty: i.qty, price: i.product.price })),
      address,
    };

    // 1. Deduct stock in real time
    const updatedProds = deductStockForOrder(items, products);
    setProductsState(updatedProds);

    // 2. Save order
    const newOrders = [order, ...orders];
    updateOrders(newOrders);
    setLastOrder(order);

    // 3. Clear cart
    updateCart([]);
    navigateTo("confirmation");

    // 4. Automatically dispatch order confirmation email from dressesyashal@gmail.com to yashaldressespune@gmail.com
    sendOrderConfirmationEmail(order);
  };

  const navigateTo = (newPage, newCat = undefined, newProd = null, push = true) => {
    setPage(newPage);
    if (newCat !== undefined) setActiveCategory(newCat);
    setSelectedProduct(newProd);

    if (push && typeof window !== "undefined" && window.history) {
      const stateObj = {
        page: newPage,
        category: newCat !== undefined ? newCat : activeCategory,
        prodId: newProd ? newProd.id : null,
      };
      window.history.pushState(stateObj, "");
    }
  };

  const openProduct = (p) => {
    navigateTo("product", p.category || activeCategory, p);
  };

  const goBack = () => {
    if (typeof window !== "undefined" && window.history.state) {
      window.history.back();
    } else if (page === "product") {
      navigateTo("shop", activeCategory, null, false);
    } else if (page === "shop" || page === "checkout" || page === "orders") {
      navigateTo("home", null, null, false);
    } else {
      navigateTo("home", null, null, false);
    }
  };

  useEffect(() => {
    const handlePopState = (e) => {
      if (e.state) {
        setPage(e.state.page || "home");
        setActiveCategory(e.state.category || null);
        if (e.state.prodId) {
          const found = products.find(p => p.id === e.state.prodId);
          setSelectedProduct(found || null);
        } else {
          setSelectedProduct(null);
        }
      } else {
        setPage("home");
        setActiveCategory(null);
        setSelectedProduct(null);
      }
    };

    if (typeof window !== "undefined" && window.history) {
      window.history.replaceState({ page: "home", category: null, prodId: null }, "");
      window.addEventListener("popstate", handlePopState);
      return () => window.removeEventListener("popstate", handlePopState);
    }
  }, [products]);

  const cartCount = cart.reduce((s, i) => s + i.qty, 0);

  return (
    <div className="yd-root min-h-screen flex flex-col">
      <BrandStyles />
      <CurtainIntro />

      <Header
        page={page}
        setPage={(pg) => navigateTo(pg, pg === "home" ? null : activeCategory, null)}
        query={query}
        setQuery={setQuery}
        cartCount={cartCount}
        onCartClick={() => setCartOpen(true)}
        user={user}
        onLoginClick={() => (user ? navigateTo("orders") : setLoginOpen(true))}
        onMenuClick={() => setMobileNavOpen(true)}
        isAdminMode={isAdminMode}
        setIsAdminMode={setIsAdminMode}
        onInquiryClick={() => handleOpenInquiry(null)}
      />

      {!isAdminMode && (
        <CategoryRail
          categories={categories}
          active={activeCategory}
          onSelect={(c) => navigateTo("shop", c, null)}
        />
      )}

      <main className="flex-1">
        {isAdminMode ? (
          <AdminDashboard
            products={products}
            saveProducts={updateProducts}
            categories={categories}
            saveCategories={updateCategories}
            brands={brands}
            saveBrands={updateBrands}
            orders={orders}
          />
        ) : (
          <>
            {page === "home" && (
              <HomePage
                setPage={setPage}
                setActiveCategory={setActiveCategory}
                onOpen={openProduct}
                wishlist={wishlist}
                toggleWish={toggleWish}
                products={products}
                categories={categories}
                brands={brands}
              />
            )}
            {page === "shop" && (
              <ShopPage
                query={query}
                setQuery={setQuery}
                activeCategory={activeCategory}
                setActiveCategory={(c) => navigateTo("shop", c, null)}
                categories={categories}
                products={products}
                brands={brands}
                onOpen={openProduct}
                wishlist={wishlist}
                toggleWish={toggleWish}
              />
            )}
            {page === "product" && (
              <ProductPage
                product={selectedProduct}
                setPage={(pg) => navigateTo(pg)}
                goBack={goBack}
                addToCart={addToCart}
                wishlist={wishlist}
                toggleWish={toggleWish}
                onOpen={openProduct}
                products={products}
                brands={brands}
                onOpenInquiry={(prod) => handleOpenInquiry(prod)}
              />
            )}
            {page === "checkout" && (
              <CheckoutPage
                cart={cart}
                products={products}
                setPage={(pg) => navigateTo(pg)}
                placeOrder={placeOrder}
                user={user}
              />
            )}
            {page === "confirmation" && <ConfirmationPage order={lastOrder} setPage={(pg) => navigateTo(pg)} />}
            {page === "orders" && <OrdersPage orders={orders} products={products} setPage={(pg) => navigateTo(pg)} />}
          </>
        )}
      </main>

      {!isAdminMode && (
        <Footer
          setPage={setPage}
          setActiveCategory={setActiveCategory}
          onOpenInquiry={() => handleOpenInquiry(null)}
        />
      )}

      {/* Floating Inquiry Button */}
      {!isAdminMode && (
        <FloatingInquiryButton onClick={() => handleOpenInquiry(null)} />
      )}

      {/* Store Inquiry Modal */}
      <InquiryModal
        open={showInquiryModal}
        close={() => { setShowInquiryModal(false); setInquiryProduct(null); }}
        initialProduct={inquiryProduct}
      />

      <CartDrawer
        open={cartOpen}
        close={() => setCartOpen(false)}
        cart={cart}
        products={products}
        updateQty={updateQty}
        removeItem={removeItem}
        setPage={setPage}
        user={user}
        openLogin={() => setLoginOpen(true)}
      />

      <LoginModal
        open={loginOpen}
        close={() => setLoginOpen(false)}
        onLogin={(u) => {
          updateUser(u);
          setLoginOpen(false);
          if (cart.length) setPage("checkout");
        }}
      />

      <MobileNav
        open={mobileNavOpen}
        close={() => setMobileNavOpen(false)}
        categories={categories}
        setPage={setPage}
        setActiveCategory={setActiveCategory}
      />

      {/* Flying Tag Animation Nodes */}
      {flights.map((f) => (
        <div key={f.id} className="fly-tag" style={{ left: f.x, top: f.y, "--dx": `${f.dx}px`, "--dy": `${f.dy}px` }}>
          <svg width="26" height="26" viewBox="0 0 26 26">
            <path
              d="M13 2 L23 11 L23 21 A3 3 0 0 1 20 24 L6 24 A3 3 0 0 1 3 21 L3 11 Z"
              fill={`url(#fg-${f.id})`}
              stroke="var(--ink)"
              strokeWidth="1.2"
            />
            <circle cx="13" cy="9" r="1.6" fill="var(--ivory)" stroke="var(--ink)" strokeWidth="1" />
            <defs>
              <linearGradient id={`fg-${f.id}`} x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor={f.c1} />
                <stop offset="1" stopColor={f.c2} />
              </linearGradient>
            </defs>
          </svg>
        </div>
      ))}

      {/* Logged in indicator */}
      {user && (
        <button
          onClick={() => updateUser(null)}
          className="fixed bottom-4 left-4 z-30 flex items-center gap-1.5 bg-white shadow-lg rounded-full px-3.5 py-2 text-xs font-mono border border-[var(--line)] hover:bg-gray-50"
        >
          <LogOut size={13} /> Log out {user.name.split(" ")[0]}
        </button>
      )}
    </div>
  );
}

