import React, { useState } from "react";
import { X } from "lucide-react";

export default function LoginModal({ open, close, onLogin }) {
  const [mode, setMode] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-[1px]" onClick={close} />
      <div className="relative bg-[var(--ivory)] rounded-lg w-full max-w-sm p-6 shadow-2xl border border-[var(--line)]">
        <button onClick={close} className="absolute top-4 right-4 text-gray-500 hover:text-black"><X size={18} /></button>
        <p className="font-mono text-[11px] tracking-widest yd-mustard mb-1">{mode === "login" ? "WELCOME BACK" : "NEW HERE?"}</p>
        <h2 className="font-display text-2xl mb-5 font-semibold">{mode === "login" ? "Log in" : "Create account"}</h2>
        
        <div className="space-y-3">
          {mode === "signup" && (
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full name"
              className="w-full border border-[var(--line)] rounded px-3 py-2.5 text-sm bg-white outline-none focus:border-[var(--mustard)]"
            />
          )}
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email or mobile number"
            className="w-full border border-[var(--line)] rounded px-3 py-2.5 text-sm bg-white outline-none focus:border-[var(--mustard)]"
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full border border-[var(--line)] rounded px-3 py-2.5 text-sm bg-white outline-none focus:border-[var(--mustard)]"
          />
        </div>

        <button
          onClick={() => onLogin({ name: name || email.split("@")[0] || "Customer", email: email || "customer@yashal.in" })}
          className="yd-btn yd-btn-primary w-full py-3.5 mt-5 text-sm font-bold shadow"
          style={{ background: "var(--ink)", color: "var(--ivory)" }}
        >
          {mode === "login" ? "Log in" : "Create account"}
        </button>

        <p className="text-xs text-center mt-4 opacity-70">
          {mode === "login" ? "New to Yashal Dresses? " : "Already have an account? "}
          <button
            onClick={() => setMode(mode === "login" ? "signup" : "login")}
            className="underline font-medium"
            style={{ color: "var(--ink)" }}
          >
            {mode === "login" ? "Create one" : "Log in"}
          </button>
        </p>
      </div>
    </div>
  );
}
