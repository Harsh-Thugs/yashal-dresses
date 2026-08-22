import React from "react";
import { X, ChevronRight } from "lucide-react";

export default function MobileNav({ open, close, categories, setPage, setActiveCategory }) {
  return (
    <div className={`fixed inset-0 z-[55] md:hidden ${open ? "" : "pointer-events-none"}`}>
      <div className={`absolute inset-0 bg-black/40 transition-opacity ${open ? "opacity-100" : "opacity-0"}`} onClick={close} />
      <div className={`absolute left-0 top-0 bottom-0 w-72 bg-[var(--ivory)] transition-transform duration-300 ${open ? "translate-x-0" : "-translate-x-full"} overflow-y-auto shadow-2xl`}>
        <div className="flex items-center justify-between px-5 py-4 divider">
          <p className="font-display text-lg font-semibold">Segments Menu</p>
          <button onClick={close}><X size={20} /></button>
        </div>
        <div className="p-2">
          {categories.map((c) => (
            <button
              key={c.name}
              onClick={() => { setActiveCategory(c.name); setPage("shop"); close(); }}
              className="w-full flex items-center justify-between px-3 py-3 text-sm hover:bg-black/5 rounded font-medium"
            >
              {c.name} <ChevronRight size={15} className="opacity-40" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
