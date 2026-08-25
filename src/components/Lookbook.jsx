import React from "react";
import { useReveal, Swatch } from "./BrandDecorations";

const LOOKS = [
  { title: "Executive Formal", items: ["Zodiac Milano Classic Full Sleeve Shirt", "Blackberry Tailored Fit Charcoal Formal Trouser"] },
  { title: "Weekend Casual", items: ["Classic Song Washed Indigo Denim Casual Shirt", "Kanchiro 6-Pocket Tactical Utility Cargo"] },
  { title: "Festive Royalty", items: ["Velmore Royal Jacquard Kurta Pyjama Set", "Sanwara Embroidered Silk Blend Kurta Pyjama"] },
  { title: "Smart Layer", items: ["Monte Carlo Premium Fleece Crewneck Sweatshirt", "Live in Ultra-Soft Chino Cotton Pants"] },
];

export default function Lookbook({ products = [], onOpen = () => {}, setPage = () => {} }) {
  const [ref, inView] = useReveal();

  return (
    <section ref={ref} className={`max-w-7xl mx-auto px-4 md:px-6 py-14 reveal ${inView ? "in" : ""}`}>
      <div className="flex items-end justify-between mb-6">
        <div>
          <p className="font-mono text-[11px] tracking-widest yd-mustard">04 · STYLING NOTES</p>
          <h2 className="font-display text-2xl md:text-3xl mt-1 font-semibold">The lookbook.</h2>
        </div>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {LOOKS.map((look) => {
          const items = look.items
            .map((n) => (products && products.length > 0 ? products.find((p) => p.name === n) : null))
            .filter(Boolean);
          return (
            <div key={look.title} className="tag-card p-4">
              <div className="tag-hole" />
              <div className="relative h-40 mb-3">
                {items.map((p, i) => (
                  <div
                    key={p.id || i}
                    className="absolute rounded-lg overflow-hidden shadow-lg border border-[var(--line)]"
                    style={{
                      width: 76, height: 76,
                      left: `${i * 34}px`, top: `${i % 2 === 0 ? 4 : 26}px`,
                      transform: `rotate(${i % 2 === 0 ? -6 : 5}deg)`, zIndex: i,
                    }}
                  >
                    <Swatch p={p} className="w-full h-full" />
                  </div>
                ))}
              </div>
              <p className="font-display text-lg font-semibold">{look.title}</p>
              <ul className="mt-2 space-y-1">
                {items.map((p) => (
                  <li key={p.id}>
                    <button onClick={() => onOpen(p)} className="text-xs opacity-70 hover:opacity-100 underline underline-offset-2">
                      {p.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </section>
  );
}
