import React, { useState } from "react";
import { Phone, Mail, MapPin, Send, Copy, Check, Clock, ExternalLink, X } from "lucide-react";

export const STORE_CONTACT = {
  name: "Yashal Dresses",
  phone: "9673533839",
  displayPhone: "+91 96735 33839",
  email: "yashaldressespune@gmail.com",
  address: {
    storeName: "Yashal Dresses",
    line1: "Sector 25, Plot 601",
    area: "Nigdi, Pradhikaran",
    landmark: "Opposite MSEB OFFICE",
    city: "PUNE",
    pincode: "411044"
  },
  fullAddress: "Yashal Dresses, Sector 25, Plot 601, Nigdi, Pradhikaran, Opposite MSEB OFFICE, PUNE: 411044",
  googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent("Yashal Dresses Sector 25 Plot 601 Nigdi Pradhikaran Opposite MSEB Office Pune 411044"),
  getWhatsAppInquiryUrl: (productName = "", brandName = "") => {
    let msg = `🛍️ *STORE INQUIRY — YASHAL DRESSES*\n`;
    msg += `Hello! I would like to inquire about apparel availability and visiting your store at Nigdi, Pradhikaran.`;
    if (productName) {
      msg += `\n\n📌 *Garment:* ${productName}`;
      if (brandName) msg += `\n🏷️ *Brand:* ${brandName}`;
    }
    return `https://wa.me/919673533839?text=${encodeURIComponent(msg)}`;
  }
};

