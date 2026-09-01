import React, { useState } from "react";
import { Search, ShoppingBag, User, Menu, X, LayoutDashboard, Store, MessageCircle } from "lucide-react";
import { Crest } from "./BrandDecorations";

export default function Header({
  page, setPage, query, setQuery, cartCount, onCartClick, user, onLoginClick, onMenuClick, isAdminMode, setIsAdminMode, onInquiryClick
}) {
  const [showSearch, setShowSearch] = useState(false);

  return (
    <header className="sticky top-0 z-40 yd-ink-bg shadow-md">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between h-16 gap-4">

          {/* Left section: Mobile menu & Brand logo */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <button className="md:hidden text-white/90 hover:text-white p-1" onClick={onMenuClick} aria-label="Open menu">
              <Menu size={20} />
            </button>
            <button onClick={() => { setPage("home"); setIsAdminMode(false); }} className="flex items-center gap-1.5 sm:gap-2.5 group text-left">
              <div className="shrink-0">
                <Crest size={24} showBanner={false} />
              </div>
              <span className="flex flex-col items-start leading-none whitespace-nowrap">
                <span className="font-display text-[14px] sm:text-xl md:text-2xl tracking-tight" style={{ fontWeight: 600 }}>
                  {"YASHAL".split("").map((ch, i) => (
                    <span key={i} className="stitch-letter" style={{ animationDelay: `${i * 40}ms` }}>{ch}</span>
                  ))}
                  {" "}
                  <span className="yd-mustard">
                    {"DRESSES".split("").map((ch, i) => (
                      <span key={i} className="stitch-letter" style={{ animationDelay: `${240 + i * 40}ms` }}>{ch}</span>
                    ))}
                  </span>
                </span>
                <span className="font-mono text-[8px] sm:text-[9px] tracking-[0.2em] sm:tracking-[0.25em] opacity-60 hidden sm:block mt-0.5">
                  MEN'S APPAREL &amp; WORKROOM
                </span>
              </span>
            </button>
          </div>

          {/* Desktop Center search bar */}
          {!isAdminMode && (
            <div className="hidden md:block flex-1 max-w-md mx-4">
              <div className="flex items-center gap-2 bg-white/10 rounded-full px-4 py-2 focus-within:bg-white/15 transition-all">
                <Search size={16} className="opacity-70 shrink-0" />
                <input
                  value={query}
                  onChange={(e) => { setQuery(e.target.value); setPage("shop"); }}
                  placeholder="Search shirts, jeans, kurtas, cargos…"
                  className="bg-transparent outline-none text-sm w-full placeholder:text-white/50 text-white"
                />
                {query && (
                  <button onClick={() => setQuery("")}><X size={14} className="opacity-70 text-white" /></button>
                )}
              </div>
            </div>
          )}

          {/* Right action tools: Merchant Portal Switch, Search, Account, Bag */}
          <div className="flex items-center gap-1.5 sm:gap-3 md:gap-4 shrink-0">

            {/* Direct Store Inquiry Button */}
            {!isAdminMode && (
              <button
                onClick={onInquiryClick}
                className="flex items-center justify-center gap-1.5 p-2 sm:px-3 sm:py-1.5 rounded-full sm:rounded text-xs font-mono border transition-all font-bold shadow"
                style={{
                  backgroundColor: "rgba(212,175,55,0.15)",
                  color: "var(--mustard)",
                  borderColor: "var(--mustard)"
                }}
                title="Inquire with Store: 9673533839"
                aria-label="Store Inquiry"
              >
                <MessageCircle size={15} />
                <span className="hidden md:inline">Inquire: 9673533839</span>
              </button>
            )}

            {/* Merchant Dashboard Toggle Button */}
            <button
              onClick={() => {
                if (isAdminMode) {
                  setIsAdminMode(false);
                  setPage("home");
                } else {
                  setIsAdminMode(true);
                  setPage("admin");
                }
              }}
              className="flex items-center justify-center gap-1.5 p-2 sm:px-3 sm:py-1.5 rounded-full sm:rounded text-xs font-mono border transition-all"
              style={{
                backgroundColor: isAdminMode ? "var(--mustard)" : "rgba(255,255,255,0.08)",
                color: isAdminMode ? "var(--ink)" : "var(--mustard)",
                borderColor: "var(--mustard)"
              }}
              title="Toggle Admin / Merchant Inventory Dashboard"
              aria-label="Merchant Dashboard"
            >
              {isAdminMode ? <Store size={15} /> : <LayoutDashboard size={15} />}
              <span className="hidden sm:inline font-semibold">
                {isAdminMode ? "Storefront Mode" : "Merchant Workroom"}
              </span>
            </button>

            {!isAdminMode && (
              <>
                <button className="md:hidden text-white/90 hover:text-white p-1" onClick={() => setShowSearch((s) => !s)} aria-label="Search">
                  <Search size={19} />
                </button>

                <button onClick={onLoginClick} className="flex items-center gap-1.5 text-white/90 hover:text-white p-1" aria-label="Account">
                  <User size={19} />
                  <span className="hidden md:inline text-xs font-mono">{user ? user.name.split(" ")[0] : "Login"}</span>
                </button>

                <button onClick={onCartClick} className="relative text-white/90 hover:text-white p-1" aria-label="Cart">
                  <ShoppingBag size={19} />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-[var(--mustard)] text-[9px] font-mono font-bold rounded-full w-4 h-4 flex items-center justify-center text-[var(--ink)] shadow">
                      {cartCount}
                    </span>
                  )}
                </button>
              </>
            )}
          </div>
        </div>

        {/* Mobile Expandable Search Bar */}
        {!isAdminMode && showSearch && (
          <div className="md:hidden pb-3 pt-1 animate-in fade-in slide-in-from-top-2 duration-150">
            <div className="flex items-center gap-2 bg-white/10 rounded-full px-4 py-2 border border-white/15 focus-within:border-[var(--mustard)]/60 focus-within:bg-white/20 transition-all">
              <Search size={16} className="text-[var(--mustard)] shrink-0" />
              <input
                value={query}
                onChange={(e) => { setQuery(e.target.value); setPage("shop"); }}
                placeholder="Search shirts, jeans, kurtas, cargos…"
                className="bg-transparent outline-none text-xs w-full placeholder:text-white/50 text-white font-sans"
                autoFocus
              />
              {query && (
                <button onClick={() => setQuery("")}><X size={14} className="opacity-70 text-white" /></button>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
