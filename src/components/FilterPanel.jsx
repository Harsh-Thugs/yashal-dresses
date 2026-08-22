import React from "react";
import { ChevronDown, X } from "lucide-react";

const money = (n) => `₹${n.toLocaleString("en-IN")}`;

export default function FilterPanel({
  categories, selected, toggleCat, sizeSel, setSizeSel,
  maxPrice, setMaxPrice, sort, setSort, inStockOnly, setInStockOnly, close
}) {
  const allCategoryNames = categories.flatMap((c) => (c.sub ? c.sub : [c.name]));

  return (
    <div className={`space-y-6 ${close ? "" : "filter-panel"}`}>
      {close && (
        <div className="flex items-center justify-between pb-2 border-b border-[var(--line)]">
          <p className="font-display text-lg font-semibold">Filters</p>
          <button onClick={close} className="p-1"><X size={20} /></button>
        </div>
      )}

      {/* Stock Filter Toggle */}
      <div>
        <label className="yd-check-row bg-amber-500/10 border border-amber-500/20 rounded p-2.5">
          <input
            type="checkbox"
            className="yd-checkbox"
            checked={inStockOnly}
            onChange={(e) => setInStockOnly(e.target.checked)}
          />
          <span className="font-medium text-xs">Show In-Stock Only</span>
        </label>
      </div>

      {/* Sort By */}
      <div>
        <p className="font-mono text-[11px] tracking-widest opacity-60 mb-2">SORT BY</p>
        <div className="relative">
          <select value={sort} onChange={(e) => setSort(e.target.value)} className="yd-select">
            <option value="popular">Popularity</option>
            <option value="low">Price: Low to High</option>
            <option value="high">Price: High to Low</option>
            <option value="new">Newest First</option>
          </select>
          <ChevronDown size={15} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none opacity-50" />
        </div>
      </div>

      {/* Categories / Segments */}
      <div>
        <p className="font-mono text-[11px] tracking-widest opacity-60 mb-2">SEGMENTS / CATEGORIES</p>
        <div className="space-y-0.5 max-h-52 overflow-y-auto pr-1 yd-scroll">
          {allCategoryNames.map((c) => (
            <label key={c} className="yd-check-row">
              <input
                type="checkbox"
                className="yd-checkbox"
                checked={selected.includes(c)}
                onChange={() => toggleCat(c)}
              />
              <span className="text-xs">{c}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Filter */}
      <div>
        <p className="font-mono text-[11px] tracking-widest opacity-60 mb-2">MAX PRICE — {money(maxPrice)}</p>
        <input
          type="range"
          min={300}
          max={5000}
          step={100}
          value={maxPrice}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
          className="w-full"
        />
        <div className="flex justify-between text-[10px] font-mono opacity-50 mt-1">
          <span>₹300</span>
          <span>₹5,000</span>
        </div>
      </div>

      {/* Size Filter */}
      <div>
        <p className="font-mono text-[11px] tracking-widest opacity-60 mb-2">SIZE / WAIST</p>
        <div className="flex flex-wrap gap-1.5">
          {["S", "M", "L", "XL", "XXL", "30", "32", "34", "36", "38", "40"].map((s) => (
            <button
              key={s}
              onClick={() => setSizeSel(sizeSel === s ? null : s)}
              className={`cat-chip px-2.5 py-1 text-xs ${sizeSel === s ? "active" : ""}`}
              style={{ color: sizeSel === s ? undefined : "var(--ink)" }}
            >
              {s}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
