import React from "react";
import { Phone, Mail, MapPin, ExternalLink, MessageCircle } from "lucide-react";
import { Crest } from "./BrandDecorations";
import { STORE_CONTACT } from "./InquiryModal";

export default function Footer({ setPage, setActiveCategory, onOpenInquiry }) {
  return (
    <footer className="yd-ink-bg mt-14 border-t border-[var(--mustard)]/30 text-white">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-left">
        
        {/* Col 1: Brand Info */}
        <div className="space-y-3">
          <div className="flex items-center gap-2.5">
            <Crest size={32} showBanner={false} />
            <div>
              <h3 className="font-display text-lg font-bold text-white tracking-tight">YASHAL <span className="yd-mustard">DRESSES</span></h3>
              <p className="font-mono text-[9px] tracking-widest text-white/50">WORKROOM &amp; APPAREL</p>
            </div>
          </div>
          <p className="text-xs text-white/70 leading-relaxed">
            Premium men's formal shirting, comfort casuals, festive kurtas, and precision-tailored trousers stitched to fit the way you move.
          </p>
          <button
            onClick={onOpenInquiry}
            className="yd-btn border border-[var(--mustard)] text-[var(--mustard)] px-3.5 py-2 text-[11px] font-bold rounded hover:bg-[var(--mustard)] hover:text-black transition-all inline-flex items-center gap-1.5"
          >
            <MessageCircle size={14} />
            <span>Quick Store Inquiry →</span>
          </button>
        </div>

        {/* Col 2: Shop Segments */}
        <div>
          <p className="font-mono text-[11px] font-bold tracking-widest text-[var(--mustard)] mb-3 uppercase">SHOP SEGMENTS</p>
          <div className="space-y-1.5 text-xs text-white/80 font-mono">
            {["Formal Shirts", "Casual Shirts", "Formal Trousers", "Cotton Pants", "Kurta Pyjamas", "Formal T-Shirts", "Cargos"].map((c) => (
              <button
                key={c}
                className="block hover:text-[var(--mustard)] transition-colors text-left"
                onClick={() => { setActiveCategory(c); setPage("shop"); }}
              >
                • {c}
              </button>
            ))}
          </div>
        </div>

        {/* Col 3: Direct Contact & Helpline */}
        <div>
          <p className="font-mono text-[11px] font-bold tracking-widest text-[var(--mustard)] mb-3 uppercase">STORE HELPLINE</p>
          <div className="space-y-2.5 text-xs text-white/80">
            <div>
              <span className="text-[10px] font-mono text-white/50 block">📞 Shop Call / WhatsApp:</span>
              <a href={`tel:+91${STORE_CONTACT.phone}`} className="font-mono font-bold text-sm text-[var(--mustard)] hover:underline block">
                {STORE_CONTACT.displayPhone}
              </a>
            </div>
            <div>
              <span className="text-[10px] font-mono text-white/50 block">✉️ Official Email:</span>
              <a href={`mailto:${STORE_CONTACT.email}`} className="font-mono text-xs text-white/90 hover:text-[var(--mustard)] hover:underline block truncate">
                {STORE_CONTACT.email}
              </a>
            </div>
            <div>
              <span className="text-[10px] font-mono text-white/50 block">🕒 Store Hours:</span>
              <p className="font-mono text-[11px] text-white/80">Open 7 Days · 10:00 AM – 9:30 PM</p>
            </div>
          </div>
        </div>

        {/* Col 4: Store Location & Address */}
        <div>
          <p className="font-mono text-[11px] font-bold tracking-widest text-[var(--mustard)] mb-3 uppercase">VISIT OUR STORE</p>
          <div className="text-xs text-white/85 space-y-1 bg-white/5 p-3.5 rounded-xl border border-white/10">
            <p className="font-bold text-white font-display text-sm">Yashal Dresses</p>
            <p>Sector 25, Plot 601,</p>
            <p>Nigdi, Pradhikaran,</p>
            <p className="text-[var(--mustard)] font-semibold">Opposite MSEB OFFICE</p>
            <p className="font-mono font-bold">PUNE: 411044</p>
            <div className="pt-2">
              <a
                href={STORE_CONTACT.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-[10px] text-[var(--mustard)] hover:underline inline-flex items-center gap-1 font-bold"
              >
                <ExternalLink size={11} />
                <span>Get Driving Directions →</span>
              </a>
            </div>
          </div>
        </div>

      </div>

      <div className="border-t border-white/10 py-4 text-center text-xs text-white/50 font-mono flex flex-col sm:flex-row items-center justify-between max-w-7xl mx-auto px-4 md:px-6 gap-2">
        <span>© {new Date().getFullYear()} Yashal Dresses. Nigdi, Pradhikaran, Pune.</span>
        <span className="text-[11px] text-white/70">Shop Helpline: 9673533839 · yashaldressespune@gmail.com</span>
      </div>
    </footer>
  );
}