export default function InquiryModal({ open, close, initialProduct = null }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState(
    initialProduct
      ? `Hi, I am inquiring about "${initialProduct.name}" (${initialProduct.brand || 'Yashal Workroom'}, ₹${initialProduct.price}). Is it available in store?`
      : "Hi, I would like to inquire about garment sizes and collection availability."
  );
  const [copied, setCopied] = useState(false);

  if (!open) return null;

  const handleSendWhatsApp = (e) => {
    e.preventDefault();
    let customMsg = `🛍️ *CUSTOMER INQUIRY — YASHAL DRESSES*\n━━━━━━━━━━━━━━━━━━━━\n`;
    if (name) customMsg += `👤 *Name:* ${name}\n`;
    if (phone) customMsg += `📞 *Phone:* ${phone}\n`;
    if (initialProduct) {
      customMsg += `👔 *Item:* ${initialProduct.name} (${initialProduct.brand || 'Yashal'}, ₹${initialProduct.price})\n`;
    }
    customMsg += `💬 *Message:* ${message}\n━━━━━━━━━━━━━━━━━━━━\n_Sent via Yashal Dresses Storefront_`;

    const url = `https://wa.me/919673533839?text=${encodeURIComponent(customMsg)}`;
    window.open(url, "_blank");
  };

  const copyAddress = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(STORE_CONTACT.fullAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-[160] flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-amber-200 relative my-6 text-left animate-in fade-in zoom-in-95 duration-150">

        {/* Header */}
        <div className="yd-ink-bg p-5 text-white flex items-center justify-between border-b border-[var(--mustard)]/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[var(--mustard)] text-[var(--ink)] flex items-center justify-center font-bold text-lg shadow">
              <Phone size={18} />
            </div>
            <div>
              <h3 className="font-display text-lg font-bold text-white">Yashal Dresses Workroom</h3>
              <p className="text-[11px] font-mono text-[var(--mustard)]">Official Store Inquiry &amp; Helpline</p>
            </div>
          </div>
          <button
            onClick={close}
            className="text-white/70 hover:text-white font-mono text-base font-bold bg-white/10 hover:bg-white/20 w-8 h-8 rounded-full flex items-center justify-center transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        <div className="p-5 space-y-5 max-h-[80vh] overflow-y-auto yd-scroll">

          {/* Instant One-Tap Direct Action Cards */}
          <div className="grid sm:grid-cols-2 gap-3">
            {/* Direct Phone Call */}
            <a
              href={`tel:+91${STORE_CONTACT.phone}`}
              className="flex items-center gap-3 p-3.5 rounded-xl border border-emerald-200 bg-emerald-50/70 hover:bg-emerald-100/80 transition-all text-emerald-950 group"
            >
              <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center text-lg shrink-0 shadow">
                <Phone size={18} />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-700 block">Call Helpline</span>
                <span className="font-mono font-bold text-sm text-emerald-950 block">{STORE_CONTACT.displayPhone}</span>
                <span className="text-[10px] text-emerald-800">Tap to Call Directly</span>
              </div>
            </a>

            {/* WhatsApp Chat */}
            <a
              href={STORE_CONTACT.getWhatsAppInquiryUrl(initialProduct?.name, initialProduct?.brand)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-3.5 rounded-xl border border-green-300 bg-green-50/70 hover:bg-green-100/80 transition-all text-green-950 group"
            >
              <div className="w-10 h-10 rounded-full bg-[#25D366] text-white flex items-center justify-center text-lg shrink-0 shadow">
                <Send size={18} />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-green-700 block">WhatsApp Chat</span>
                <span className="font-mono font-bold text-sm text-green-950 block">{STORE_CONTACT.phone}</span>
                <span className="text-[10px] text-green-800">Instant Chat &amp; Sizing</span>
              </div>
            </a>
          </div>

          {/* Email Card */}
          <a
            href={`mailto:${STORE_CONTACT.email}`}
            className="flex items-center gap-3 p-3 rounded-xl border border-blue-200 bg-blue-50/60 hover:bg-blue-100/80 transition-all text-blue-950"
          >
            <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm shrink-0 shadow">
              <Mail size={16} />
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-blue-700 block">Official Store Email</span>
              <span className="font-mono text-xs font-bold text-blue-950 truncate block">{STORE_CONTACT.email}</span>
            </div>
            <span className="text-[11px] font-mono font-bold text-blue-700 shrink-0">Send Email →</span>
          </a>

          {/* Store Address & Visit Details */}
          <div className="bg-amber-50/70 border border-amber-200/90 rounded-xl p-4 space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-start gap-2.5">
                <MapPin className="text-[var(--mustard-deep)] shrink-0 mt-0.5" size={20} />
                <div>
                  <h4 className="font-bold text-sm text-gray-900">{STORE_CONTACT.address.storeName}</h4>
                  <p className="text-xs text-gray-700 font-medium">{STORE_CONTACT.address.line1}</p>
                  <p className="text-xs text-gray-700 font-medium">{STORE_CONTACT.address.area}</p>
                  <p className="text-xs text-gray-900 font-bold mt-0.5">Landmark: {STORE_CONTACT.address.landmark}</p>
                  <p className="text-xs font-mono font-bold text-gray-900 mt-0.5">{STORE_CONTACT.address.city}: {STORE_CONTACT.address.pincode}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={copyAddress}
                className="font-mono text-[10px] bg-white border border-gray-300 hover:border-black px-2.5 py-1 rounded font-bold shadow-sm shrink-0 flex items-center gap-1"
                title="Copy full address"
              >
                {copied ? <Check size={12} className="text-emerald-700" /> : <Copy size={12} />}
                <span>{copied ? "Copied" : "Copy"}</span>
              </button>
            </div>

            <div className="pt-2 border-t border-amber-200/70 flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="text-[11px] text-gray-600 font-mono flex items-center gap-1.5">
                <Clock size={13} />
                <span><b>Timings:</b> 10:00 AM – 9:30 PM (All 7 Days)</span>
              </div>
              <a
                href={STORE_CONTACT.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="yd-btn border border-[var(--ink)] bg-white px-3 py-1.5 text-[11px] font-bold text-[var(--ink)] hover:bg-[var(--mustard)] hover:text-black flex items-center gap-1 shadow-sm rounded-lg"
              >
                <ExternalLink size={12} />
                <span>Open in Google Maps →</span>
              </a>
            </div>
          </div>

          {/* Quick Inquiry Form */}
          <form onSubmit={handleSendWhatsApp} className="border-t pt-4 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-gray-800 font-mono uppercase tracking-wider">
                Send Direct Message on WhatsApp
              </label>
              <span className="text-[10px] text-emerald-700 font-mono font-bold">⚡ Fast Reply</span>
            </div>

            {initialProduct && (
              <div className="p-2.5 bg-gray-50 border rounded-lg flex items-center gap-2 text-xs font-mono">
                <span>👔 Regarding:</span>
                <strong className="text-gray-900 truncate">{initialProduct.name} ({initialProduct.brand || 'Yashal'})</strong>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your Name (Optional)"
                className="border rounded-lg px-3 py-2.5 text-xs outline-none focus:border-black bg-white"
              />
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Your Phone Number"
                className="border rounded-lg px-3 py-2.5 text-xs font-mono outline-none focus:border-black bg-white"
              />
            </div>

            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={2}
              placeholder="Type your question or size requirement..."
              className="w-full border rounded-lg p-2.5 text-xs outline-none focus:border-black resize-none"
              required
            />

            <button
              type="submit"
              className="yd-btn w-full py-3 text-xs font-bold shadow-md flex items-center justify-center gap-2 rounded-lg"
              style={{ background: "#25D366", color: "#FFFFFF" }}
            >
              <Send size={15} />
              <span>Send Inquiry on WhatsApp (9673533839) →</span>
            </button>
          </form>

        </div>
      </div>
    </div>
  );
}
