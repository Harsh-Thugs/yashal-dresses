import React from "react";
import { Package } from "lucide-react";
import { Swatch } from "./BrandDecorations";

const money = (n) => `₹${n.toLocaleString("en-IN")}`;
const STATUS_STEPS = ["Placed", "Packed", "Shipped", "Out for Delivery", "Delivered"];

function OrderTracker({ status }) {
  const idx = STATUS_STEPS.indexOf(status) >= 0 ? STATUS_STEPS.indexOf(status) : 0;
  return (
    <div className="flex items-center mt-4">
      {STATUS_STEPS.map((s, i) => (
        <React.Fragment key={s}>
          <div className="flex flex-col items-center gap-1.5">
            <div className={`step-dot ${i <= idx ? "done" : ""}`} />
            <span className="text-[10px] font-mono text-center w-16 opacity-70">{s}</span>
          </div>
          {i < STATUS_STEPS.length - 1 && (
            <div className="flex-1 h-[1.5px] mb-4" style={{ background: i < idx ? "var(--mustard)" : "var(--line)" }} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

export default function OrdersPage({ orders, products, setPage }) {
  if (orders.length === 0) {
    return (
      <div className="max-w-lg mx-auto px-4 py-24 text-center">
        <Package size={36} className="opacity-30 mx-auto mb-3" />
        <p className="font-display text-xl mb-1 font-semibold">No orders yet.</p>
        <p className="text-sm opacity-60 mb-5">Once you place an order, you'll be able to track it here.</p>
        <button onClick={() => setPage("shop")} className="yd-btn yd-btn-primary px-6 py-2.5">
          Start shopping
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 md:px-6 py-8">
      <h1 className="font-display text-2xl md:text-3xl mb-6 font-semibold">Your Orders &amp; Dispatch History</h1>
      <div className="space-y-5">
        {orders.map((o) => (
          <div key={o.id} className="tag-card p-5 bg-white">
            <div className="flex items-center justify-between mb-1 border-b pb-2">
              <div>
                <p className="font-mono text-sm font-bold text-gray-900">{o.id}</p>
                <p className="text-[11px] text-gray-500 font-mono">Paid via {o.paymentMethod || "Razorpay"}</p>
              </div>
              <p className="font-mono text-xs opacity-60">{o.date}</p>
            </div>

            <div className="flex gap-2.5 mt-3 mb-2 overflow-x-auto py-1">
              {o.items.slice(0, 5).map((i, idx) => {
                const prod = products.find((p) => p.id === i.id) || { name: i.name, category: "Shirts" };
                return (
                  <div key={idx} className="relative group">
                    <Swatch p={prod} className="w-14 h-14 rounded shrink-0 border" />
                    <span className="absolute -bottom-1 -right-1 bg-black text-white text-[9px] font-mono px-1 rounded">
                      ×{i.qty}
                    </span>
                  </div>
                );
              })}
            </div>

            <p className="text-sm opacity-80 mt-2">
              {o.items.length} item{o.items.length > 1 ? "s" : ""} · Total:{" "}
              <span className="font-bold" style={{ color: "var(--ink)" }}>{money(o.total)}</span>
            </p>

            <OrderTracker status={o.status || "Placed"} />
          </div>
        ))}
      </div>
    </div>
  );
}

