import React, { useState } from "react";
import { Search, ShoppingBag, User, Menu, X, LayoutDashboard, Store, MessageCircle } from "lucide-react";
import { Crest } from "./BrandDecorations";

export default function Header({
  page, setPage, query, setQuery, cartCount, onCartClick, user, onLoginClick, onMenuClick, isAdminMode, setIsAdminMode, onInquiryClick
}) {
  const [showSearch, setShowSearch] = useState(false);

  return (
    <header className="sticky top-0 z-40 yd-ink-bg shadow-md w-full">
      <div className="max-w-7xl mx-auto px-2.5 sm:px-4 md:px-6">
        <div className="flex items-center justify-between h-14 sm:h-16 gap-1.5 sm:gap-4">
          
          {/* Left section: Mobile menu & Brand logo */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            <button
              className="md:hidden text-white/90 hover:text-white p-1 cursor-pointer"
              onClick={onMenuClick}
              aria-label="Open segments menu"
            >
              <Menu size={20} />
            </button>
            <button
              onClick={() => { setPage("home"); setIsAdminMode(false); }}
              className="flex items-center gap-1.5 sm:gap-2.5 group cursor-pointer text-left"
            >
              <Crest size={26} showBanner={false} className="shrink-0" />
              <span className="flex flex-col items-start leading-none">
                <span className="font-display text-base sm:text-xl md:text-2xl tracking-tight font-semibold">
                  <span>YASHAL</span>{" "}
                  <span className="yd-mustard">DRESSES</span>
                </span>
                <span className="font-mono text-[8px] sm:text-[9px] tracking-[0.2em] opacity-60 hidden sm:block mt-0.5">
                  MEN'S APPAREL &amp; WORKROOM
                </span>
              </span>
            </button>
          </div>

          {/* Center search bar for desktop */}
          {!isAdminMode && (
            <div className="hidden md:block flex-1 max-w-md mx-2">
              <div className="flex items-center gap-2 bg-white/10 rounded-full px-4 py-2 focus-within:bg-white/15 transition-all">
                <Search size={16} className="opacity-70 shrink-0 text-white" />
                <input
                  value={query}
                  onChange={(e) => { setQuery(e.target.value); setPage("shop"); }}
                  placeholder="Search shirts, jeans, kurtas, cargos…"
                  className="bg-transparent outline-none text-sm w-full placeholder:text-white/50 text-white"
                />
                {query && (
                  <button onClick={() => setQuery("")} className="cursor-pointer">
                    <X size={14} className="opacity-70 text-white hover:opacity-100" />
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Right action tools: Merchant Portal Switch, Search, Account, Bag */}
          <div className="flex items-center gap-1 sm:gap-2 md:gap-3 shrink-0">
            
            {/* Direct Store Inquiry Button */}
            {!isAdminMode && (
              <button
                onClick={onInquiryClick}
                className="flex items-center gap-1 px-2 sm:px-2.5 py-1 sm:py-1.5 rounded text-[11px] font-mono border transition-all font-bold shadow cursor-pointer"
                style={{
                  backgroundColor: "rgba(212,175,55,0.15)",
                  color: "var(--mustard)",
                  borderColor: "var(--mustard)"
                }}
                title="Inquire with Store: 9673533839"
                aria-label="Inquire with Store"
              >
                <MessageCircle size={14} />
                <span className="hidden lg:inline">Inquire: 9673533839</span>
                <span className="hidden sm:inline lg:hidden">Inquire</span>
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
              className="flex items-center gap-1 px-2 sm:px-2.5 py-1 sm:py-1.5 rounded text-[11px] font-mono border transition-all cursor-pointer"
              style={{
                backgroundColor: isAdminMode ? "var(--mustard)" : "rgba(255,255,255,0.08)",
                color: isAdminMode ? "var(--ink)" : "var(--mustard)",
                borderColor: "var(--mustard)"
              }}
              title="Toggle Admin / Merchant Inventory Dashboard"
              aria-label="Toggle Merchant Workroom"
            >
              {isAdminMode ? <Store size={14} /> : <LayoutDashboard size={14} />}
              <span className="hidden md:inline font-semibold">
                {isAdminMode ? "Storefront Mode" : "Merchant Workroom"}
              </span>
            </button>

            {!isAdminMode && (
              <>
                <button
                  className="md:hidden text-white/90 hover:text-white p-1.5 cursor-pointer"
                  onClick={() => setShowSearch((s) => !s)}
                  aria-label="Search"
                >
                  <Search size={18} />
                </button>
                
                <button
                  onClick={onLoginClick}
                  className="flex items-center gap-1 text-white/90 hover:text-white p-1.5 cursor-pointer"
                  aria-label="Account"
                >
                  <User size={18} />
                  <span className="hidden md:inline text-xs font-mono">{user ? user.name.split(" ")[0] : "Login"}</span>
                </button>

                <button
                  onClick={onCartClick}
                  className="relative text-white/90 hover:text-white p-1.5 cursor-pointer"
                  aria-label="Cart"
                >
                  <ShoppingBag size={18} />
                  {cartCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 bg-[var(--mustard)] text-[9px] font-mono font-bold rounded-full w-4 h-4 flex items-center justify-center text-[var(--ink)] shadow">
                      {cartCount}
                    </span>
                  )}
                </button>
              </>
            )}
          </div>
        </div>

        {/* Expandable Search Input for Mobile */}
        {!isAdminMode && showSearch && (
          <div className="md:hidden pb-3 pt-1 px-1">
            <div className="flex items-center gap-2 bg-white/15 rounded-full px-3.5 py-1.5 border border-white/20">
              <Search size={15} className="opacity-70 shrink-0 text-white" />
              <input
                autoFocus
                value={query}
                onChange={(e) => { setQuery(e.target.value); setPage("shop"); }}
                placeholder="Search shirts, jeans, kurtas, cargos…"
                className="bg-transparent outline-none text-xs w-full placeholder:text-white/60 text-white"
              />
              {query && (
                <button onClick={() => setQuery("")} className="cursor-pointer">
                  <X size={14} className="opacity-70 text-white" />
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
