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
    .map((c) => ({ ...c, product: products.find((p) => p.id === c.id) }))
    .filter((i) => Boolean(i.product));

  const subtotal = items.reduce((s, i) => s + i.product.price * i.quantity, 0);
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
        quantity: it.quantity,
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
          onClick={() => setPage("shop")}
          style={{ display: "flex", alignItems: "center", gap: "6px", background: "none", border: "none", color: "var(--ink)", fontFamily: "IBM Plex Mono", fontSize: "12px", cursor: "pointer" }}
        >
          ← Return to Atelier Shop
        </button>
        <span style={{ fontSize: "11px", fontFamily: "IBM Plex Mono", color: "var(--mustard-deep)", letterSpacing: "1px" }}>
          BESPOKE CHECKOUT & SECURE DISPATCH
        </span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "32px" }}>
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

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
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
        <div style={{ background: "var(--ivory)", border: "1px solid var(--line)", borderRadius: "10px", padding: "28px", height: "fit-content" }}>
          <h3 className="font-display" style={{ margin: "0 0 16px 0", fontSize: "18px" }}>
            Bag Summary ({items.reduce((s, i) => s + i.quantity, 0)} Items)
          </h3>

          <div style={{ display: "flex", flexDirection: "column", gap: "14px", marginBottom: "20px", maxHeight: "320px", overflowY: "auto" }}>
            {items.map((it, idx) => (
              <div key={idx} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px dashed var(--line)", paddingBottom: "10px" }}>
                <div>
                  <div style={{ fontWeight: "600", fontSize: "13px" }}>{it.product.name}</div>
                  <div style={{ fontSize: "11px", color: "var(--ink-soft)" }}>
                    Size: {it.size} • Qty: {it.quantity} • {it.product.brand}
                  </div>
                </div>
                <div style={{ fontWeight: "600", fontSize: "13px", color: "var(--mustard-deep)" }}>
                  {money(it.product.price * it.quantity)}
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
