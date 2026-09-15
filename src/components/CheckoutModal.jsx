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
          onClick={() => setPage("shop")}
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
