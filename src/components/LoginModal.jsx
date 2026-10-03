import React, { useState } from "react";
import { adminSignIn } from "../utils/firebase";
import { X, Lock, KeyRound, ShieldCheck } from "lucide-react";

export function LoginModal({ open, close, onLogin }) {
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

export function MerchantLoginModal({ open, close, onUnlock }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await adminSignIn(email, password);
      onUnlock();
      setEmail("");
      setPassword("");
      setError("");
      close();
    } catch (err) {
      setError("Incorrect Merchant Email or Password. Access denied.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 100, background: "rgba(0,0,0,0.75)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "16px" }}>
      <div style={{ background: "var(--ivory)", width: "100%", maxWidth: "380px", borderRadius: "10px", border: "2px solid var(--mustard)", boxShadow: "0 25px 60px rgba(0,0,0,0.5)", padding: "28px", textAlign: "center" }}>
        <div style={{ width: "52px", height: "52px", borderRadius: "50%", background: "var(--ink)", color: "var(--mustard)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px auto" }}>
          <Lock size={24} />
        </div>
        <p style={{ fontFamily: "IBM Plex Mono", fontSize: "10px", letterSpacing: "2px", textTransform: "uppercase", color: "var(--mustard-deep)", margin: "0 0 4px 0" }}>
          RESTRICTED WORKROOM
        </p>
        <h2 className="font-display" style={{ margin: "0 0 16px 0", fontSize: "22px", color: "var(--ink)" }}>
          Merchant Login
        </h2>
        <p style={{ fontSize: "12px", color: "var(--ink-soft)", lineHeight: "1.5", marginBottom: "20px" }}>
          Enter authorized atelier email and password to manage live inventory and orders.
        </p>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setError(""); }}
            placeholder="Admin Email"
            autoFocus
            style={{ width: "100%", padding: "12px", borderRadius: "6px", border: "1px solid var(--line)", background: "var(--parchment)", fontSize: "14px", textAlign: "center", letterSpacing: "1px", marginBottom: "12px" }}
          />
          <input
            type="password"
            value={password}
            onChange={(e) => { setPassword(e.target.value); setError(""); }}
            placeholder="Admin Password"
            style={{ width: "100%", padding: "12px", borderRadius: "6px", border: "1px solid var(--line)", background: "var(--parchment)", fontSize: "14px", textAlign: "center", letterSpacing: "2px", marginBottom: "12px" }}
          />

          {error && (
            <p style={{ color: "#ef4444", fontSize: "11px", margin: "0 0 12px 0", fontWeight: "600" }}>
              {error}
            </p>
          )}

          <div style={{ display: "flex", gap: "10px" }}>
            <button
              type="button"
              onClick={close}
              className="yd-btn"
              style={{ flex: 1, padding: "10px", background: "transparent", border: "1px solid var(--line)", color: "var(--ink)" }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="yd-btn yd-btn-primary"
              style={{ flex: 1, padding: "10px", background: "var(--ink)", color: "var(--ivory)", opacity: loading ? 0.7 : 1 }}
            >
              {loading ? "Authenticating..." : "Login"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginModal;
