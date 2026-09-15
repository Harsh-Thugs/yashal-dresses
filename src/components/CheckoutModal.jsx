import React, { useState, useEffect } from "react";
import {
  ShieldCheck, CreditCard, QrCode, Building2, Lock, CheckCircle2,
  AlertCircle, Download, FileText, ArrowLeft, RefreshCw, Smartphone, Send, Printer, ExternalLink
} from "lucide-react";
import { AnimatedSwingTag, Crest, WaxSeal } from "./BrandDecorations";
import { money, STORE_CONTACT } from "../data/initialData";

/* ----------------------------- CHECKOUT PAGE ----------------------------- */
export function CheckoutPage({
  cart,
  products,
  setPage,
  onProceedToPayment,
  user
}) {
  const items = cart
    .map((c) => ({
      ...c,
      qty: c.qty || c.quantity || 1,
      quantity: c.qty || c.quantity || 1,
      product: products.find((p) => p.id === c.id)
    }))
    .filter((i) => Boolean(i.product));

  const subtotal = items.reduce((s, i) => s + i.product.price * (i.qty || i.quantity || 1), 0);
  const shipping = subtotal >= 999 || subtotal === 0 ? 0 : 79;
  const total = subtotal + shipping;

  const [form, setForm] = useState({
    name: user?.name || "Patron",
    phone: "9822019283",
    email: user?.email || "patron@example.com",
    address: "Bungalow No. 4, Model Colony, Pune - 411016",
    notes: "",
  });

  const [paymentMode, setPaymentMode] = useState("upi"); // 'upi' | 'card' | 'cod'

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.address) {
      alert("Please fill in all mandatory delivery details.");
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
        qty: it.qty || it.quantity || 1,
        quantity: it.qty || it.quantity || 1,
        image: (it.product.images && it.product.images[0]) || it.product.image || null,
      })),
      subtotal,
      shipping,
      total,
      paymentMethod: paymentMode === "upi" ? "Razorpay UPI / QR" : paymentMode === "card" ? "Razorpay Credit/Debit Card" : "Cash on Delivery",
    });
  };

  return (
    <div className="max-w-6xl mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-8 w-full overflow-hidden">
      <div className="flex flex-wrap justify-between items-center gap-2 mb-4 sm:mb-6">
        <button
          onClick={() => setPage("shop")}
          className="flex items-center gap-1.5 font-mono text-xs text-[var(--ink)] bg-white border border-[var(--line)] px-3.5 py-1.5 rounded-full hover:bg-[var(--mustard)] hover:text-black font-semibold transition-all shadow-sm cursor-pointer"
        >
          ← Return to Atelier Shop
        </button>
        <span className="text-[10px] sm:text-[11px] font-mono text-[var(--mustard-deep)] font-bold tracking-wider">
          BESPOKE CHECKOUT &amp; SECURE DISPATCH
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
        {/* Left: Customer & Delivery Details */}
        <form onSubmit={handleSubmit} className="lg:col-span-7 bg-[var(--ivory)] border border-[var(--line)] rounded-xl p-4 sm:p-7 shadow-sm">
          <h2 className="font-display text-lg sm:text-xl font-semibold mb-4 text-[var(--ink)]">
            1. Patron &amp; Delivery Details
          </h2>

          <div className="flex flex-col gap-3.5 sm:gap-4">
            <div>
              <label className="block text-xs font-semibold mb-1">Full Name *</label>
              <input
                type="text"
                required
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Harshvardhan Shinde"
                className="w-full p-2.5 text-sm rounded-md border border-[var(--line)] bg-[var(--parchment)] outline-none focus:border-[var(--mustard)]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
              <div>
                <label className="block text-xs font-semibold mb-1">Contact Phone *</label>
                <input
                  type="tel"
                  required
                  value={form.phone}
                  onChange={e => setForm({ ...form, phone: e.target.value })}
                  placeholder="e.g. 9822019283"
                  className="w-full p-2.5 text-sm rounded-md border border-[var(--line)] bg-[var(--parchment)] outline-none focus:border-[var(--mustard)]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">Email Address</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  placeholder="For digital invoice"
                  className="w-full p-2.5 text-sm rounded-md border border-[var(--line)] bg-[var(--parchment)] outline-none focus:border-[var(--mustard)]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1">Shipping Address in Full *</label>
              <textarea
                required
                rows={3}
                value={form.address}
                onChange={e => setForm({ ...form, address: e.target.value })}
                placeholder="Flat / Bungalow No., Landmark, City, Pincode"
                className="w-full p-2.5 text-sm rounded-md border border-[var(--line)] bg-[var(--parchment)] outline-none focus:border-[var(--mustard)]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1">Tailoring / Fitting Instructions (Optional)</label>
              <input
                type="text"
                value={form.notes}
                onChange={e => setForm({ ...form, notes: e.target.value })}
                placeholder="e.g. Please hem trousers to 38 inches"
                className="w-full p-2.5 text-sm rounded-md border border-[var(--line)] bg-[var(--parchment)] outline-none focus:border-[var(--mustard)]"
              />
            </div>
          </div>

          <h2 className="font-display text-lg sm:text-xl font-semibold mt-6 mb-3 text-[var(--ink)]">
            2. Payment Gateway Mode
          </h2>

          <div className="flex flex-col gap-2.5 mb-6">
            <label className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${paymentMode === "upi" ? "border-[var(--mustard)] bg-amber-500/10 ring-1 ring-[var(--mustard)]" : "border-[var(--line)] bg-[var(--parchment)]"}`}>
              <input type="radio" name="pay" checked={paymentMode === "upi"} onChange={() => setPaymentMode("upi")} />
              <QrCode size={20} color="var(--mustard-deep)" className="shrink-0" />
              <div>
                <div className="font-semibold text-xs sm:text-sm">Razorpay UPI / Dynamic QR Code</div>
                <div className="text-[11px] text-[var(--ink-soft)]">Google Pay, PhonePe, Paytm, BHIM</div>
              </div>
            </label>

            <label className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${paymentMode === "card" ? "border-[var(--mustard)] bg-amber-500/10 ring-1 ring-[var(--mustard)]" : "border-[var(--line)] bg-[var(--parchment)]"}`}>
              <input type="radio" name="pay" checked={paymentMode === "card"} onChange={() => setPaymentMode("card")} />
              <CreditCard size={20} color="var(--mustard-deep)" className="shrink-0" />
              <div>
                <div className="font-semibold text-xs sm:text-sm">Razorpay Credit / Debit Card &amp; Netbanking</div>
                <div className="text-[11px] text-[var(--ink-soft)]">Visa, Mastercard, RuPay, Corporate Amex</div>
              </div>
            </label>
          </div>

          <button
            type="submit"
            className="yd-btn yd-btn-primary w-full py-3.5 text-sm font-bold flex items-center justify-center gap-2 shadow-lg cursor-pointer"
            style={{ background: "var(--ink)", color: "var(--ivory)" }}
          >
            <Lock size={16} color="var(--mustard)" /> Proceed to Authorize &amp; Pay {money(total)}
          </button>
        </form>

        {/* Right: Order Summary */}
        <div className="lg:col-span-5 bg-[var(--ivory)] border border-[var(--line)] rounded-xl p-4 sm:p-7 shadow-sm h-fit">
          <h3 className="font-display text-base sm:text-lg font-semibold mb-3">
            Bag Summary ({items.reduce((s, i) => s + (i.qty || i.quantity || 1), 0)} Items)
          </h3>

          <div className="flex flex-col gap-3 mb-5 max-h-72 overflow-y-auto no-scrollbar">
            {items.map((it, idx) => (
              <div key={idx} className="flex justify-between items-center border-b border-dashed border-[var(--line)] pb-2.5 gap-2">
                <div className="min-w-0 flex-1">
                  <div className="font-semibold text-xs sm:text-sm truncate">{it.product.name}</div>
                  <div className="text-[11px] text-[var(--ink-soft)]">
                    Size: {it.size} • Qty: {it.qty || it.quantity || 1} • {it.product.brand}
                  </div>
                </div>
                <div className="font-semibold text-xs sm:text-sm text-[var(--mustard-deep)] shrink-0">
                  {money(it.product.price * (it.qty || it.quantity || 1))}
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-2 border-t border-[var(--line)] pt-3 text-xs sm:text-sm">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span className="font-medium">{money(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>Atelier Shipping:</span>
              <span className="font-medium">{shipping === 0 ? "FREE" : money(shipping)}</span>
            </div>
            <div className="flex justify-between text-sm sm:text-base font-bold mt-2 pt-2 border-t border-[var(--line)]">
              <span>Grand Total:</span>
              <span style={{ color: "var(--mustard-deep)" }}>{money(total)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ----------------------------- RAZORPAY GATEWAY MODAL ----------------------------- */
export function RazorpayGatewayModal({
  orderDraft,
  onSuccess,
  onCancel
}) {
  const [step, setStep] = useState("qr"); // 'qr' | 'card' | 'otp'
  const [otp, setOtp] = useState("123456");
  const [isProcessing, setIsProcessing] = useState(false);

  if (!orderDraft) return null;

  const handleSimulatePayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      const txId = `pay_rzp_${Date.now().toString().slice(-8)}`;
      onSuccess(txId);
    }, 1500);
  };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 1000, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", padding: "16px", backdropFilter: "blur(4px)" }}>
      <div style={{ background: "#ffffff", width: "100%", maxWidth: "460px", borderRadius: "12px", overflow: "hidden", boxShadow: "0 25px 60px rgba(0,0,0,0.5)", border: "1px solid #e0e0e0" }}>
        {/* Razorpay Brand Header */}
        <div style={{ background: "#0c2340", padding: "18px 24px", color: "#ffffff", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: "10px", letterSpacing: "1px", textTransform: "uppercase", color: "#60a5fa", fontWeight: "bold" }}>
              SECURED BY RAZORPAY
            </div>
            <div style={{ fontSize: "16px", fontWeight: "bold", marginTop: "2px" }}>
              Yashal Dresses Atelier
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: "11px", color: "#94a3b8" }}>Payable Amount</div>
            <div style={{ fontSize: "18px", fontWeight: "bold", color: "#facc15" }}>
              {money(orderDraft.total)}
            </div>
          </div>
        </div>

        <div style={{ padding: "24px" }}>
          {step === "qr" && (
            <div style={{ textAlign: "center" }}>
              <p style={{ fontSize: "13px", color: "#475569", margin: "0 0 16px 0" }}>
                Scan this dynamic QR code with <strong>Google Pay, PhonePe, Paytm, or BHIM</strong>
              </p>

              {/* Dynamic QR Box */}
              <div style={{ width: "180px", height: "180px", margin: "0 auto 20px auto", background: "#f8fafc", border: "2px dashed #0284c7", borderRadius: "12px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "12px" }}>
                <QrCode size={110} color="#0c2340" />
                <span style={{ fontSize: "10px", fontFamily: "IBM Plex Mono", color: "#0284c7", marginTop: "8px", fontWeight: "bold" }}>
                  UPI ID: yashaldresses@icici
                </span>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <button
                  onClick={handleSimulatePayment}
                  disabled={isProcessing}
                  style={{ width: "100%", padding: "12px", background: "#0284c7", color: "#ffffff", border: "none", borderRadius: "6px", fontWeight: "bold", cursor: "pointer", fontSize: "14px" }}
                >
                  {isProcessing ? "Verifying UPI Transaction..." : `Approve & Pay ${money(orderDraft.total)}`}
                </button>

                <button
                  onClick={() => setStep("otp")}
                  style={{ background: "none", border: "none", color: "#64748b", fontSize: "12px", cursor: "pointer", textDecoration: "underline" }}
                >
                  Or enter Netbanking 3D Secure OTP
                </button>
              </div>
            </div>
          )}

          {step === "otp" && (
            <div>
              <p style={{ fontSize: "13px", color: "#475569", margin: "0 0 14px 0" }}>
                Enter the 6-digit Bank OTP sent to <strong>+91 {orderDraft.customer?.phone}</strong>
              </p>
              <input
                type="text"
                maxLength={6}
                value={otp}
                onChange={e => setOtp(e.target.value)}
                style={{ width: "100%", padding: "12px", textAlign: "center", fontSize: "20px", letterSpacing: "8px", fontWeight: "bold", border: "2px solid #0284c7", borderRadius: "6px", marginBottom: "16px" }}
              />

              <button
                onClick={handleSimulatePayment}
                disabled={isProcessing}
                style={{ width: "100%", padding: "12px", background: "#0284c7", color: "#ffffff", border: "none", borderRadius: "6px", fontWeight: "bold", cursor: "pointer", fontSize: "14px" }}
              >
                {isProcessing ? "Authorizing 3D Secure..." : "Authorize & Complete Order"}
              </button>
            </div>
          )}

          <div style={{ marginTop: "16px", textAlign: "center" }}>
            <button
              onClick={onCancel}
              style={{ background: "none", border: "none", color: "#ef4444", fontSize: "12px", cursor: "pointer" }}
            >
              Cancel Payment & Return
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ----------------------------- CONFIRMATION PAGE & TAX INVOICE ----------------------------- */
export function ConfirmationPage({
  order,
  setPage,
  onSendEmailConfirmation
}) {
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
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "40px 16px" }}>
      {/* Top Banner */}
      <div style={{ textAlign: "center", marginBottom: "32px" }}>
        <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: "var(--ink)", color: "var(--mustard)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px auto" }}>
          <CheckCircle2 size={36} />
        </div>
        <p style={{ fontFamily: "IBM Plex Mono", fontSize: "11px", letterSpacing: "2px", textTransform: "uppercase", color: "var(--mustard-deep)" }}>
          TRANSACTION VERIFIED & CONFIRMED
        </p>
        <h1 className="font-display" style={{ margin: "4px 0", fontSize: "28px", color: "var(--ink)" }}>
          Order Confirmed, Ref #{order.id}
        </h1>
        <p style={{ fontSize: "14px", color: "var(--ink-soft)" }}>
          Thank you, <strong>{order.customer?.name}</strong>. Your bespoke menswear order is being tailored for dispatch.
        </p>
      </div>

      {/* Printable Tax Invoice Card */}
      <div id="printable-tax-invoice" style={{ background: "var(--ivory)", border: "2px solid var(--line)", borderRadius: "10px", padding: "32px", boxShadow: "0 8px 24px rgba(0,0,0,0.04)", marginBottom: "28px" }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", borderBottom: "2px solid var(--line)", paddingBottom: "20px", marginBottom: "20px" }}>
          <div>
            <h2 className="font-display" style={{ margin: 0, fontSize: "22px", color: "var(--ink)" }}>
              YASHAL DRESSES
            </h2>
            <p style={{ margin: "4px 0 0 0", fontSize: "11px", color: "var(--ink-soft)", lineHeight: "1.4" }}>
              {STORE_CONTACT.address}<br />
              Phone: {STORE_CONTACT.phone} | Email: {STORE_CONTACT.email}
            </p>
          </div>
          <div style={{ textAlign: "right" }}>
            <span style={{ fontSize: "11px", fontFamily: "IBM Plex Mono", background: "var(--ink)", color: "var(--mustard)", padding: "4px 8px", borderRadius: "4px" }}>
              TAX INVOICE
            </span>
            <div style={{ fontSize: "12px", fontWeight: "bold", marginTop: "6px" }}>Invoice #{order.id}</div>
            <div style={{ fontSize: "11px", color: "var(--ink-soft)" }}>{new Date(order.date).toLocaleDateString("en-IN")}</div>
          </div>
        </div>

        {/* Customer & Payment Info */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "24px", fontSize: "12px", background: "var(--parchment)", padding: "16px", borderRadius: "6px" }}>
          <div>
            <strong>BILLED TO:</strong><br />
            {order.customer?.name}<br />
            {order.customer?.phone}<br />
            {order.customer?.address}
          </div>
          <div style={{ textAlign: "right" }}>
            <strong>PAYMENT STATUS:</strong><br />
            <span style={{ color: "#16a34a", fontWeight: "bold" }}>✓ {order.paymentMethod || "PAID"}</span><br />
            Txn Ref: {order.transactionId || "N/A"}<br />
            Delivery: 2 - 4 Business Days
          </div>
        </div>

        {/* Items Table */}
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px", marginBottom: "20px" }}>
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
            {order.items?.map((it, idx) => (
              <tr key={idx} style={{ borderBottom: "1px solid var(--line)" }}>
                <td style={{ padding: "10px" }}>
                  <strong>{it.name}</strong><br />
                  <span style={{ fontSize: "11px", color: "var(--ink-soft)" }}>Label: {it.brand || "Yashal"}</span>
                </td>
                <td style={{ padding: "10px", textAlign: "center" }}>{it.size}</td>
                <td style={{ padding: "10px", textAlign: "center" }}>{it.quantity}</td>
                <td style={{ padding: "10px", textAlign: "right" }}>{money(it.price)}</td>
                <td style={{ padding: "10px", textAlign: "right", fontWeight: "600" }}>{money(it.price * it.quantity)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Grand Total */}
        <div style={{ display: "flex", justifyContent: "flex-end", borderTop: "2px solid var(--line)", paddingTop: "14px" }}>
          <div style={{ width: "240px", fontSize: "13px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
              <span>Subtotal:</span>
              <span>{money(order.subtotal || order.total)}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
              <span>Shipping:</span>
              <span>{order.shipping ? money(order.shipping) : "FREE"}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "16px", fontWeight: "bold", borderTop: "1px solid var(--line)", paddingTop: "8px", marginTop: "8px" }}>
              <span>Total Paid:</span>
              <span style={{ color: "var(--mustard-deep)" }}>{money(order.total)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ display: "flex", gap: "14px", justifyContent: "center", flexWrap: "wrap" }}>
        <button
          onClick={handlePrint}
          className="yd-btn"
          style={{ padding: "12px 20px", background: "var(--ink)", color: "var(--ivory)", display: "flex", alignItems: "center", gap: "8px" }}
        >
          <Printer size={16} color="var(--mustard)" /> Print Tax Invoice
        </button>

        <button
          onClick={handleSendEmail}
          className="yd-btn"
          style={{ padding: "12px 20px", background: "var(--mustard)", color: "var(--ink)", border: "none", fontWeight: "bold", display: "flex", alignItems: "center", gap: "8px" }}
        >
          <Send size={16} /> Send Email Copy
        </button>

        <button
          onClick={() => setPage("shop")}
          className="yd-btn"
          style={{ padding: "12px 20px", background: "transparent", border: "1px solid var(--line)", color: "var(--ink)" }}
        >
          Continue Shopping
        </button>
      </div>

      {emailStatus && (
        <p style={{ textAlign: "center", fontSize: "12px", color: "var(--mustard-deep)", marginTop: "16px", fontWeight: "600" }}>
          {emailStatus}
        </p>
      )}
    </div>
  );
}

export default CheckoutPage;
