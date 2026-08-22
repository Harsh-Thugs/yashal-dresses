import React, { useState, useMemo, useEffect } from "react";
import { SlidersHorizontal } from "lucide-react";
import ProductCard from "./ProductCard";
import FilterPanel from "./FilterPanel";

export default function ShopPage({
  query, setQuery, activeCategory, setActiveCategory, categories, products, onOpen, wishlist, toggleWish, brands = []
}) {
  const [selected, setSelected] = useState(activeCategory ? [activeCategory] : []);
  const [activeBrand, setActiveBrand] = useState("all");
  const [sizeSel, setSizeSel] = useState(null);
  const [maxPrice, setMaxPrice] = useState(5000);
  const [sort, setSort] = useState("popular");
  const [inStockOnly, setInStockOnly] = useState(false);
  const [mobileFilters, setMobileFilters] = useState(false);

  useEffect(() => {
    setSelected(activeCategory ? [activeCategory] : []);
    setActiveBrand("all");
  }, [activeCategory]);

  const toggleCat = (c) => {
    setSelected((s) => (s.includes(c) ? s.filter((x) => x !== c) : [...s, c]));
    setActiveCategory(null);
    setActiveBrand("all");
  };

  // Compute available brands and product counts within currently selected segment(s)
  const segmentProducts = useMemo(() => {
    if (selected.length) {
      return products.filter((p) => selected.includes(p.category));
    }
    return products;
  }, [selected, products]);

  const availableBrands = useMemo(() => {
    const brandMap = {};
    segmentProducts.forEach((p) => {
      const b = p.brand || "Zodiac";
      brandMap[b] = (brandMap[b] || 0) + 1;
    });

    return Object.entries(brandMap).map(([name, count]) => ({
      name,
      count
    }));
  }, [segmentProducts]);

  const results = useMemo(() => {
    let r = products.filter((p) => p.price <= maxPrice);

    if (inStockOnly) {
      r = r.filter((p) => {
        const totalStock = typeof p.stock === 'object'
          ? Object.values(p.stock).reduce((a, b) => a + Number(b), 0)
          : Number(p.stock || 0);
        return p.inStock && totalStock > 0;
      });
    }

    if (selected.length) {
      r = r.filter((p) => selected.includes(p.category));
    }

    if (activeBrand !== "all") {
      r = r.filter((p) => (p.brand || "Zodiac") === activeBrand);
    }

    if (sizeSel) {
      r = r.filter((p) => p.sizes && p.sizes.includes(sizeSel));
    }

    if (query.trim()) {
      const q = query.toLowerCase();
      r = r.filter((p) => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q) || (p.brand && p.brand.toLowerCase().includes(q)));
    }

    if (sort === "low") r = [...r].sort((a, b) => a.price - b.price);
    if (sort === "high") r = [...r].sort((a, b) => b.price - a.price);
    if (sort === "new") r = [...r].filter((p) => p.tag === "New").concat(r.filter((p) => p.tag !== "New"));
    
    return r;
  }, [selected, activeBrand, sizeSel, maxPrice, sort, query, inStockOnly, products]);

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-1">
        <h1 className="font-display text-2xl md:text-3xl font-semibold">
          {selected.length === 1 ? selected[0] : "All Garments & Accessories"}
        </h1>
        <div className="flex items-center gap-2">
          {selected.length === 1 && (
            <button
              onClick={() => { setSelected([]); if (setActiveCategory) setActiveCategory(null); }}
              className="font-mono text-xs text-[var(--ink)] bg-white border border-[var(--line)] px-3.5 py-1.5 rounded-full hover:bg-[var(--mustard)] hover:text-black font-semibold transition-all shadow-sm flex items-center gap-1"
            >
              <span>←</span>
              <span>View All Segments</span>
            </button>
          )}
          <button
            onClick={() => setMobileFilters(true)}
            className="md:hidden flex items-center gap-1.5 font-mono text-xs border border-[var(--line)] rounded px-3 py-1.5 bg-white"
          >
            <SlidersHorizontal size={14} /> Filters
          </button>
        </div>
      </div>

      <p className="font-mono text-xs opacity-60 mb-6">
        {results.length} garment{results.length !== 1 ? "s" : ""}{query ? ` matching "${query}"` : ""}
      </p>

      <div className="grid md:grid-cols-[230px_1fr] gap-8">
        <div className="hidden md:block">
          <FilterPanel
            categories={categories}
            selected={selected}
            toggleCat={toggleCat}
            sizeSel={sizeSel}
            setSizeSel={setSizeSel}
            maxPrice={maxPrice}
            setMaxPrice={setMaxPrice}
            sort={sort}
            setSort={setSort}
            inStockOnly={inStockOnly}
            setInStockOnly={setInStockOnly}
          />
        </div>

        {mobileFilters && (
          <div className="fixed inset-0 z-50 md:hidden">
            <div className="absolute inset-0 bg-black/40" onClick={() => setMobileFilters(false)} />
            <div className="absolute right-0 top-0 bottom-0 w-[85%] max-w-sm bg-[var(--ivory)] p-5 overflow-y-auto shadow-2xl">
              <FilterPanel
                categories={categories}
                selected={selected}
                toggleCat={toggleCat}
                sizeSel={sizeSel}
                setSizeSel={setSizeSel}
                maxPrice={maxPrice}
                setMaxPrice={setMaxPrice}
                sort={sort}
                setSort={setSort}
                inStockOnly={inStockOnly}
                setInStockOnly={setInStockOnly}
                close={() => setMobileFilters(false)}
              />
            </div>
          </div>
        )}

        <div>
          {/* Horizontal Brand Click Buttons Bar */}
          <div className="mb-5 bg-white/80 border border-[var(--line)] rounded-lg p-2.5 shadow-sm backdrop-blur-sm">
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth">
              <div className="flex items-center gap-1.5 font-mono text-[11px] font-bold text-gray-500 uppercase tracking-wider shrink-0 px-2 border-r border-gray-200">
                <span>🏷️ Brands</span>
              </div>
              
              {/* All Brands Button (Default Selected) */}
              <button
                onClick={() => setActiveBrand("all")}
                className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold font-mono transition-all flex items-center gap-1.5 ${
                  activeBrand === "all"
                    ? "bg-[var(--ink)] text-[var(--mustard)] shadow font-bold border border-[var(--mustard)]/40"
                    : "bg-white text-gray-700 hover:bg-amber-50 hover:text-black border border-gray-200"
                }`}
              >
                <span>All {selected.length === 1 ? selected[0] : ""} Brands</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  activeBrand === "all" ? "bg-[var(--mustard)] text-[var(--ink)]" : "bg-gray-100 text-gray-600"
                }`}>
                  {segmentProducts.length}
                </span>
              </button>

              {/* Individual Brand Buttons */}
              {availableBrands.map((b) => (
                <button
                  key={b.name}
                  onClick={() => setActiveBrand(activeBrand === b.name ? "all" : b.name)}
                  className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 ${
                    activeBrand === b.name
                      ? "bg-[var(--ink)] text-[var(--mustard)] shadow font-bold border border-[var(--mustard)] ring-2 ring-[var(--mustard)]/30"
                      : "bg-white text-gray-700 hover:bg-amber-50 hover:text-black border border-gray-200"
                  }`}
                >
                  <span>{b.name}</span>
                  <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full font-bold ${
                    activeBrand === b.name ? "bg-[var(--mustard)] text-[var(--ink)]" : "bg-gray-100 text-gray-500"
                  }`}>
                    {b.count}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {results.length === 0 ? (
            <div className="text-center py-20 bg-white/40 rounded-lg border border-dashed border-[var(--line)] p-8">
              <p className="font-display text-xl mb-2 font-semibold">No matches on the rack.</p>
              <p className="text-sm opacity-60 mb-4">Try clearing a filter, selecting a different segment, or searching a different term.</p>
              <button
                onClick={() => { setSelected([]); setSizeSel(null); setMaxPrice(5000); setQuery(""); setInStockOnly(false); }}
                className="yd-btn yd-btn-outline px-5 py-2.5"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
              {results.map((p, i) => (
                <ProductCard
                  key={p.id}
                  p={p}
                  index={i}
                  onOpen={onOpen}
                  wishlist={wishlist}
                  toggleWish={toggleWish}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

