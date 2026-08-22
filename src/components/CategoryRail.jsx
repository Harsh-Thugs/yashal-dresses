import React, { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function CategoryRail({ categories, active, onSelect }) {
  const scrollRef = useRef(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(false);

  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 4);
    setCanRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, [categories]);

  const scrollBy = (dir) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * 260, behavior: "smooth" });
  };

  return (
    <div className="yd-ink-bg border-t border-white/10 relative">
      <div className="max-w-7xl mx-auto px-4 md:px-6 relative">
        {canLeft && (
          <>
            <div className="absolute left-4 md:left-6 top-0 bottom-0 w-10 pointer-events-none z-10"
              style={{ background: "linear-gradient(90deg, var(--ink), transparent)" }} />
            <button
              onClick={() => scrollBy(-1)}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-20 w-7 h-7 rounded-full flex items-center justify-center shadow"
              style={{ background: "var(--ink)", border: "1px solid var(--mustard)" }}
              aria-label="Scroll categories left"
            >
              <ChevronLeft size={15} color="var(--mustard)" />
            </button>
          </>
        )}
        <div
          ref={scrollRef}
          onScroll={checkScroll}
          className="flex gap-2 overflow-x-auto scrollbar-none py-2.5"
        >
          <button
            onClick={() => onSelect(null)}
            className={`cat-chip px-3 py-1.5 shrink-0 ${!active ? "active" : ""}`}
            style={{ color: !active ? undefined : "var(--ivory)" }}
          >
            All Segments
          </button>
          {categories.map((c) => (
            <button
              key={c.name}
              onClick={() => onSelect(c.name)}
              className={`cat-chip px-3 py-1.5 shrink-0 ${active === c.name ? "active" : ""}`}
              style={{ color: active === c.name ? undefined : "var(--ivory)" }}
            >
              {c.name}
            </button>
          ))}
        </div>
        {canRight && (
          <>
            <div className="absolute right-4 md:right-6 top-0 bottom-0 w-10 pointer-events-none z-10"
              style={{ background: "linear-gradient(270deg, var(--ink), transparent)" }} />
            <button
              onClick={() => scrollBy(1)}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-20 w-7 h-7 rounded-full flex items-center justify-center shadow"
              style={{ background: "var(--ink)", border: "1px solid var(--mustard)" }}
              aria-label="Scroll categories right"
            >
              <ChevronRight size={15} color="var(--mustard)" />
            </button>
          </>
        )}
      </div>
    </div>
  );
}
