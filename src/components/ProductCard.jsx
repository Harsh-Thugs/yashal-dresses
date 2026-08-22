import React from "react";
import { Star, Heart } from "lucide-react";
import { Swatch } from "./BrandDecorations";

const money = (n) => `₹${n.toLocaleString("en-IN")}`;

export default function ProductCard({ p, onOpen, wishlist, toggleWish, index = 0, brands = [] }) {
  const off = p.mrp > p.price ? Math.round((1 - p.price / p.mrp) * 100) : 0;
  const tilt = index % 2 === 0 ? "-1.5deg" : "1.5deg";

  // Calculate total remaining stock across sizes
  const totalStock = typeof p.stock === 'object'
    ? Object.values(p.stock).reduce((a, b) => a + Number(b), 0)
    : Number(p.stock || 0);

  const isOutOfStock = !p.inStock || totalStock === 0;
  const isLowStock = !isOutOfStock && totalStock <= 5;

  const brandInfo = brands.find((b) => b.name === p.brand) || {
    name: p.brand || "Zodiac",
    badgeBg: "rgba(212, 175, 55, 0.15)",
    badgeText: "#8A6A12",
    color: "#D4AF37"
  };

  return (
    <div
      className={`tag-card flex flex-col ${isOutOfStock ? "opacity-85" : ""}`}
      style={{ "--tilt": tilt }}
    >
      <div className="tag-hole" />

      {/* Product Image / Swatch */}
      <button className="text-left relative w-full overflow-hidden" onClick={() => onOpen(p)}>
        <Swatch p={{ ...p, inStock: !isOutOfStock }} className="h-44 sm:h-48 w-full" />
      </button>

      {/* Wishlist Button */}
      <button
        onClick={(e) => { e.stopPropagation(); toggleWish(p.id); }}
        className="absolute top-2.5 right-2.5 z-20 bg-white/85 rounded-full p-1.5 shadow hover:scale-110 transition-transform"
        aria-label="Wishlist"
      >
        <Heart size={14} fill={wishlist.includes(p.id) ? "var(--oxblood)" : "none"} color="var(--oxblood)" />
      </button>

      {/* Tag Badge: Bestseller / New / Sale / Out of Stock */}
      {isOutOfStock ? (
        <span className="absolute top-2.5 left-7 font-mono text-[9px] px-2 py-0.5 rounded-full tracking-wider badge-outofstock z-10 font-bold">
          OUT OF STOCK
        </span>
      ) : p.tag ? (
        <span className={`absolute top-2.5 left-7 font-mono text-[9px] px-2 py-0.5 rounded-full tracking-wider z-10 ${p.tag === "Sale" ? "badge-sale" : p.tag === "New" ? "badge-new" : "badge-best"
          }`}>
          {p.tag.toUpperCase()}
        </span>
      ) : null}

      {/* Product Info */}
      <div className="tag-stitch px-3 pt-2.5 pb-3 flex-1 flex flex-col">
        {/* Brand Label Badge & Category Rail */}
        <div className="flex items-center justify-between gap-1 mb-1">
          <span
            className="inline-flex items-center gap-1 font-mono text-[9px] font-bold px-1.5 py-0.5 rounded border truncate max-w-[125px]"
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
            <span className="font-mono text-[8.5px] text-amber-700 bg-amber-100 px-1 py-0.2 rounded font-bold shrink-0">
              Only {totalStock} left
            </span>
          ) : (
            <span className="font-mono text-[9.5px] tracking-widest opacity-45 uppercase truncate">
              {p.category}
            </span>
          )}
        </div>

        <button onClick={() => onOpen(p)} className="text-left mt-0.5">
          <h3 className="font-display text-[15px] leading-snug font-medium line-clamp-1 hover:underline">
            {p.name}
          </h3>
        </button>

        <div className="flex items-center gap-1 mt-1 text-[11px] opacity-70">
          <Star size={11} fill="var(--mustard)" color="var(--mustard)" />
          <span>{p.rating}</span>
          <span className="opacity-50">({p.reviews})</span>
        </div>

        <div className="mt-auto pt-2 flex items-baseline gap-2">
          <span className="font-semibold text-sm">{money(p.price)}</span>
          {off > 0 && <span className="text-xs line-through opacity-45">{money(p.mrp)}</span>}
          {off > 0 && <span className="text-[11px] font-mono" style={{ color: "var(--oxblood)" }}>{off}% off</span>}
        </div>
      </div>
    </div>
  );
}

