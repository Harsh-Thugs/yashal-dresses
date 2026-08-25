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
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-14 md:py-24 grid md:grid-cols-5 gap-10 items-center relative z-10">
        <div className="md:col-span-3">
          <p className="font-mono text-xs tracking-[0.3em] yd-mustard mb-4">EST. WORKROOM № 12 · PUNE</p>
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl leading-[1.05]" style={{ fontWeight: 600 }}>
            Cut to fit the<br /> way you actually<br /> move.
          </h1>
          <p className="mt-6 text-white/70 max-w-md text-base leading-relaxed">
            Formal shirting, casual layers, tailored trousers and festive kurtas — stitched with the same tag-and-thread
            care whether it's going to the office or a celebration.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <button
              onClick={() => { setActiveCategory(null); setPage("shop"); }}
              className="yd-btn yd-btn-primary px-6 py-3 shadow-lg"
              style={{ background: "var(--mustard)", color: "var(--ink)" }}
            >
              Shop the collection
            </button>
            <button
              onClick={() => { setActiveCategory("Kurta Pyjamas"); setPage("shop"); }}
              className="yd-btn px-6 py-3 border border-white/30 text-white/90 hover:bg-white/10"
            >
              Kurta edit →
            </button>
          </div>
        </div>

        <div className="md:col-span-2 grid grid-cols-2 gap-3">
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
                <Swatch p={p} className="h-28 md:h-32" />
                <div className="px-3 py-2">
                  <p className="font-mono text-[10px] tracking-widest text-white/60">{String(i + 1).padStart(2, "0")}</p>
                  <p className="text-sm text-white/90 group-hover:text-[var(--mustard)] transition-colors">{cat}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
