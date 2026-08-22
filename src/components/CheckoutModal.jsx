import React, { useState } from "react";
import {
  ShieldCheck, CreditCard, QrCode, Building2, Lock, CheckCircle2,
  AlertCircle, Download, FileText, ArrowLeft, RefreshCw, Smartphone, Send
} from "lucide-react";
import { AnimatedSwingTag } from "./BrandDecorations";
import { generateOrderMailtoUrl } from "../utils/emailSync.js";

const money = (n) => `₹${n.toLocaleString("en-IN")}`;

export default function CheckoutPage({ cart, products, setPage, placeOrder, user }) {
  const items = cart
    .map((c) => ({ ...c, product: products.find((p) => p.id === c.id) }))
    .filter((i) => Boolean(i.product));

  const subtotal = items.reduce((s, i) => s + i.product.price * i.qty, 0);
  const shipping = subtotal >= 999 || subtotal === 0 ? 0 : 79;
  const tax = Math.round(subtotal * 0.05); // 5% GST calculation
  const total = subtotal + shipping;

  const [form, setForm] = useState({
    name: user?.name || "",
    phone: "",
    email: user?.email || "",
    line1: "",
    city: "Pune",
    state: "Maharashtra",
    pincode: "411001"
  });

  const [paymentMethod, setPaymentMethod] = useState("upi");
  const [upiId, setUpiId] = useState("");
  const [cardInfo, setCardInfo] = useState({ number: "", expiry: "", cvv: "", name: "" });
  const [selectedBank, setSelectedBank] = useState("HDFC Bank");

  // Payment states
  const [isProcessing, setIsProcessing] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState("123456");
  const [otpTimer, setOtpTimer] = useState(30);

  const setFormKey = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  const formValid = form.name && form.phone && form.line1 && form.city && form.pincode;

  const handleStartPayment = (e) => {
    e.preventDefault();
    if (!formValid || items.length === 0) return;

    // Trigger Razorpay OTP Verification Modal
    setShowOtpModal(true);
  };

  const handleVerifyOtpAndPay = () => {
    if (!otp || otp.length < 4) return;
    setShowOtpModal(false);
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      const txId = `PAY_RZP_${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
      placeOrder(items, total, form, `Razorpay (${paymentMethod.toUpperCase()})`, txId);
    }, 1600);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl md:text-3xl font-semibold flex items-center gap-2">
          <Lock size={22} className="yd-mustard" /> Checkout
        </h1>
        <button onClick={() => setPage("shop")} className="font-mono text-xs opacity-70 hover:opacity-100 flex items-center gap-1">
          <ArrowLeft size={14} /> Continue Shopping
        </button>
      </div>

      <div className="grid md:grid-cols-[1fr_360px] gap-10">
        
        {/* Left Column: Delivery details & Razorpay Payment Modes */}
        <div className="space-y-6">
          
          {/* Delivery Address */}
          <div className="tag-card p-5">
            <p className="font-mono text-[11px] tracking-widest opacity-60 mb-3 flex items-center gap-2">
              1 · DELIVERY ADDRESS
            </p>
            <div className="grid sm:grid-cols-2 gap-3">
              <input
                value={form.name}
                onChange={setFormKey("name")}
                placeholder="Full name *"
                className="border border-[var(--line)] rounded px-3 py-2.5 text-sm bg-white sm:col-span-2 outline-none focus:border-[var(--mustard)]"
              />
              <input
                value={form.phone}
                onChange={setFormKey("phone")}
                placeholder="10-digit Phone Number *"
                className="border border-[var(--line)] rounded px-3 py-2.5 text-sm bg-white outline-none focus:border-[var(--mustard)]"
              />
              <input
                value={form.email}
                onChange={setFormKey("email")}
                placeholder="Email Address"
                className="border border-[var(--line)] rounded px-3 py-2.5 text-sm bg-white outline-none focus:border-[var(--mustard)]"
              />
              <input
                value={form.line1}
                onChange={setFormKey("line1")}
                placeholder="Flat, House no., Street address *"
                className="border border-[var(--line)] rounded px-3 py-2.5 text-sm bg-white sm:col-span-2 outline-none focus:border-[var(--mustard)]"
              />
              <input
                value={form.city}
                onChange={setFormKey("city")}
                placeholder="City *"
                className="border border-[var(--line)] rounded px-3 py-2.5 text-sm bg-white outline-none focus:border-[var(--mustard)]"
              />
              <input
                value={form.state}
                onChange={setFormKey("state")}
                placeholder="State *"
                className="border border-[var(--line)] rounded px-3 py-2.5 text-sm bg-white outline-none focus:border-[var(--mustard)]"
              />
              <input
                value={form.pincode}
                onChange={setFormKey("pincode")}
                placeholder="Pincode *"
                className="border border-[var(--line)] rounded px-3 py-2.5 text-sm bg-white sm:col-span-2 outline-none focus:border-[var(--mustard)]"
              />
            </div>
          </div>

          {/* Payment Gateway Box (Razorpay Simulator) */}
          <div className="tag-card p-5 border-2 border-[var(--ink)] shadow-md">
            <div className="flex items-center justify-between mb-4 border-b border-[var(--line)] pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck size={20} className="text-emerald-700" />
                <p className="font-mono text-xs tracking-widest font-semibold">2 · RAZORPAY SECURE PAYMENT</p>
              </div>
              <span className="text-[10px] font-mono bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-bold">256-BIT ENCRYPTED</span>
            </div>

            {/* Payment Method Selector Tabs */}
            <div className="grid grid-cols-3 gap-2 mb-4">
              {[
                { id: "upi", label: "UPI / QR", icon: QrCode },
                { id: "card", label: "Card", icon: CreditCard },
                { id: "netbanking", label: "NetBank", icon: Building2 },
              ].map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setPaymentMethod(m.id)}
                  className={`flex flex-col items-center justify-center p-2.5 rounded border text-xs font-mono transition-all ${
                    paymentMethod === m.id
                      ? "bg-[var(--ink)] text-[var(--mustard)] border-[var(--mustard)] shadow"
                      : "bg-white text-gray-700 border-gray-200 hover:border-[var(--mustard)]"
                  }`}
                >
                  <m.icon size={16} className="mb-1" />
                  <span className="text-[11px] font-semibold">{m.label}</span>
                </button>
              ))}
            </div>

            {/* UPI Option */}
            {paymentMethod === "upi" && (
              <div className="bg-white p-4 rounded border border-gray-200 space-y-4">
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <div className="bg-gray-100 p-2 rounded border border-gray-300 flex flex-col items-center">
                    {/* SVG QR Code Simulation */}
                    <svg width="100" height="100" viewBox="0 0 100 100" className="bg-white p-1">
                      <rect width="100" height="100" fill="white" />
                      <rect x="10" y="10" width="30" height="30" fill="#1A1224" />
                      <rect x="15" y="15" width="20" height="20" fill="white" />
                      <rect x="20" y="20" width="10" height="10" fill="#1A1224" />
                      <rect x="60" y="10" width="30" height="30" fill="#1A1224" />
                      <rect x="65" y="15" width="20" height="20" fill="white" />
                      <rect x="70" y="20" width="10" height="10" fill="#1A1224" />
                      <rect x="10" y="60" width="30" height="30" fill="#1A1224" />
                      <rect x="15" y="65" width="20" height="20" fill="white" />
                      <rect x="20" y="70" width="10" height="10" fill="#1A1224" />
                      <rect x="50" y="50" width="10" height="10" fill="#D4AF37" />
                      <rect x="60" y="60" width="15" height="15" fill="#1A1224" />
                      <rect x="80" y="80" width="10" height="10" fill="#1A1224" />
                    </svg>
                    <span className="text-[10px] font-mono text-gray-600 mt-1">Scan with GPay / PhonePe / Paytm</span>
                  </div>
                  <div className="flex-1 w-full">
                    <label className="text-xs font-semibold block mb-1">Or enter UPI ID / VPA:</label>
                    <div className="flex gap-2">
                      <input
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        placeholder="e.g. name@upi or 9876543210@paytm"
                        className="border rounded px-3 py-2 text-xs w-full outline-none focus:border-[var(--ink)]"
                      />
                    </div>
                    <p className="text-[11px] text-gray-500 mt-2">Instant payment approval request will be sent to your UPI app.</p>
                  </div>
                </div>
              </div>
            )}

            {/* Card Option */}
            {paymentMethod === "card" && (
              <div className="bg-white p-4 rounded border border-gray-200 space-y-3">
                <div>
                  <label className="text-xs font-semibold block mb-1">Card Number</label>
                  <input
                    value={cardInfo.number}
                    onChange={(e) => setCardInfo({ ...cardInfo, number: e.target.value })}
                    placeholder="4532 •••• •••• 8892"
                    maxLength={19}
                    className="border rounded px-3 py-2 text-xs w-full outline-none font-mono"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold block mb-1">Expiry Date</label>
                    <input
                      value={cardInfo.expiry}
                      onChange={(e) => setCardInfo({ ...cardInfo, expiry: e.target.value })}
                      placeholder="MM / YY"
                      maxLength={5}
                      className="border rounded px-3 py-2 text-xs w-full outline-none font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold block mb-1">CVV / CVC</label>
                    <input
                      type="password"
                      value={cardInfo.cvv}
                      onChange={(e) => setCardInfo({ ...cardInfo, cvv: e.target.value })}
                      placeholder="•••"
                      maxLength={4}
                      className="border rounded px-3 py-2 text-xs w-full outline-none font-mono"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold block mb-1">Cardholder Name</label>
                  <input
                    value={cardInfo.name}
                    onChange={(e) => setCardInfo({ ...cardInfo, name: e.target.value })}
                    placeholder="Name on card"
                    className="border rounded px-3 py-2 text-xs w-full outline-none"
                  />
                </div>
              </div>
            )}

            {/* Netbanking Option */}
            {paymentMethod === "netbanking" && (
              <div className="bg-white p-4 rounded border border-gray-200 space-y-3">
                <label className="text-xs font-semibold block mb-1">Select Bank:</label>
                <select
                  value={selectedBank}
                  onChange={(e) => setSelectedBank(e.target.value)}
                  className="yd-select text-xs"
                >
                  <option value="HDFC Bank">HDFC Bank</option>
                  <option value="State Bank of India">State Bank of India (SBI)</option>
                  <option value="ICICI Bank">ICICI Bank</option>
                  <option value="Axis Bank">Axis Bank</option>
                  <option value="Kotak Mahindra Bank">Kotak Mahindra Bank</option>
                  <option value="Punjab National Bank">Punjab National Bank</option>
                </select>
              </div>
            )}

          </div>
        </div>

        {/* Right Column: Order Summary & Checkout Trigger */}
        <div className="tag-card p-5 h-fit bg-white">
          <p className="font-mono text-[11px] tracking-widest opacity-60 mb-3 font-semibold">ORDER SUMMARY</p>
          
          <div className="space-y-2 max-h-56 overflow-y-auto mb-3 pr-1 yd-scroll">
            {items.map((i) => (
              <div key={i.id + i.size} className="flex justify-between text-xs py-1.5 border-b border-gray-100">
                <div className="truncate pr-2">
                  <span className="font-medium text-gray-900">{i.product.name}</span>
                  <span className="block text-[10px] text-gray-500 font-mono">Size {i.size} × {i.qty}</span>
                </div>
                <span className="font-semibold">{money(i.product.price * i.qty)}</span>
              </div>
            ))}
          </div>

          <div className="divider pt-3 space-y-1.5 text-xs">
            <div className="flex justify-between text-gray-600"><span>Bag Total</span><span>{money(subtotal)}</span></div>
            <div className="flex justify-between text-gray-600"><span>Estimated GST (5%)</span><span>{money(tax)}</span></div>
            <div className="flex justify-between text-gray-600"><span>Delivery Fee</span><span>{shipping === 0 ? "FREE" : money(shipping)}</span></div>
            <div className="flex justify-between font-bold text-base pt-2 text-[var(--ink)] border-t border-[var(--line)]">
              <span>Amount Payable</span>
              <span className="text-[var(--mustard-deep)]">{money(total)}</span>
            </div>
          </div>

          <button
            disabled={!formValid || items.length === 0}
            onClick={handleStartPayment}
            className="yd-btn yd-btn-primary w-full py-4 mt-5 disabled:opacity-40 text-sm font-bold shadow-lg flex items-center justify-center gap-2"
          >
            <Lock size={15} />
            Pay {money(total)} Now
          </button>
          
          {!formValid && (
            <p className="text-[11px] text-red-600 font-medium text-center mt-2">
              Please fill all required delivery details (*).
            </p>
          )}

          <div className="mt-4 flex items-center justify-center gap-2 opacity-60 text-[10px] font-mono">
            <ShieldCheck size={14} /> Razorpay Verified Merchant
          </div>
        </div>
      </div>

      {/* 3D-Secure Bank OTP Modal */}
      {showOtpModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-lg max-w-sm w-full p-6 shadow-2xl border border-gray-300 relative">
            <div className="flex items-center justify-between border-b pb-3 mb-4">
              <div className="flex items-center gap-2">
                <ShieldCheck size={20} className="text-blue-600" />
                <span className="font-bold text-sm">3D-Secure Bank Authorization</span>
              </div>
              <span className="text-[10px] font-mono bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">RAZORPAY</span>
            </div>

            <p className="text-xs text-gray-600 mb-4">
              A 6-digit OTP has been sent to your registered mobile number for authorizing payment of <strong className="text-black">{money(total)}</strong>.
            </p>

            <div className="space-y-3">
              <div>
                <label className="text-[11px] font-mono uppercase text-gray-500 block mb-1">Enter OTP (Test OTP: 123456)</label>
                <input
                  type="text"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full border-2 border-blue-500 rounded px-3 py-2 text-center font-mono text-lg font-bold tracking-widest outline-none"
                />
              </div>

              <div className="flex items-center justify-between text-xs text-gray-500 font-mono">
                <span>Resend OTP in 0:{otpTimer < 10 ? `0${otpTimer}` : otpTimer}</span>
                <button
                  type="button"
                  onClick={() => setOtpTimer(30)}
                  className="text-blue-600 hover:underline flex items-center gap-1"
                >
                  <RefreshCw size={12} /> Resend
                </button>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowOtpModal(false)}
                  className="yd-btn yd-btn-outline flex-1 py-2.5 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleVerifyOtpAndPay}
                  className="yd-btn yd-btn-primary flex-1 py-2.5 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Authorize Payment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Processing Loader Overlay */}
      {isProcessing && (
        <div className="fixed inset-0 z-[110] bg-black/75 backdrop-blur-sm flex flex-col items-center justify-center text-white p-4">
          <div className="w-16 h-16 border-4 border-[var(--mustard)] border-t-transparent rounded-full animate-spin mb-4" />
          <h3 className="font-display text-xl font-semibold">Processing Razorpay Payment…</h3>
          <p className="text-xs font-mono opacity-70 mt-1">Verifying bank authorization &amp; allocating inventory.</p>
        </div>
      )}
    </div>
  );
}

/* ------------------------------ ORDER CONFIRMATION & TAX INVOICE ---------------------------- */
export function ConfirmationPage({ order, setPage }) {
  const [showInvoice, setShowInvoice] = useState(false);
  if (!order) return null;

  const cloudConfig = loadCloudConfig();
  const waUrl = generateWhatsAppOrderUrl(order, cloudConfig?.whatsappNumber);

  return (
    <div className="max-w-xl mx-auto px-4 py-16 text-center">
      <AnimatedSwingTag size={72} />
      <h1 className="font-display text-3xl mb-2 mt-4 font-semibold">Order Confirmed!</h1>
      <p className="opacity-70 text-sm mb-6">
        Thank you for shopping with Yashal Dresses. Order <span className="font-mono font-bold text-black">{order.id}</span> has been tagged and dispatched.
      </p>

      <div className="tag-card p-5 text-left mb-4 bg-white">
        <div className="flex justify-between text-xs mb-1.5 border-b pb-2">
          <span className="opacity-60 font-mono">Transaction Ref</span>
          <span className="font-mono font-semibold text-emerald-700">{order.transactionId || order.id}</span>
        </div>
        <div className="flex justify-between text-xs mb-1">
          <span className="opacity-60">Payment Mode</span>
          <span className="font-medium">{order.paymentMethod}</span>
        </div>
        <div className="flex justify-between text-xs mb-1">
          <span className="opacity-60">Customer</span>
          <span className="font-medium">{order.address?.name} (📞 {order.address?.phone})</span>
        </div>
        <div className="flex justify-between text-xs mb-1">
          <span className="opacity-60">Total Paid</span>
          <span className="font-semibold text-sm text-[var(--mustard-deep)]">{money(order.total)}</span>
        </div>
        <div className="flex justify-between text-xs pt-1 border-t">
          <span className="opacity-60">Delivery Address</span>
          <span className="text-right">{order.address?.line1}, {order.address?.city} - {order.address?.pincode}</span>
        </div>
      </div>

      {/* Direct WhatsApp Alert Action */}
      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="yd-btn flex items-center justify-center gap-2 w-full py-4 text-xs font-bold shadow-lg transition-all transform hover:scale-[1.01] active:scale-98 mb-3"
        style={{ background: "#25D366", color: "#FFFFFF", borderRadius: "8px" }}
      >
        <Send size={15} />
        <span>Send Order Details to Store via WhatsApp →</span>
      </a>

      {/* Automated Email Confirmation Banner */}
      <div className="bg-emerald-50 border border-emerald-300 rounded-lg p-3.5 text-left space-y-1.5 shadow-sm max-w-lg mx-auto mb-6">
        <div className="flex items-center gap-1.5 text-emerald-900 font-bold text-xs">
          <span>✉️</span>
          <span>Automated Order Confirmation Email</span>
        </div>
        <p className="text-[11px] text-emerald-800 leading-snug">
          An order confirmation mail with subject <b className="font-mono text-purple-900">"Order Confirmed!"</b> has been routed from <b>dressesyashal@gmail.com</b> to <b>yashaldressespune@gmail.com</b>.
        </p>
        <div className="pt-1">
          <a
            href={generateOrderMailtoUrl(order)}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] font-mono font-bold text-emerald-900 hover:text-black underline inline-flex items-center gap-1"
          >
            <span>✉️ View / Send Order Email in Mail App →</span>
          </a>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 justify-center">
        <button
          onClick={() => setShowInvoice(true)}
          className="yd-btn border border-[var(--ink)] bg-white px-5 py-3 text-xs flex items-center gap-2 shadow hover:bg-gray-50"
        >
          <FileText size={15} /> Print Tax Invoice
        </button>
        <button onClick={() => setPage("orders")} className="yd-btn yd-btn-primary px-6 py-3 text-xs">
          Track Order Status
        </button>
        <button onClick={() => setPage("shop")} className="yd-btn yd-btn-outline px-6 py-3 text-xs">
          Continue Shopping
        </button>
      </div>

      {/* Tax Invoice Modal */}
      {showInvoice && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white text-gray-900 rounded-lg max-w-2xl w-full p-8 shadow-2xl relative border-4 border-double border-[var(--ink)] text-left">
            <button
              onClick={() => setShowInvoice(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-black font-bold"
            >
              ✕ Close
            </button>

            {/* Invoice Header */}
            <div className="flex justify-between items-start border-b-2 border-gray-800 pb-4 mb-6">
              <div>
                <h2 className="font-display text-2xl font-bold tracking-tight text-gray-900">YASHAL DRESSES</h2>
                <p className="text-xs font-mono text-gray-600">Official Tax Invoice &amp; Goods Receipt</p>
                <p className="text-xs text-gray-500">EST. Workroom № 12, Pune, Maharashtra</p>
                <p className="text-xs text-gray-500">GSTIN: 27AABCY1234F1Z9</p>
              </div>
              <div className="text-right">
                <span className="font-mono text-xs font-bold text-gray-700 bg-gray-100 px-3 py-1 rounded inline-block">
                  TAX INVOICE
                </span>
                <p className="text-xs font-mono mt-2">Invoice #: {order.id}</p>
                <p className="text-xs text-gray-500">Date: {order.date}</p>
              </div>
            </div>

            {/* Address */}
            <div className="grid grid-cols-2 gap-4 text-xs mb-6 bg-gray-50 p-3 rounded border">
              <div>
                <p className="font-bold text-gray-700 uppercase">Billed To:</p>
                <p className="font-medium text-gray-900">{order.address?.name}</p>
                <p>{order.address?.line1}</p>
                <p>{order.address?.city}, {order.address?.state} - {order.address?.pincode}</p>
                <p>Phone: {order.address?.phone}</p>
              </div>
              <div>
                <p className="font-bold text-gray-700 uppercase">Payment Details:</p>
                <p>Method: {order.paymentMethod}</p>
                <p className="font-mono">Ref: {order.transactionId || order.id}</p>
                <p className="text-emerald-700 font-semibold mt-1">Status: Paid &amp; Verified ✓</p>
              </div>
            </div>

            {/* Line Items Table */}
            <table className="w-full text-xs text-left border-collapse mb-6">
              <thead>
                <tr className="border-b-2 border-gray-800 bg-gray-100 font-mono">
                  <th className="py-2 px-2">Item Description</th>
                  <th className="py-2 px-2">Size</th>
                  <th className="py-2 px-2 text-center">Qty</th>
                  <th className="py-2 px-2 text-right">Price</th>
                  <th className="py-2 px-2 text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((i, idx) => (
                  <tr key={idx} className="border-b border-gray-200">
                    <td className="py-2.5 px-2 font-medium">{i.name || `Garment Item (${i.id})`}</td>
                    <td className="py-2.5 px-2 font-mono">{i.size}</td>
                    <td className="py-2.5 px-2 text-center">{i.qty}</td>
                    <td className="py-2.5 px-2 text-right">{money(i.price || 0)}</td>
                    <td className="py-2.5 px-2 text-right font-semibold">{money((i.price || 0) * i.qty)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Totals */}
            <div className="flex justify-end text-xs mb-6">
              <div className="w-64 space-y-1">
                <div className="flex justify-between"><span>Subtotal:</span><span>{money(Math.round(order.total * 0.95))}</span></div>
                <div className="flex justify-between"><span>CGST (2.5%):</span><span>{money(Math.round(order.total * 0.025))}</span></div>
                <div className="flex justify-between"><span>SGST (2.5%):</span><span>{money(Math.round(order.total * 0.025))}</span></div>
                <div className="flex justify-between font-bold text-sm border-t-2 border-gray-900 pt-2">
                  <span>Grand Total:</span>
                  <span>{money(order.total)}</span>
                </div>
              </div>
            </div>

            {/* Print Action */}
            <div className="flex justify-between items-center border-t pt-4">
              <p className="text-[10px] text-gray-500">This is a computer-generated invoice and requires no signature.</p>
              <button
                onClick={() => window.print()}
                className="yd-btn yd-btn-primary px-4 py-2 text-xs flex items-center gap-1"
              >
                <Download size={14} /> Print / Save PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
