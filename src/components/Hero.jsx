import React from "react";
import { PaisleyBackground, SparkleField, Peacock, Swatch, GoldenAtelierDust } from "./BrandDecorations";

export default function Hero({ setPage = () => {}, setActiveCategory = () => {}, products = [] }) {
  const featuredCategories = ["Formal Shirts", "Kurta Pyjamas", "Cotton Pants", "Formal T-Shirts"];

  return (
    <section className="yd-ink-bg relative overflow-hidden">
      <PaisleyBackground opacity={0.05} size={110} />
      <SparkleField count={16} />
      <GoldenAtelierDust count={48} />
      <div className="hidden lg:block absolute -right-6 top-1/2 -translate-y-1/2 pointer-events-none">
        <Peacock size={360} />
      </div>
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-10 md:py-24 grid grid-cols-1 md:grid-cols-5 gap-8 md:gap-10 items-center relative z-10">
        <div className="md:col-span-3 text-left">
          <p className="font-mono text-[11px] sm:text-xs tracking-[0.25em] sm:tracking-[0.3em] yd-mustard mb-3 sm:mb-4 font-bold">
            EST. WORKROOM № 12 · PUNE
          </p>
          <h1 className="font-display text-3xl sm:text-5xl md:text-6xl leading-[1.12] sm:leading-[1.05]" style={{ fontWeight: 600 }}>
            Cut to fit the <br className="hidden sm:inline" />way you actually <br className="hidden sm:inline" />move.
          </h1>
          <p className="mt-4 sm:mt-6 text-white/70 max-w-md text-sm sm:text-base leading-relaxed">
            Formal shirting, casual layers, tailored trousers and festive kurtas — stitched with the same tag-and-thread
            care whether it's going to the office or a celebration.
          </p>
          <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => { setActiveCategory(null); setPage("shop"); }}
              className="yd-btn yd-btn-primary px-6 py-3.5 shadow-lg w-full sm:w-auto text-center"
              style={{ background: "var(--mustard)", color: "var(--ink)" }}
            >
              Shop the collection
            </button>
            <button
              onClick={() => { setActiveCategory("Kurta Pyjamas"); setPage("shop"); }}
              className="yd-btn px-6 py-3.5 border border-white/30 text-white/90 hover:bg-white/10 w-full sm:w-auto text-center"
            >
              Kurta edit →
            </button>
          </div>
        </div>

        <div className="md:col-span-2 grid grid-cols-2 gap-2.5 sm:gap-3">
          {featuredCategories.map((cat, i) => {
            const p = (products && products.length > 0)
              ? (products.find((x) => x.category === cat) || products[i % products.length])
              : { name: cat, category: cat };
            return (
              <button
                key={cat}
                onClick={() => { setActiveCategory(cat); setPage("shop"); }}
                className="tag-card text-left group"
                style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.15)" }}
              >
                <Swatch p={p} className="h-24 sm:h-28 md:h-32" />
                <div className="px-2.5 py-2 sm:px-3">
                  <p className="font-mono text-[9px] sm:text-[10px] tracking-widest text-white/60">{String(i + 1).padStart(2, "0")}</p>
                  <p className="text-xs sm:text-sm text-white/90 group-hover:text-[var(--mustard)] transition-colors truncate">{cat}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
