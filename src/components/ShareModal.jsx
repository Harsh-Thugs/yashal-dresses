import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, Copy, Check, Share2, MessageCircle, ExternalLink } from "lucide-react";
import { copyToClipboard, getProductShareUrl, getWhatsAppShareUrl } from "../utils/share";

const money = (n) => `₹${Number(n || 0).toLocaleString("en-IN")}`;

export default function ShareModal({ open, close, product }) {
  const [copied, setCopied] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) {
      setCopied(false);
    }
  }, [open]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && open) {
        close();
      }
    };
    if (open) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, close]);

  if (!mounted || !open || !product) return null;

  const shareUrl = getProductShareUrl(product.id);
  const whatsappUrl = getWhatsAppShareUrl(product);

  const handleCopy = async () => {
    const ok = await copyToClipboard(shareUrl);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleOpenWhatsApp = () => {
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  };

  const productCover = (Array.isArray(product.images) && product.images[0]) || product.image || null;

  const modalContent = (
    <div 
      className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150"
      style={{ zIndex: 99999 }}
      onClick={close}
    >
      {/* Centered Share Dialog */}
      <div 
        className="relative z-[100000] w-full max-w-md bg-white rounded-2xl shadow-2xl border-2 border-[var(--mustard)] overflow-hidden text-left animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Share Garment"
      >
        {/* Header */}
        <div className="yd-ink-bg px-4 py-3 sm:px-5 sm:py-3.5 text-white flex items-center justify-between border-b border-[var(--mustard)]/30">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[var(--mustard)] text-[var(--ink)] flex items-center justify-center font-bold shadow">
              <Share2 size={16} />
            </div>
            <div>
              <h3 className="font-display text-sm sm:text-base font-bold text-white leading-tight">
                Share Garment
              </h3>
              <p className="text-[10px] font-mono text-[var(--mustard)]">Yashal Dresses Atelier</p>
            </div>
          </div>
          <button
            type="button"
            onClick={close}
            className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center text-white transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>

        {/* Product Snapshot */}
        <div className="p-4">
          <div className="flex items-center gap-3 p-2.5 rounded-xl bg-[var(--ivory)] border border-[var(--line)] mb-3.5">
            <div className="w-12 h-14 rounded-lg overflow-hidden bg-white shrink-0 border border-gray-200 flex items-center justify-center">
              {productCover ? (
                <img src={productCover} alt={product.name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-lg">👔</span>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-mono text-[9px] uppercase font-bold text-[var(--mustard-deep)] truncate">
                {product.brand || "Yashal"} · {product.category}
              </p>
              <h4 className="font-display text-xs sm:text-sm font-semibold text-[var(--ink)] truncate mt-0.5">
                {product.name}
              </h4>
              <p className="text-xs font-bold text-[var(--ink)] mt-0.5">
                {money(product.price)}
                {product.mrp && product.mrp > product.price && (
                  <span className="line-through text-gray-400 font-normal ml-2 text-[10px]">
                    {money(product.mrp)}
                  </span>
                )}
              </p>
            </div>
          </div>

          {/* Share Action Buttons */}
          <div className="space-y-3">
            {/* Action 1: WhatsApp Button */}
            <button
              type="button"
              onClick={handleOpenWhatsApp}
              className="w-full py-2.5 px-3.5 bg-[#25D366] hover:bg-[#20bd5a] active:scale-[0.99] text-white rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
            >
              <MessageCircle size={18} />
              <span>Share on WhatsApp</span>
              <ExternalLink size={13} className="opacity-80 ml-auto" />
            </button>

            {/* Action 2: Copy Link Field */}
            <div>
              <label className="block text-[10px] font-mono font-bold uppercase text-gray-500 mb-1">
                Or copy link to clipboard
              </label>
              <div className="flex items-center gap-1.5 p-1 bg-gray-50 rounded-xl border border-gray-200 focus-within:border-[var(--mustard)] transition-all">
                <input
                  type="text"
                  readOnly
                  value={shareUrl}
                  className="bg-transparent text-[11px] text-gray-700 font-mono flex-1 px-2 py-1 outline-none truncate select-all"
                  onFocus={(e) => e.target.select()}
                />
                <button
                  type="button"
                  onClick={handleCopy}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-all cursor-pointer shrink-0 ${
                    copied
                      ? "bg-emerald-600 text-white shadow-sm"
                      : "bg-[var(--ink)] text-[var(--ivory)] hover:bg-black active:scale-95"
                  }`}
                >
                  {copied ? (
                    <>
                      <Check size={13} />
                      <span>Copied! ✓</span>
                    </>
                  ) : (
                    <>
                      <Copy size={13} />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-4 py-2 border-t border-gray-100 flex items-center justify-between text-[10px] font-mono text-gray-500">
          <span>Opens directly to garment</span>
          <button
            type="button"
            onClick={close}
            className="text-[var(--ink)] hover:text-black font-semibold cursor-pointer underline"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
