import React from "react";
import { MessageCircle } from "lucide-react";

export default function FloatingInquiryButton({ onClick }) {
  return (
    <div className="fixed bottom-5 right-5 z-40 flex items-center gap-2">
      <button
        onClick={onClick}
        className="flex items-center gap-2.5 px-4 py-3 rounded-full shadow-2xl font-mono text-xs font-bold transition-all transform hover:scale-105 active:scale-95 border-2 border-[var(--mustard)]"
        style={{ background: "var(--ink)", color: "var(--mustard)" }}
        title="Inquire / Call Shop: 9673533839"
      >
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--mustard)] opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-[var(--mustard)]"></span>
        </span>
        <MessageCircle size={17} />
        <span className="hidden sm:inline tracking-wider">STORE INQUIRY</span>
        <span className="bg-[var(--mustard)] text-[var(--ink)] px-2 py-0.5 rounded-full text-[10px] font-bold">
          9673533839
        </span>
      </button>
    </div>
  );
}
