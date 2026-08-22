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
          <div className="flex items-center gap-3">
            <button className="md:hidden text-white/90 hover:text-white" onClick={onMenuClick} aria-label="Open menu">
              <Menu size={22} />
            </button>
            <button onClick={() => { setPage("home"); setIsAdminMode(false); }} className="flex items-center gap-2.5 group">
              <Crest size={30} showBanner={false} />
              <span className="flex flex-col items-start leading-none">
                <span className="font-display text-xl md:text-2xl tracking-tight" style={{ fontWeight: 600 }}>
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
                <span className="font-mono text-[9px] tracking-[0.25em] opacity-60 hidden sm:block mt-0.5">
                  MEN'S APPAREL &amp; WORKROOM
                </span>
              </span>
            </button>
          </div>

          {/* Center search bar */}
          {!isAdminMode && (
            <div className={`flex-1 max-w-md mx-2 ${showSearch ? "block" : "hidden"} md:block`}>
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
          <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
            
            {/* Direct Store Inquiry Button */}
            {!isAdminMode && (
              <button
                onClick={onInquiryClick}
                className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded text-xs font-mono border transition-all font-bold shadow"
                style={{
                  backgroundColor: "rgba(212,175,55,0.15)",
                  color: "var(--mustard)",
                  borderColor: "var(--mustard)"
                }}
                title="Inquire with Store: 9673533839"
              >
                <MessageCircle size={14} />
                <span className="hidden md:inline">Inquire: 9673533839</span>
                <span className="md:hidden">Inquire</span>
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
              className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono border transition-all"
              style={{
                backgroundColor: isAdminMode ? "var(--mustard)" : "rgba(255,255,255,0.08)",
                color: isAdminMode ? "var(--ink)" : "var(--mustard)",
                borderColor: "var(--mustard)"
              }}
              title="Toggle Admin / Merchant Inventory Dashboard"
            >
              {isAdminMode ? <Store size={15} /> : <LayoutDashboard size={15} />}
              <span className="hidden sm:inline font-semibold">
                {isAdminMode ? "Storefront Mode" : "Merchant Workroom"}
              </span>
            </button>

            {!isAdminMode && (
              <>
                <button className="md:hidden text-white/90" onClick={() => setShowSearch((s) => !s)} aria-label="Search">
                  <Search size={20} />
                </button>
                
                <button onClick={onLoginClick} className="flex items-center gap-1.5 text-white/90 hover:text-white" aria-label="Account">
                  <User size={20} />
                  <span className="hidden md:inline text-xs font-mono">{user ? user.name.split(" ")[0] : "Login"}</span>
                </button>

                <button onClick={onCartClick} className="relative text-white/90 hover:text-white p-1" aria-label="Cart">
                  <ShoppingBag size={20} />
                  {cartCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 bg-[var(--mustard)] text-[10px] font-mono font-bold rounded-full w-4 h-4 flex items-center justify-center text-[var(--ink)] shadow">
                      {cartCount}
                    </span>
                  )}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
