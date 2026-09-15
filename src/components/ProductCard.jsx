import React from "react";
import { Star, Heart } from "lucide-react";
import { Swatch } from "./BrandDecorations";

const money = (n) => `₹${Number(n || 0).toLocaleString("en-IN")}`;

export default function ProductCard({
  p,
  onOpen = () => {},
  wishlist = [],
  toggleWish = () => {},
  index = 0,
  brands = []
}) {
  if (!p) return null;

  const priceVal = Number(p.price || 0);
  const mrpVal = Number(p.mrp || p.price || 0);
  const off = mrpVal > priceVal ? Math.round((1 - priceVal / mrpVal) * 100) : 0;
  const tilt = index % 2 === 0 ? "-1deg" : "1deg";

  // Calculate total remaining stock across sizes
  const totalStock = typeof p.stock === 'object' && p.stock !== null
    ? Object.values(p.stock).reduce((a, b) => a + Number(b || 0), 0)
    : Number(p.stock || 0);

  const isOutOfStock = p.inStock === false || totalStock === 0;
  const isLowStock = !isOutOfStock && totalStock <= 5;

  const brandInfo = (brands || []).find((b) => b.name === p.brand) || {
    name: p.brand || "Zodiac",
    badgeBg: "rgba(212, 175, 55, 0.15)",
    badgeText: "#8A6A12",
    color: "#D4AF37"
  };

  return (
    <div
      className={`tag-card flex flex-col w-full ${isOutOfStock ? "opacity-85" : ""}`}
      style={{ "--tilt": tilt }}
    >
      <div className="tag-hole" />

      {/* Product Image / Swatch Button */}
      <button
        type="button"
        className="text-left relative w-full overflow-hidden group cursor-pointer block"
        onClick={() => onOpen(p)}
        aria-label={`Open ${p.name}`}
      >
        <Swatch p={{ ...p, inStock: !isOutOfStock }} className="h-36 sm:h-44 md:h-48 w-full" />
        {Array.isArray(p.images) && p.images.length > 1 && (
          <span className="absolute bottom-1.5 right-1.5 sm:bottom-2 sm:right-2 bg-black/70 backdrop-blur-sm text-white text-[8px] sm:text-[9px] font-mono font-bold px-1.5 py-0.5 rounded shadow z-10 flex items-center gap-0.5">
            📷 {p.images.length}
          </span>
        )}
      </button>

      {/* Wishlist Button */}
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); toggleWish(p.id); }}
        className="absolute top-2 right-2 sm:top-2.5 sm:right-2.5 z-20 bg-white/90 rounded-full p-1 sm:p-1.5 shadow hover:scale-110 transition-transform cursor-pointer"
        aria-label="Wishlist"
      >
        <Heart size={13} fill={(wishlist || []).includes(p.id) ? "var(--oxblood)" : "none"} color="var(--oxblood)" />
      </button>

      {/* Tag Badge: Bestseller / New / Sale / Out of Stock */}
      {isOutOfStock ? (
        <span className="absolute top-2 left-6 sm:top-2.5 sm:left-7 font-mono text-[8px] sm:text-[9px] px-1.5 sm:px-2 py-0.5 rounded-full tracking-wider badge-outofstock z-10 font-bold">
          OUT OF STOCK
        </span>
      ) : p.tag ? (
        <span className={`absolute top-2 left-6 sm:top-2.5 sm:left-7 font-mono text-[8px] sm:text-[9px] px-1.5 sm:px-2 py-0.5 rounded-full tracking-wider z-10 font-bold ${
          p.tag === "Sale" ? "badge-sale" : p.tag === "New" ? "badge-new" : "badge-best"
        }`}>
          {p.tag.toUpperCase()}
        </span>
      ) : null}

      {/* Product Info */}
      <div className="tag-stitch p-2 sm:px-3 sm:pt-2.5 sm:pb-3 flex-1 flex flex-col justify-between">
        <div>
          {/* Brand Label Badge & Category */}
          <div className="flex items-center justify-between gap-1 mb-1">
            <span
              className="inline-flex items-center gap-0.5 font-mono text-[8px] sm:text-[9px] font-bold px-1 sm:px-1.5 py-0.2 sm:py-0.5 rounded border truncate max-w-[75px] sm:max-w-[125px]"
              style={{
                backgroundColor: brandInfo.badgeBg || "rgba(212, 175, 55, 0.15)",
                color: brandInfo.badgeText || "#8A6A12",
                borderColor: brandInfo.color ? `${brandInfo.color}44` : "rgba(212, 175, 55, 0.3)"
              }}
              title={p.brand || "Zodiac"}
            >
              🏷️ {p.brand || "Zodiac"}
            </span>

            {isLowStock ? (
              <span className="font-mono text-[7.5px] sm:text-[8.5px] text-amber-700 bg-amber-100 px-1 py-0.2 rounded font-bold shrink-0">
                Only {totalStock} left
              </span>
            ) : (
              <span className="font-mono text-[8px] sm:text-[9.5px] tracking-widest opacity-45 uppercase truncate">
                {p.category}
              </span>
            )}
          </div>

          <button type="button" onClick={() => onOpen(p)} className="text-left mt-0.5 block w-full cursor-pointer">
            <h3 className="font-display text-xs sm:text-[15px] leading-snug font-medium line-clamp-1 hover:underline">
              {p.name}
            </h3>
          </button>

          <div className="flex items-center gap-1 mt-0.5 sm:mt-1 text-[10px] sm:text-[11px] opacity-70">
            <Star size={10} fill="var(--mustard)" color="var(--mustard)" />
            <span>{p.rating || "4.5"}</span>
            <span className="opacity-50">({p.reviews || 24})</span>
          </div>
        </div>

        <div className="mt-2 pt-1.5 flex items-baseline gap-1.5 sm:gap-2 flex-wrap">
          <span className="font-semibold text-xs sm:text-sm">{money(priceVal)}</span>
          {off > 0 && <span className="text-[10px] sm:text-xs line-through opacity-45">{money(mrpVal)}</span>}
          {off > 0 && <span className="text-[9.5px] sm:text-[11px] font-mono font-bold" style={{ color: "var(--oxblood)" }}>{off}% off</span>}
        </div>
      </div>
    </div>
  );
}

