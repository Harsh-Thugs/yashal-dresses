import React from "react";
import { useReveal, GoldenAtelierDust } from "./BrandDecorations";

export default function FestiveBanner({ setPage, setActiveCategory }) {
  const [ref, inView] = useReveal();

  return (
    <section ref={ref} className={`reveal ${inView ? "in" : ""}`}>
      <div className="festive-border relative overflow-hidden" style={{ padding: "2px 0" }}>
        <GoldenAtelierDust count={36} />
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-10 flex flex-col sm:flex-row items-center justify-between gap-6 relative z-20" style={{ background: "var(--ink)", color: "var(--ivory)" }}>
          <div className="text-center sm:text-left">
            <p className="font-mono text-[11px] tracking-widest yd-mustard mb-1 font-bold">THE SIGNATURE SHIRTS &amp; TEES EDIT</p>
            <h3 className="font-display text-2xl md:text-3xl font-semibold">Oxford Shirts, Heavyweight Tees &amp; Structured Polos.</h3>
            <p className="text-sm text-white/60 mt-1 max-w-md">Masterfully crafted everyday essentials — from crisp morning workdays to relaxed weekend evenings.</p>
          </div>
          <button
            onClick={() => { setActiveCategory("Formal Shirts"); setPage("shop"); }}
            className="yd-btn px-6 py-3.5 shrink-0 font-bold text-xs shadow-lg"
            style={{ background: "var(--mustard)", color: "var(--ink)" }}
          >
            Explore Formal Shirts →
          </button>
        </div>
      </div>
    </section>
  );
}
