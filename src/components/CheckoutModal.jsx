import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ShieldCheck, CreditCard, QrCode, Building2, Lock, CheckCircle2,
  AlertCircle, Download, FileText, ArrowLeft, RefreshCw, Smartphone, Send, Printer, ExternalLink, Truck
} from "lucide-react";
import { AnimatedSwingTag, Crest, WaxSeal } from "./BrandDecorations";
import { money, STORE_CONTACT, SHIPPING_CONFIG } from "../data/initialData";

/* ----------------------------- CHECKOUT PAGE ----------------------------- */
export function CheckoutPage({
  cart,
  products,
  onProceedToPayment,
  user
}) {
  const navigate = useNavigate();
  const items = cart
    .map((c) => {
      const product = products.find((p) => p.id === c.id);
      const quantity = Number(c.qty || 1);
      return {
        ...c,
        product,
        qty: quantity
      };
    })
    .filter((i) => Boolean(i.product));

  const subtotal = items.reduce((s, i) => s + (Number(i.product.price) * (i.qty || 1)), 0);
  const shipping = subtotal >= SHIPPING_CONFIG.freeThreshold || subtotal === 0 ? 0 : SHIPPING_CONFIG.flatRate;
  const total = subtotal + shipping;

  const [form, setForm] = useState({
    name: user?.name || "",
    phone: "",
    email: user?.email || "",
    address: "",
    notes: "",
  });

  const [paymentMode, setPaymentMode] = useState("upi"); // 'upi' | 'card' | 'cod'

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.address || !form.email) {
      alert("Please fill in all mandatory delivery details, including your email for the receipt.");
      return;
    }
    onProceedToPayment({
      customer: form,
      items: items.map(it => ({
        id: it.product.id,
        name: it.product.name,
        brand: it.product.brand || "Yashal",
        price: it.product.price,
        size: it.size,
        color: it.color || null,
        qty: it.qty || 1,
        image: (it.product.images && it.product.images[0]) || it.product.image || null,
      })),
      subtotal,
      shipping,
      total,
      paymentMethod: paymentMode === "upi" ? "Razorpay UPI / QR" : paymentMode === "card" ? "Razorpay Credit/Debit Card" : "Cash on Delivery",
    });
  };

  return (
    <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "32px 16px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <button
          onClick={() => navigate("/shop")}
          style={{ display: "flex", alignItems: "center", gap: "6px", background: "none", border: "none", color: "var(--ink)", fontFamily: "IBM Plex Mono", fontSize: "12px", cursor: "pointer" }}
        >
          ← Return to Atelier Shop
        </button>
        <span style={{ fontSize: "11px", fontFamily: "IBM Plex Mono", color: "var(--mustard-deep)", letterSpacing: "1px" }}>
          BESPOKE CHECKOUT & SECURE DISPATCH
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-8">
        {/* Left: Customer & Delivery Details */}
        <form onSubmit={handleSubmit} style={{ background: "var(--ivory)", border: "1px solid var(--line)", borderRadius: "10px", padding: "28px", boxShadow: "0 4px 15px rgba(0,0,0,0.03)" }}>
          <h2 className="font-display" style={{ fontSize: "20px", margin: "0 0 20px 0", color: "var(--ink)" }}>
            1. Patron & Delivery Details
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div>
              <label style={{ display: "block", fontSize: "12px", fontWeight: "600", marginBottom: "6px" }}>Full Name *</label>
              <input
                type="text"
                required
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Harshvardhan Shinde"
                style={{ width: "100%", padding: "10px 12px", borderRadius: "6px", border: "1px solid var(--line)", background: "var(--parchment)" }}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: "600", marginBottom: "6px" }}>Contact Phone *</label>
                <input
                  type="tel"
                  required
                  value={form.phone}
                  onChange={e => setForm({ ...form, phone: e.target.value })}
                  placeholder="e.g. 9822019283"
                  style={{ width: "100%", padding: "10px 12px", borderRadius: "6px", border: "1px solid var(--line)", background: "var(--parchment)" }}
                />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: "600", marginBottom: "6px" }}>Email Address</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  placeholder="For digital invoice"
                  style={{ width: "100%", padding: "10px 12px", borderRadius: "6px", border: "1px solid var(--line)", background: "var(--parchment)" }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: "block", fontSize: "12px", fontWeight: "600", marginBottom: "6px" }}>Shipping Address in Full *</label>
              <textarea
                required
                rows={3}
                value={form.address}
                onChange={e => setForm({ ...form, address: e.target.value })}
                placeholder="Flat / Bungalow No., Landmark, City, Pincode"
                style={{ width: "100%", padding: "10px 12px", borderRadius: "6px", border: "1px solid var(--line)", background: "var(--parchment)" }}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "12px", fontWeight: "600", marginBottom: "6px" }}>Tailoring / Fitting Instructions (Optional)</label>
              <input
                type="text"
                value={form.notes}
                onChange={e => setForm({ ...form, notes: e.target.value })}
                placeholder="e.g. Please hem trousers to 38 inches"
                style={{ width: "100%", padding: "10px 12px", borderRadius: "6px", border: "1px solid var(--line)", background: "var(--parchment)" }}
              />
            </div>
          </div>

          <h2 className="font-display" style={{ fontSize: "20px", margin: "28px 0 16px 0", color: "var(--ink)" }}>
            2. Payment Gateway Mode
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "24px" }}>
            <label style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px", borderRadius: "6px", border: paymentMode === "upi" ? "2px solid var(--mustard)" : "1px solid var(--line)", background: paymentMode === "upi" ? "rgba(212,175,55,0.08)" : "var(--parchment)", cursor: "pointer" }}>
              <input type="radio" name="pay" checked={paymentMode === "upi"} onChange={() => setPaymentMode("upi")} />
              <QrCode size={20} color="var(--mustard-deep)" />
              <div>
                <div style={{ fontWeight: "600", fontSize: "13px" }}>Razorpay UPI / Dynamic QR Code</div>
                <div style={{ fontSize: "11px", color: "var(--ink-soft)" }}>Google Pay, PhonePe, Paytm, BHIM</div>
              </div>
            </label>

              <label style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px", borderRadius: "6px", border: paymentMode === "card" ? "2px solid var(--mustard)" : "1px solid var(--line)", background: paymentMode === "card" ? "rgba(212,175,55,0.08)" : "var(--parchment)", cursor: "pointer" }}>
                <input type="radio" name="pay" checked={paymentMode === "card"} onChange={() => setPaymentMode("card")} />
                <CreditCard size={20} color="var(--mustard-deep)" />
                <div>
                  <div style={{ fontWeight: "600", fontSize: "13px" }}>Razorpay Credit / Debit Card & Netbanking</div>
                  <div style={{ fontSize: "11px", color: "var(--ink-soft)" }}>Visa, Mastercard, RuPay, Corporate Amex</div>
                </div>
              </label>

              <label style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px", borderRadius: "6px", border: paymentMode === "cod" ? "2px solid var(--mustard)" : "1px solid var(--line)", background: paymentMode === "cod" ? "rgba(212,175,55,0.08)" : "var(--parchment)", cursor: "pointer" }}>
                <input type="radio" name="pay" checked={paymentMode === "cod"} onChange={() => setPaymentMode("cod")} />
                <Truck size={20} color="var(--mustard-deep)" />
                <div>
                  <div style={{ fontWeight: "600", fontSize: "13px" }}>Cash on Delivery (COD)</div>
                  <div style={{ fontSize: "11px", color: "var(--ink-soft)" }}>Pay at your doorstep upon delivery</div>
                </div>
              </label>
          </div>

          <button
            type="submit"
            className="yd-btn yd-btn-primary"
            style={{ width: "100%", padding: "14px", background: "var(--ink)", color: "var(--ivory)", fontSize: "14px", fontWeight: "bold", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}
          >
            <Lock size={16} color="var(--mustard)" /> Proceed to Authorize & Pay {money(total)}
          </button>
        </form>

        {/* Right: Order Summary */}
        <div className="bg-[var(--ivory)] border border-[var(--line)] rounded-[10px] p-5 md:p-7 h-fit shadow-[0_4px_15px_rgba(0,0,0,0.03)]">
          <h3 className="font-display" style={{ margin: "0 0 16px 0", fontSize: "18px" }}>
            Bag Summary ({items.reduce((s, i) => s + i.qty, 0)} Items)
          </h3>

          <div style={{ display: "flex", flexDirection: "column", gap: "14px", marginBottom: "20px", maxHeight: "320px", overflowY: "auto" }}>
            {items.map((it, idx) => (
              <div key={idx} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px dashed var(--line)", paddingBottom: "10px" }}>
                <div>
                  <div style={{ fontWeight: "600", fontSize: "13px" }}>{it.product.name}</div>
                  <div style={{ fontSize: "11px", color: "var(--ink-soft)" }}>
                    Size: {it.size}{it.color ? ` • Colour: ${it.color}` : ''} • Qty: {it.qty} • {it.product.brand}
                  </div>
                </div>
                <div style={{ fontWeight: "600", fontSize: "13px", color: "var(--mustard-deep)" }}>
                  {money(it.product.price * it.qty)}
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "8px", borderTop: "1px solid var(--line)", paddingTop: "14px", fontSize: "13px" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>Subtotal:</span>
              <span>{money(subtotal)}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>Atelier Shipping:</span>
              <span>{shipping === 0 ? "FREE" : money(shipping)}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "16px", fontWeight: "bold", marginTop: "8px", paddingTop: "8px", borderTop: "1px solid var(--line)" }}>
              <span>Grand Total:</span>
              <span style={{ color: "var(--mustard-deep)" }}>{money(total)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ----------------------------- CONFIRMATION PAGE & TAX INVOICE ----------------------------- */
export function ConfirmationPage({ order, onSendEmailConfirmation }) {
  const navigate = useNavigate();
  const [emailStatus, setEmailStatus] = useState("");

  if (!order) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleSendEmail = async () => {
    setEmailStatus("Dispatching digital invoice...");
    const res = await onSendEmailConfirmation(order);
    if (res?.success) {
      setEmailStatus("✓ Digital invoice sent to patron & store manager!");
    } else {
      setEmailStatus("Email dispatch triggered via Google Apps Script.");
    }
  };

  return (
    <div className="max-w-[800px] mx-auto px-4 py-8 sm:py-10">
      {/* Top Banner */}
      <div className="text-center mb-6 sm:mb-8">
        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[var(--ink)] text-[var(--mustard)] flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow">
          <CheckCircle2 size={32} />
        </div>
        <p className="font-mono text-[10.5px] sm:text-[11px] tracking-widest uppercase text-[var(--mustard-deep)] font-bold">
          TRANSACTION VERIFIED &amp; CONFIRMED
        </p>
        <h1 className="font-display text-2xl sm:text-3xl my-1 text-[var(--ink)] font-semibold">
          Order Confirmed, Ref #{order.id}
        </h1>
        <p className="text-xs sm:text-sm text-[var(--ink-soft)] max-w-md mx-auto">
          Thank you, <strong>{order.customer?.name}</strong>. Your bespoke menswear order is being tailored for dispatch.
        </p>
      </div>

      {/* Printable Tax Invoice Card */}
      <div id="printable-tax-invoice" className="bg-[var(--ivory)] border-2 border-[var(--line)] rounded-[10px] p-4 sm:p-8 shadow-[0_8px_24px_rgba(0,0,0,0.04)] mb-7">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b-2 border-[var(--line)] pb-4 sm:pb-5 mb-5 gap-3">
          <div>
            <h2 className="font-display text-xl sm:text-2xl font-bold text-[var(--ink)]">
              YASHAL DRESSES
            </h2>
            <p className="text-[11px] text-[var(--ink-soft)] leading-snug mt-1">
              {STORE_CONTACT.address?.line1 || "Sector 25, Plot 601, Nigdi"}, {STORE_CONTACT.address?.city || "Pune"}<br />
              Phone: {STORE_CONTACT.phone} | Email: {STORE_CONTACT.email}
            </p>
          </div>
          <div className="text-left sm:text-right w-full sm:w-auto">
            <span className="text-[10px] sm:text-[11px] font-mono bg-[var(--ink)] text-[var(--mustard)] px-2 py-1 rounded inline-block font-bold">
              TAX INVOICE
            </span>
            <div className="text-xs font-bold mt-1.5">Invoice #{order.id}</div>
            <div className="text-[11px] text-[var(--ink-soft)] font-mono">{new Date(order.date).toLocaleDateString("en-IN")}</div>
          </div>
        </div>

        {/* Customer & Payment Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 text-xs bg-[var(--parchment)] p-3.5 sm:p-4 rounded-md">
          <div>
            <strong className="font-mono text-[10px] tracking-wider text-[var(--ink-soft)] block mb-1">BILLED TO:</strong>
            <div className="font-bold text-sm">{order.customer?.name}</div>
            <div className="font-mono text-[11px] text-gray-700">📞 {order.customer?.phone}</div>
            <div className="text-gray-600 mt-1 leading-relaxed">{order.customer?.address}</div>
          </div>
          <div className="text-left sm:text-right pt-2 sm:pt-0 border-t sm:border-t-0 border-[var(--line)]">
            <strong className="font-mono text-[10px] tracking-wider text-[var(--ink-soft)] block mb-1">PAYMENT STATUS:</strong>
            <span className="text-emerald-700 font-bold inline-block bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              ✓ {order.paymentMethod || "PAID"}
            </span>
            <div className="font-mono text-[10px] text-gray-500 mt-1">Txn Ref: {order.transactionId || "N/A"}</div>
            <div className="text-[11px] text-amber-900 font-medium mt-0.5">Est. Delivery: 2 - 4 Business Days</div>
          </div>
        </div>

        {/* Items Table */}
        <div className="overflow-x-auto mb-5">
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px", minWidth: "500px" }}>
            <thead>
            <tr style={{ background: "rgba(26,18,36,0.06)", borderBottom: "1px solid var(--line)", textAlign: "left", fontFamily: "IBM Plex Mono", fontSize: "11px" }}>
              <th style={{ padding: "10px" }}>Item Description</th>
              <th style={{ padding: "10px", textAlign: "center" }}>Size</th>
              <th style={{ padding: "10px", textAlign: "center" }}>Qty</th>
              <th style={{ padding: "10px", textAlign: "right" }}>Rate</th>
              <th style={{ padding: "10px", textAlign: "right" }}>Amount</th>
            </tr>
          </thead>
          <tbody>
            {order.items?.map((it, idx) => {
              const itemQty = Number(it.qty || 1);
              return (
                <tr key={idx} style={{ borderBottom: "1px solid var(--line)" }}>
                  <td style={{ padding: "10px" }}>
                    <strong>{it.name}</strong><br />
                    <span style={{ fontSize: "11px", color: "var(--ink-soft)" }}>Label: {it.brand || "Yashal"}</span>
                  </td>
                  <td style={{ padding: "10px", textAlign: "center" }}>{it.size}</td>
                  <td style={{ padding: "10px", textAlign: "center" }}>{itemQty}</td>
                  <td style={{ padding: "10px", textAlign: "right" }}>{money(it.price)}</td>
                  <td style={{ padding: "10px", textAlign: "right", fontWeight: "600" }}>{money(it.price * itemQty)}</td>
                </tr>
              );
            })}
            </tbody>
          </table>
        </div>

        {/* Grand Total */}
        <div className="flex justify-end border-t-2 border-[var(--line)] pt-3.5">
          <div className="w-full sm:w-60 text-xs sm:text-sm space-y-1">
            <div className="flex justify-between">
              <span className="opacity-70">Subtotal:</span>
              <span className="font-medium">{money(order.subtotal || order.total)}</span>
            </div>
            <div className="flex justify-between">
              <span className="opacity-70">Shipping:</span>
              <span className="font-medium">{order.shipping ? money(order.shipping) : "FREE"}</span>
            </div>
            <div className="flex justify-between text-base font-bold border-t border-[var(--line)] pt-2 mt-1 text-[var(--mustard-deep)]">
              <span>Total Paid:</span>
              <span>{money(order.total)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <button
          onClick={handlePrint}
          className="yd-btn py-3 px-5 bg-[var(--ink)] text-[var(--ivory)] flex items-center justify-center gap-2 rounded shadow"
        >
          <Printer size={16} color="var(--mustard)" /> Print Tax Invoice
        </button>

        <button
          onClick={handleSendEmail}
          className="yd-btn py-3 px-5 bg-[var(--mustard)] text-[var(--ink)] flex items-center justify-center gap-2 rounded shadow font-bold"
        >
          <Send size={16} /> Send Email Copy
        </button>

        <button
          onClick={() => navigate("/shop")}
          className="yd-btn py-3 px-5 bg-transparent border border-[var(--line)] text-[var(--ink)] flex items-center justify-center rounded"
        >
          Continue Shopping
        </button>
      </div>

      {emailStatus && (
        <p className="text-center text-xs text-[var(--mustard-deep)] mt-4 font-semibold animate-pulse">
          {emailStatus}
        </p>
      )}
    </div>
  );
}

export default CheckoutPage;
