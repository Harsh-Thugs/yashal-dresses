import React from "react";
import { ShoppingBag, X, Plus, Minus, Trash2, ArrowRight } from "lucide-react";
import { Swatch } from "./BrandDecorations";

const money = (n) => `₹${n.toLocaleString("en-IN")}`;

export default function CartDrawer({ open, close, cart, products, updateQty, removeItem, setPage, user, openLogin }) {
  const items = cart.map((c) => ({
    ...c,
    product: products.find((p) => p.id === c.id),
  })).filter((i) => Boolean(i.product));

  const subtotal = items.reduce((s, i) => s + i.product.price * i.qty, 0);
  const freeShippingThreshold = 999;
  const progressToFreeShipping = Math.min(100, (subtotal / freeShippingThreshold) * 100);

  return (
    <div className={`fixed inset-0 z-50 ${open ? "" : "pointer-events-none"}`}>
      <div
        className={`absolute inset-0 bg-black/40 backdrop-blur-[1px] transition-opacity ${open ? "opacity-100" : "opacity-0"}`}
        onClick={close}
      />
      <div
        className={`absolute right-0 top-0 bottom-0 w-full max-w-md bg-[var(--ivory)] flex flex-col transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        } shadow-2xl`}
      >
        <div className="flex items-center justify-between px-5 py-4 divider">
          <h2 className="font-display text-lg font-semibold flex items-center gap-2">
            <ShoppingBag size={18} /> Your Bag ({items.length})
          </h2>
          <button onClick={close} className="p-1 hover:opacity-75"><X size={20} /></button>
        </div>

        {/* Free shipping banner */}
        {subtotal > 0 && (
          <div className="bg-amber-500/10 px-5 py-2.5 border-b border-[var(--line)]">
            <p className="text-xs font-mono mb-1 text-amber-900 font-medium">
              {subtotal >= freeShippingThreshold
                ? "🎉 You qualified for FREE PAN-INDIA SHIPPING!"
                : `Add ${money(freeShippingThreshold - subtotal)} more for FREE SHIPPING`}
            </p>
            <div className="w-full bg-black/10 h-1.5 rounded-full overflow-hidden">
              <div className="bg-[var(--mustard)] h-full transition-all duration-300" style={{ width: `${progressToFreeShipping}%` }} />
            </div>
          </div>
        )}

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
            <ShoppingBag size={36} className="opacity-25 mb-3" />
            <p className="font-display text-xl mb-1 font-semibold">Your bag is empty.</p>
            <p className="text-sm opacity-60 mb-5">Nothing tagged for checkout yet.</p>
            <button
              onClick={() => { close(); setPage("shop"); }}
              className="yd-btn yd-btn-primary px-6 py-2.5"
            >
              Start shopping
            </button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3 yd-scroll">
              {items.map((i) => (
                <div key={i.id + i.size} className="flex gap-3 tag-card p-3 items-center">
                  <Swatch p={i.product} className="w-20 h-20 rounded shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{i.product.name}</p>
                    <p className="font-mono text-[10px] opacity-55 mt-0.5">SIZE {i.size}</p>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border border-[var(--line)] rounded bg-white">
                        <button onClick={() => updateQty(i.id, i.size, -1)} className="p-1 hover:bg-black/5"><Minus size={12} /></button>
                        <span className="px-2.5 text-xs font-mono font-semibold">{i.qty}</span>
                        <button onClick={() => updateQty(i.id, i.size, 1)} className="p-1 hover:bg-black/5"><Plus size={12} /></button>
                      </div>
                      <span className="text-sm font-semibold">{money(i.product.price * i.qty)}</span>
                    </div>
                  </div>
                  <button onClick={() => removeItem(i.id, i.size)} className="self-start opacity-40 hover:opacity-100 p-1">
                    <Trash2 size={15} color="var(--oxblood)" />
                  </button>
                </div>
              ))}
            </div>

            <div className="px-5 py-4 divider bg-[var(--parchment)]">
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="opacity-70">Subtotal</span>
                <span className="font-semibold text-base">{money(subtotal)}</span>
              </div>
              <p className="text-[11px] opacity-55 mb-4">Taxes included · Free returns pan-India.</p>
              <button
                onClick={() => {
                  close();
                  if (!user) {
                    openLogin();
                  } else {
                    setPage("checkout");
                  }
                }}
                className="yd-btn yd-btn-primary w-full py-3.5 flex items-center justify-center gap-2 text-sm font-bold shadow-lg"
                style={{ background: "var(--ink)", color: "var(--ivory)" }}
              >
                Checkout · {money(subtotal)} <ArrowRight size={16} />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

