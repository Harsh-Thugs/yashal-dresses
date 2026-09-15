import React, { useState } from "react";
import { Star, Heart, ArrowLeft, Minus, Plus, Truck, RotateCcw, ShieldCheck, AlertCircle, Check } from "lucide-react";
import { Swatch } from "./BrandDecorations";
import ProductCard from "./ProductCard";
import { sizesFor } from "../data/initialData";

const money = (n) => `₹${Number(n || 0).toLocaleString("en-IN")}`;

export default function ProductPage({
  product,
  setPage,
  goBack,
  addToCart,
  wishlist = [],
  toggleWish = () => {},
  onOpen = () => {},
  onOpenInquiry = null,
  products = [],
  brands = []
}) {
  const [size, setSize] = useState(null);
  const [sizeError, setSizeError] = useState("");
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [mainImgIdx, setMainImgIdx] = useState(0);

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h2 className="font-display text-2xl font-semibold mb-3">Garment Not Found</h2>
        <p className="text-sm opacity-70 mb-6">The garment you selected could not be loaded.</p>
        <button
          onClick={() => setPage ? setPage("shop") : (goBack ? goBack() : null)}
          className="yd-btn yd-btn-primary px-6 py-3"
        >
          Browse All Garments
        </button>
      </div>
    );
  }

  const categoryName = product.category || "Formal Shirts";
  const rawSizes = product.sizes;
  const sizesList = Array.isArray(rawSizes) && rawSizes.length > 0
    ? rawSizes
    : (typeof rawSizes === "string" ? rawSizes.split(",").map(s => s.trim()).filter(Boolean) : sizesFor(categoryName));

  const stockObj = (typeof product.stock === "object" && product.stock !== null) ? product.stock : {};
  const selectedSizeStock = size ? Number(stockObj[size] ?? 5) : 0;
  const isSizeOutOfStock = size ? selectedSizeStock === 0 : false;
  const isProductOutOfStock = product.inStock === false || (Object.keys(stockObj).length > 0 && Object.values(stockObj).every(v => Number(v) === 0));

  const priceVal = Number(product.price || 0);
  const mrpVal = Number(product.mrp || product.price || 0);
  const off = mrpVal > priceVal ? Math.round(((mrpVal - priceVal) / mrpVal) * 100) : 0;
  
  const related = (products || [])
    .filter((p) => p && p.id !== product.id && p.category === product.category)
    .concat((products || []).filter((p) => p && p.id !== product.id && p.category !== product.category))
    .slice(0, 4);

  const handleBack = () => {
    if (goBack) {
      goBack();
    } else if (typeof window !== "undefined" && window.history.length > 1) {
      window.history.back();
    } else {
      setPage("shop");
    }
  };

  const productImages = (Array.isArray(product.images) && product.images.length > 0)
    ? product.images
    : (product.image ? [product.image] : []);
  const activeImgSrc = productImages[mainImgIdx] || productImages[0];

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-8 w-full overflow-hidden">
      {/* Breadcrumb & Return to Rack */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
        <button
          onClick={handleBack}
          className="flex items-center gap-1.5 sm:gap-2 font-mono text-xs text-[var(--ink)] bg-white border border-[var(--line)] px-3 sm:px-4 py-1.5 sm:py-2 rounded-full hover:bg-[var(--mustard)] hover:text-black font-semibold transition-all shadow-sm group active:scale-95 cursor-pointer"
        >
          <span className="font-bold group-hover:-translate-x-0.5 transition-transform">←</span>
          <span>Back to {product.category ? `${product.category} Rack` : "Garments"}</span>
        </button>
        <span className="font-mono text-xs opacity-30">/</span>
        <span className="font-mono text-xs opacity-60 truncate max-w-[180px] sm:max-w-xs">{product.name}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 md:gap-10">
        {/* Left: Product Media / Multi-Photo Gallery */}
        <div className="space-y-3 w-full">
          <div className="tag-card relative overflow-hidden group">
            <div className="tag-hole" />
            {productImages.length > 0 ? (
              <div className="relative h-72 sm:h-80 md:h-[460px] w-full bg-white flex items-center justify-center overflow-hidden">
                <img
                  src={activeImgSrc}
                  alt={`${product.name} - Photo ${mainImgIdx + 1}`}
                  className="w-full h-full object-cover transition-all duration-300"
                />

                {/* Navigation Arrows for Multi-Photo */}
                {productImages.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setMainImgIdx((prev) => (prev > 0 ? prev - 1 : productImages.length - 1));
                      }}
                      className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black text-white w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center backdrop-blur-sm shadow-md transition-transform active:scale-90 font-bold z-10 text-base cursor-pointer"
                      title="Previous Photo"
                      aria-label="Previous image"
                    >
                      ‹
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setMainImgIdx((prev) => (prev < productImages.length - 1 ? prev + 1 : 0));
                      }}
                      className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black text-white w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center backdrop-blur-sm shadow-md transition-transform active:scale-90 font-bold z-10 text-base cursor-pointer"
                      title="Next Photo"
                      aria-label="Next image"
                    >
                      ›
                    </button>

                    <div className="absolute bottom-2.5 right-2.5 sm:bottom-3 sm:right-3 bg-black/75 backdrop-blur-sm text-white font-mono text-[10px] font-bold px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full shadow z-10 flex items-center gap-1">
                      <span>📷</span>
                      <span>{mainImgIdx + 1} / {productImages.length}</span>
                    </div>
                  </>
                )}

                {isProductOutOfStock && (
                  <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center z-20">
                    <span className="font-mono text-xs text-white bg-black/80 px-3 py-1 rounded border border-white/30 tracking-widest uppercase">
                      Out of stock
                    </span>
                  </div>
                )}
              </div>
            ) : (
              <Swatch p={{ ...product, inStock: !isProductOutOfStock }} className="h-72 sm:h-80 md:h-[460px] w-full" />
            )}
          </div>

          {/* Thumbnails Strip */}
          {productImages.length > 1 && (
            <div className="flex gap-2 sm:gap-2.5 overflow-x-auto pb-1 no-scrollbar">
              {productImages.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setMainImgIdx(idx)}
                  className={`relative w-14 h-14 sm:w-16 sm:h-16 shrink-0 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                    mainImgIdx === idx
                      ? 'border-[var(--mustard)] ring-2 ring-[var(--mustard)]/50 scale-105 shadow-md'
                      : 'border-gray-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`Thumb ${idx + 1}`} className="w-full h-full object-cover" />
                  {idx === 0 && (
                    <span className="absolute top-0 left-0 bg-[var(--mustard)] text-[var(--ink)] text-[7.5px] font-mono font-bold px-1 rounded-br">
                      COVER
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Garment Information & Purchasing */}
        <div className="w-full">
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-1">
            <span className="font-mono text-xs tracking-widest text-[var(--mustard-deep)] font-bold uppercase">
              🏷️ {product.brand || "Zodiac"}
            </span>
            <span className="text-gray-300">•</span>
            <span className="font-mono text-xs tracking-widest opacity-55 uppercase truncate">
              {product.category} {product.id ? `· ${product.id}` : ""}
            </span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-semibold leading-tight">{product.name}</h1>
          
          <div className="flex items-center gap-1.5 mt-2 text-sm">
            <Star size={14} fill="var(--mustard)" color="var(--mustard)" />
            <span className="font-medium">{product.rating || "4.5"}</span>
            <span className="opacity-50">({product.reviews || 24} reviews)</span>
          </div>

          <div className="flex items-baseline gap-3 mt-4 flex-wrap">
            <span className="text-2xl font-semibold">{money(priceVal)}</span>
            {off > 0 && <span className="line-through opacity-45 text-sm sm:text-base">{money(mrpVal)}</span>}
            {off > 0 && <span className="font-mono text-sm font-bold" style={{ color: "var(--oxblood)" }}>{off}% off</span>}
          </div>

          <p className="text-xs sm:text-sm opacity-75 mt-4 max-w-md leading-relaxed">{product.desc || "Exclusively finished in our Pune atelier using hand-selected long-staple fabrics for comfort and enduring shape."}</p>

          {/* Size Selector */}
          <div className="mt-5 sm:mt-6">
            <div className="flex flex-wrap items-center justify-between gap-1 mb-2.5">
              <p className="font-mono text-[11px] tracking-widest font-bold opacity-80 flex items-center gap-1.5">
                <span>SELECT SIZE</span>
                <span className="text-red-500 font-bold">*</span>
                <span className="text-[10px] font-normal opacity-60">(Compulsory)</span>
              </p>
              {size ? (
                <span className={`text-xs font-mono font-bold flex items-center gap-1 ${isSizeOutOfStock ? "text-red-700" : selectedSizeStock <= 5 ? "text-amber-700" : "text-emerald-700"}`}>
                  <span className="text-emerald-600">✓</span> Size {size} selected ({isSizeOutOfStock ? "Out of Stock" : `${selectedSizeStock} available`})
                </span>
              ) : (
                <span className="text-[11px] sm:text-xs font-mono text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded border border-amber-200 font-medium">
                  Please pick a size below
                </span>
              )}
            </div>
            
            <div className="flex flex-wrap gap-2 sm:gap-2.5">
              {sizesList.map((s) => {
                const sizeQty = Number(stockObj[s] ?? 5);
                const out = sizeQty === 0;
                const isSelected = size === s;
                return (
                  <button
                    key={s}
                    type="button"
                    disabled={out}
                    onClick={() => {
                      setSize(s);
                      setSizeError("");
                      setQty(1);
                    }}
                    className={`min-w-[60px] sm:min-w-[72px] px-2.5 sm:px-3.5 py-2 sm:py-2.5 rounded-lg border text-center transition-all relative cursor-pointer ${
                      isSelected
                        ? "bg-[var(--ink)] text-[var(--mustard)] border-[var(--mustard)] shadow-md ring-2 ring-[var(--mustard)]/40"
                        : out
                        ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed opacity-50"
                        : "bg-white text-[var(--ink)] border-[var(--line)] hover:border-[var(--mustard)] hover:shadow-sm"
                    }`}
                  >
                    <div className="flex items-center justify-center gap-1 font-bold text-sm">
                      <span>{s}</span>
                      {isSelected ? (
                        <span className="inline-flex items-center justify-center w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-[var(--mustard)] text-[var(--ink)] text-[9px] sm:text-[10px] font-extrabold ml-0.5">
                          ✓
                        </span>
                      ) : (
                        <span className="inline-block w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full border border-gray-300 ml-0.5 opacity-40"></span>
                      )}
                    </div>
                    <span
                      className={`text-[9px] sm:text-[9.5px] font-mono block mt-0.5 ${
                        isSelected
                          ? "text-[var(--mustard)] opacity-90 font-medium"
                          : out
                          ? "text-red-500 font-semibold line-through"
                          : sizeQty <= 5
                          ? "text-amber-700 font-medium"
                          : "text-gray-500"
                      }`}
                    >
                      {out ? "Sold Out" : `${sizeQty} in stock`}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Error message if user tries to add to bag without selecting a size */}
            {sizeError && (
              <div className="mt-3 p-2.5 sm:p-3 bg-red-50 border-2 border-red-400 rounded-lg flex items-center gap-2 text-red-800 text-xs font-bold shadow-sm animate-pulse">
                <AlertCircle size={16} className="text-red-600 shrink-0" />
                <span>{sizeError}</span>
              </div>
            )}
          </div>

          {/* Quantity Selector */}
          <div className="mt-5 sm:mt-6 flex items-center gap-4">
            <p className="font-mono text-[11px] tracking-widest opacity-60">QTY</p>
            <div className="flex items-center border border-[var(--line)] rounded bg-white">
              <button
                disabled={isSizeOutOfStock || qty <= 1 || !size}
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="p-2 disabled:opacity-30 cursor-pointer"
                aria-label="Decrease quantity"
              >
                <Minus size={14} />
              </button>
              <span className="px-3 text-sm font-semibold">{qty}</span>
              <button
                disabled={isSizeOutOfStock || !size || qty >= selectedSizeStock}
                onClick={() => setQty((q) => Math.min(selectedSizeStock, q + 1))}
                className="p-2 disabled:opacity-30 cursor-pointer"
                aria-label="Increase quantity"
              >
                <Plus size={14} />
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 sm:mt-7 flex flex-col sm:flex-row gap-2.5 sm:gap-3">
            <button
              disabled={isProductOutOfStock || (size && isSizeOutOfStock)}
              onClick={(e) => {
                if (!size) {
                  setSizeError("Please select a size!");
                  return;
                }
                if (isSizeOutOfStock || isProductOutOfStock) {
                  setSizeError("Selected size is out of stock. Please choose another size.");
                  return;
                }
                setSizeError("");
                if (addToCart) addToCart(product, size, qty);
                setAdded(true);
                setTimeout(() => setAdded(false), 1800);
              }}
              className={`yd-btn px-6 py-3.5 flex-1 font-semibold text-sm transition-all cursor-pointer ${
                isProductOutOfStock || (size && isSizeOutOfStock)
                  ? "bg-gray-400 text-white cursor-not-allowed opacity-60"
                  : !size
                  ? "yd-btn-primary opacity-95 hover:opacity-100 shadow-md"
                  : "yd-btn-primary shadow-lg"
              }`}
            >
              {isProductOutOfStock
                ? "Product Out of Stock"
                : size && isSizeOutOfStock
                ? "Size Out of Stock"
                : added
                ? "Added to Bag ✓"
                : "Add to Bag"}
            </button>

            <button
              onClick={() => toggleWish(product.id)}
              className="yd-btn yd-btn-outline px-5 py-3.5 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Heart size={15} fill={(wishlist || []).includes(product.id) ? "var(--oxblood)" : "none"} color="var(--oxblood)" />
              <span>{(wishlist || []).includes(product.id) ? "Saved" : "Save"}</span>
            </button>
          </div>

          {/* Direct Store Helpline / WhatsApp Inquiry */}
          <div className="mt-3">
            <button
              type="button"
              onClick={() => onOpenInquiry ? onOpenInquiry(product) : window.open(`https://wa.me/919673533839?text=${encodeURIComponent(`Hello Yashal Dresses, I want to inquire about: ${product.name} (${product.brand || 'Yashal'}, ₹${product.price}). Is it available in size ${size || 'any'}?`)}`, "_blank")}
              className="yd-btn border-2 border-emerald-600 text-emerald-800 bg-emerald-50 hover:bg-emerald-100 w-full py-3 text-xs font-bold flex items-center justify-center gap-2 rounded-lg shadow-sm transition-all cursor-pointer"
            >
              <span>💬</span>
              <span>Inquire on WhatsApp (9673533839)</span>
            </button>
          </div>

          {isSizeOutOfStock && (
            <p className="flex items-center gap-1 text-xs mt-2 text-red-700 font-medium" style={{ color: "var(--oxblood)" }}>
              <AlertCircle size={14} /> Selected size is currently out of stock. Try another size or contact seller.
            </p>
          )}

          {/* Guarantees */}
          <div className="divider mt-6 sm:mt-8 pt-4 sm:pt-5 grid grid-cols-3 gap-2 sm:gap-3 text-center">
            {[["Free shipping", Truck], ["7-day returns", RotateCcw], ["Secure pay", ShieldCheck]].map(([t, Icon]) => (
              <div key={t} className="flex flex-col items-center gap-1 sm:gap-1.5">
                <Icon size={16} className="opacity-70" />
                <p className="text-[10px] sm:text-[11px] opacity-70 font-medium">{t}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Related Products Rail */}
      {related.length > 0 && (
        <section className="mt-12 sm:mt-16 relative">
          <p className="font-mono text-[11px] tracking-widest yd-mustard mb-1">STITCHED TOGETHER</p>
          <h2 className="font-display text-xl sm:text-2xl mb-4 sm:mb-6 font-semibold">You might also like.</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
            {related.map((p, i) => (
              <ProductCard
                key={p.id}
                p={p}
                index={i}
                onOpen={onOpen}
                wishlist={wishlist}
                toggleWish={toggleWish}
                brands={brands}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

