import React, { useState, useEffect, useRef, useMemo } from "react";

/* ------------------------------ REVEAL-ON-SCROLL HOOK ---------------------- */
export function useReveal() {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setInView(true); obs.disconnect(); }
    }, { threshold: 0.15 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, inView];
}

/* ------------------------------ CUSTOM CATEGORY ICONS ----------------------- */
export function CategoryIcon({ name, size = 40, color = "rgba(251,247,239,0.9)" }) {
  const P = { fill: "none", stroke: color, strokeWidth: 1.3, strokeLinecap: "round", strokeLinejoin: "round" };
  const dot = { fill: color, stroke: "none" };
  const paths = {
    "Formal Shirts": <><path {...P} d="M8 3L4 6l2 3 2-1v13h8V8l2 1 2-3-4-3-2 2H10z" /><line {...P} x1="12" y1="8" x2="12" y2="21" /></>,
    "Casual Shirts": <><path {...P} d="M8 3L4 6l1 4 3-1v12h8V9l3 1 1-4-4-3-2 2h-4z" /><line {...P} x1="12" y1="7" x2="12" y2="21" /><circle cx="12" cy="11" r="0.7" {...dot} /><circle cx="12" cy="15" r="0.7" {...dot} /></>,
    "Formal Trousers": <path {...P} d="M6 3h12l1 5-2 13h-3l-1-10-1 10H9L7 8z" />,
    "Party Wear Trousers": <><path {...P} d="M6 3h12l1 5-2 13h-3l-1-10-1 10H9L7 8z" /><circle cx="12" cy="7" r="1" {...dot} /></>,
    "Cotton Pants": <path {...P} d="M6 3h12l1 5-2 13h-3l-1-9-1 9H9L7 8z" />,
    "Cargos": <><path {...P} d="M6 3h12l1 5-2 13h-3l-1-10-1 10H9L7 8z" /><rect {...P} x="3.5" y="11" width="3.2" height="4.2" rx="0.6" /><rect {...P} x="17.3" y="11" width="3.2" height="4.2" rx="0.6" /></>,
    "Formal T-Shirts": <path {...P} d="M8 4L4 6l1 4 3-1v10h8V9l3 1 1-4-4-2-2 2h-4z" />,
    "Party Wear T-Shirts": <><path {...P} d="M8 4L4 6l1 4 3-1v10h8V9l3 1 1-4-4-2-2 2h-4z" /><path {...P} d="M12 9l2 3h-4z" /></>,
    "Sweatshirts": <><path {...P} d="M8 3L4 6l1 5 3-1v11h8V10l3 1 1-5-4-3-2 2h-4z" /><path {...P} d="M9 20v-3M12 20.5v-3M15 20v-3" /></>,
    "Kurta Pyjamas": <><path {...P} d="M9 3h6l1 3-1 2v14H9V8L8 6z" /><path {...P} d="M9 15l-1.5 5M15 15l1.5 5" /><line {...P} x1="12" y1="5" x2="12" y2="12" /></>,
    "Short Kurtas": <><path {...P} d="M9 3h6l1 3-1 2v9H9V8L8 6z" /><line {...P} x1="12" y1="5" x2="12" y2="10" /></>,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24">
      {paths[name] || paths["Formal Shirts"]}
    </svg>
  );
}

/* ------------------------------ FABRIC TEXTURES ----------------------------- */
export function textureFor(category) {
  const twill = "repeating-linear-gradient(65deg, rgba(255,255,255,0.14) 0 2px, transparent 2px 6px)";
  const rib = "repeating-linear-gradient(90deg, rgba(255,255,255,0.14) 0 2px, transparent 2px 7px)";
  const check = "repeating-linear-gradient(0deg, rgba(255,255,255,0.1) 0 1px, transparent 1px 9px), repeating-linear-gradient(90deg, rgba(255,255,255,0.1) 0 1px, transparent 1px 9px)";
  const weave = "repeating-linear-gradient(45deg, rgba(255,255,255,0.1) 0 3px, transparent 3px 8px), repeating-linear-gradient(-45deg, rgba(255,255,255,0.07) 0 3px, transparent 3px 8px)";
  const dotJersey = "radial-gradient(rgba(255,255,255,0.12) 1px, transparent 1.2px)";
  if (["Cargos", "Cotton Pants", "Formal Trousers", "Party Wear Trousers"].includes(category)) return { backgroundImage: twill, backgroundSize: "10px 10px" };
  if (["Sweatshirts"].includes(category)) return { backgroundImage: rib, backgroundSize: "9px 9px" };
  if (["Formal Shirts", "Casual Shirts"].includes(category)) return { backgroundImage: check, backgroundSize: "10px 10px" };
  if (["Kurta Pyjamas", "Short Kurtas"].includes(category)) return { backgroundImage: weave, backgroundSize: "12px 12px" };
  if (["Formal T-Shirts", "Party Wear T-Shirts"].includes(category)) return { backgroundImage: dotJersey, backgroundSize: "8px 8px" };
  return { backgroundImage: "none" };
}

/* ------------------------------ CREST ILLUSTRATION -------------------------- */
export function Crest({ size = 90, color = "var(--mustard)", opacity = 1, showBanner = true, className = "" }) {
  const leaf = (side, i) => {
    const t = i / 4;
    const x = side * (10 + t * 16);
    const y = 118 - t * 96;
    const rot = side * (35 + t * 25);
    return (
      <ellipse key={side + "-" + i} cx={x} cy={y} rx="7" ry="3.1"
        transform={`rotate(${rot} ${x} ${y})`}
        fill="none" stroke={color} strokeWidth="1.1" />
    );
  };
  return (
    <svg className={className} width={size} height={size * 1.55} viewBox="0 0 100 160" style={{ opacity }}>
      <path d="M6 122 C 2 90, 8 50, 22 14" fill="none" stroke={color} strokeWidth="1.1" />
      <path d="M94 122 C 98 90, 92 50, 78 14" fill="none" stroke={color} strokeWidth="1.1" />
      {[0, 1, 2, 3, 4].map((i) => leaf(-1, i))}
      {[0, 1, 2, 3, 4].map((i) => leaf(1, i))}

      <path d="M50 6 L86 18 V58 C86 92 70 112 50 127 C30 112 14 92 14 58 V18 Z"
        fill="none" stroke={color} strokeWidth="1.6" />
      <path d="M50 14 L79 24 V58 C79 87 66 104 50 118 C34 104 21 87 21 58 V24 Z"
        fill="none" stroke={color} strokeWidth="0.8" opacity="0.6" />

      <path d="M50 26 C62 35 62 66 50 88 C38 66 38 35 50 26 Z" fill="none" stroke={color} strokeWidth="1.3" />
      <circle cx="50" cy="56" r="9" fill="none" stroke={color} strokeWidth="1.1" />
      <circle cx="50" cy="56" r="3" fill={color} stroke="none" />
      <line x1="50" y1="88" x2="50" y2="112" stroke={color} strokeWidth="1.3" />
      {[32, 38, 44].map((y) => (
        <React.Fragment key={y}>
          <line x1="50" y1={y} x2={38 + (y - 32) * 0.4} y2={y - 6} stroke={color} strokeWidth="0.9" />
          <line x1="50" y1={y} x2={62 - (y - 32) * 0.4} y2={y - 6} stroke={color} strokeWidth="0.9" />
        </React.Fragment>
      ))}

      {showBanner && (
        <>
          <path d="M14 130 L50 122 L86 130 L79 148 L50 138 L21 148 Z" fill="none" stroke={color} strokeWidth="1.3" />
          <path d="M14 130 L21 134 L21 148" fill="none" stroke={color} strokeWidth="1" />
          <path d="M86 130 L79 134 L79 148" fill="none" stroke={color} strokeWidth="1" />
          <text x="50" y="137" textAnchor="middle" fontFamily="'IBM Plex Mono',monospace" fontSize="6.5" fill={color} letterSpacing="1">YASHAL</text>
        </>
      )}
    </svg>
  );
}

/* ------------------------------ PAISLEY PATTERN ------------------------------ */
export function PaisleyBackground({ color = "var(--mustard)", opacity = 0.05, size = 90, className = "" }) {
  const uidRef = useRef("pai" + Math.random().toString(36).slice(2, 9));
  const uid = uidRef.current;
  return (
    <svg className={`absolute inset-0 w-full h-full pointer-events-none ${className}`} style={{ opacity }} preserveAspectRatio="xMidYMid slice">
      <defs>
        <pattern id={`pai-${uid}`} width={size} height={size} patternUnits="userSpaceOnUse" patternTransform="rotate(8)">
          <path
            d="M45 14 C24 14 14 32 22 50 C28 63 44 68 55 60 C66 52 62 40 50 42 C42 43 40 34 48 30 C58 25 66 14 45 14 Z"
            fill="none" stroke={color} strokeWidth="1.2"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#pai-${uid})`} />
    </svg>
  );
}

/* ------------------------------ PEACOCK SHOWPIECE ---------------------------- */
const PEACOCK_HUES = [
  ["#0F6E5E", "#1B9C82"], ["#1B4332", "#2F7A5C"], ["#1B2A4A", "#2C4270"],
  ["#3B2063", "#5B3A93"], ["#6B1E42", "#9C3A6A"], ["#0F6E5E", "#1B9C82"],
  ["#1B2A4A", "#2C4270"], ["#3B2063", "#5B3A93"], ["#1B4332", "#2F7A5C"],
];
export function Peacock({ size = 340, animate = true, className = "" }) {
  const feathers = PEACOCK_HUES.map((_, i) => i - (PEACOCK_HUES.length - 1) / 2);
  return (
    <svg className={className} width={size} height={size * 1.05} viewBox="0 0 400 380">
      <defs>
        <linearGradient id="peacockBody" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1B9C82" />
          <stop offset="1" stopColor="#0F4A3D" />
        </linearGradient>
      </defs>

      <g style={animate ? { transformBox: "view-box", transformOrigin: "200px 340px", animation: "peacockFan 1.3s cubic-bezier(.2,.75,.25,1) both, peacockSway 7s ease-in-out 1.3s infinite" } : undefined}>
        {feathers.map((idx, i) => {
          const angle = idx * 16;
          const [c1, c2] = PEACOCK_HUES[i];
          return (
            <g key={i} transform={`rotate(${angle} 200 340)`}>
              <path d="M200 340 C 196 280, 198 230, 200 190" fill="none" stroke="var(--mustard-deep)" strokeWidth="2" opacity="0.5" />
              <ellipse cx="200" cy="178" rx="22" ry="32" fill={c1} opacity="0.92" />
              <ellipse cx="200" cy="178" rx="22" ry="32" fill="none" stroke="var(--mustard)" strokeWidth="1.2" opacity="0.7" />
              <ellipse cx="200" cy="178" rx="13" ry="20" fill={c2} />
              <circle cx="200" cy="178" r="7" fill="#0A0A0A" opacity="0.55" />
              <circle cx="200" cy="176" r="3" fill="var(--mustard)" />
            </g>
          );
        })}
      </g>

      <ellipse cx="200" cy="345" rx="30" ry="40" fill="url(#peacockBody)" />
      <path d="M200 312 C 192 290, 192 260, 200 240" fill="none" stroke="#1B9C82" strokeWidth="14" strokeLinecap="round" />
      <circle cx="201" cy="232" r="15" fill="#1B9C82" />
      <path d="M201 218 L196 202 M201 216 L201 198 M201 218 L206 202" stroke="var(--mustard)" strokeWidth="2" strokeLinecap="round" />
      <path d="M212 233 L224 230 L213 238 Z" fill="var(--mustard)" />
      <circle cx="207" cy="229" r="1.6" fill="#0A0A0A" />
    </svg>
  );
}

/* ------------------------------ GOLDEN ATELIER DUST (FLOATING PARTICLES) ------------------ */
export function GoldenAtelierDust({ count = 38, className = "" }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animationFrameId;

    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let h = (canvas.height = canvas.parentElement?.clientHeight || 450);

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        width = canvas.width = Math.max(10, entry.contentRect.width);
        h = canvas.height = Math.max(10, entry.contentRect.height);
      }
    });

    if (canvas.parentElement) {
      resizeObserver.observe(canvas.parentElement);
    }

    // Imperial gold color palette for luxury atelier glow
    const goldHues = [
      "rgba(255, 248, 220, ", // Radiant warm gold
      "rgba(255, 223, 0, ",   // Bright imperial gold
      "rgba(212, 175, 55, ",  // Yashal signature mustard gold
      "rgba(243, 229, 171, ", // Vanilla champagne gold
      "rgba(235, 179, 65, "   // Amber gold ember
    ];

    const particles = Array.from({ length: count }, (_, idx) => {
      const size = Math.random() * 2.8 + 1.2;
      return {
        x: Math.random() * width,
        y: Math.random() * h,
        size,
        baseSize: size,
        speedY: -(Math.random() * 0.14 + 0.06), // Ultra-slow, peaceful upward float
        swaySpeed: Math.random() * 0.008 + 0.003,
        swayAmp: Math.random() * 0.9 + 0.4,
        swayAngle: Math.random() * Math.PI * 2,
        twinkleSpeed: Math.random() * 0.015 + 0.006,
        twinkleAngle: Math.random() * Math.PI * 2,
        baseAlpha: Math.random() * 0.45 + 0.42,
        colorPrefix: goldHues[idx % goldHues.length],
        hasHalo: Math.random() > 0.35,
      };
    });

    let mouseX = width / 2;
    let mouseY = h / 2;

    const handleMouseMove = (e) => {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    const render = () => {
      ctx.clearRect(0, 0, width, h);

      // Subtle bottom golden atelier mist glow
      const bottomGlow = ctx.createLinearGradient(0, h, 0, Math.max(0, h - 90));
      bottomGlow.addColorStop(0, "rgba(212, 175, 55, 0.12)");
      bottomGlow.addColorStop(0.6, "rgba(212, 175, 55, 0.03)");
      bottomGlow.addColorStop(1, "rgba(212, 175, 55, 0)");
      ctx.fillStyle = bottomGlow;
      ctx.fillRect(0, Math.max(0, h - 90), width, 90);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Float upwards with organic sinusoidal sway
        p.y += p.speedY;
        p.swayAngle += p.swaySpeed;
        p.x += Math.sin(p.swayAngle) * p.swayAmp;
        p.twinkleAngle += p.twinkleSpeed;

        // Subtle gentle drift around cursor
        const dx = p.x - mouseX;
        const dy = p.y - mouseY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 110) {
          const force = (110 - dist) / 110;
          p.x += (dx / dist) * force * 0.6;
          p.y -= force * 0.3;
        }

        // Respawn smoothly at bottom
        if (p.y < -12) {
          p.y = h + Math.random() * 15;
          p.x = Math.random() * width;
        }
        if (p.x < -12) p.x = width + 12;
        if (p.x > width + 12) p.x = -12;

        const currentAlpha = Math.max(0.12, Math.min(1, p.baseAlpha + Math.sin(p.twinkleAngle) * 0.28));
        const currentSize = p.baseSize * (0.85 + Math.sin(p.twinkleAngle) * 0.22);

        // Radiant halo for floating golden dust motes
        if (p.hasHalo) {
          const glowGrad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, currentSize * 4.8);
          glowGrad.addColorStop(0, p.colorPrefix + (currentAlpha * 0.45) + ")");
          glowGrad.addColorStop(0.5, p.colorPrefix + (currentAlpha * 0.15) + ")");
          glowGrad.addColorStop(1, "rgba(212, 175, 55, 0)");
          ctx.fillStyle = glowGrad;
          ctx.beginPath();
          ctx.arc(p.x, p.y, currentSize * 4.8, 0, Math.PI * 2);
          ctx.fill();
        }

        // Sparkling golden dust core
        ctx.fillStyle = p.colorPrefix + currentAlpha + ")";
        ctx.beginPath();
        ctx.arc(p.x, p.y, currentSize, 0, Math.PI * 2);
        ctx.fill();

        // Micro sparkle cross on large prominent golden motes
        if (p.baseSize > 2.4 && currentAlpha > 0.65) {
          ctx.strokeStyle = "rgba(255, 255, 245, " + (currentAlpha * 0.7) + ")";
          ctx.lineWidth = 0.75;
          ctx.beginPath();
          ctx.moveTo(p.x - currentSize * 2.2, p.y);
          ctx.lineTo(p.x + currentSize * 2.2, p.y);
          ctx.moveTo(p.x, p.y - currentSize * 2.2);
          ctx.lineTo(p.x, p.y + currentSize * 2.2);
          ctx.stroke();
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [count]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 pointer-events-none w-full h-full z-10 ${className}`}
      style={{ mixBlendMode: "screen" }}
    />
  );
}

/* ------------------------------ SPARKLES ------------------------------------- */
export function SparkleField({ count = 14, className = "" }) {
  const dots = useMemo(
    () => Array.from({ length: count }, (_, i) => ({
      left: `${(i * 137.5) % 100}%`,
      top: `${(i * 71.3) % 100}%`,
      delay: `${(i * 0.37) % 4}s`,
      dur: `${3.5 + (i % 5) * 0.6}s`,
      size: 2 + (i % 3),
    })),
    [count]
  );
  return (
    <div className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}>
      {dots.map((d, i) => (
        <span
          key={i}
          className="sparkle-dot"
          style={{ left: d.left, top: d.top, width: d.size, height: d.size, animationDelay: d.delay, animationDuration: d.dur }}
        />
      ))}
    </div>
  );
}

/* ------------------------------ MEASURING TAPE ------------------------------ */
export function MeasuringTape({ color = "var(--line)", numberColor = "var(--ink-soft)" }) {
  const [ref, inView] = useReveal();
  const width = 1400;
  const ticks = [];
  for (let x = 0; x <= width; x += 10) {
    const major = x % 100 === 0;
    const mid = x % 50 === 0;
    ticks.push(
      <line key={x} x1={x} y1={0} x2={x} y2={major ? 18 : mid ? 13 : 8} stroke={color} strokeWidth={major ? 1.4 : 1} />
    );
    if (major) ticks.push(
      <text key={"t" + x} x={x + 3} y={16} fontSize="9" fontFamily="'IBM Plex Mono',monospace" fill={numberColor}>{x / 100}"</text>
    );
  }
  return (
    <div ref={ref} className="w-full overflow-hidden" style={{ height: 24 }}>
      <svg
        viewBox={`0 0 ${width} 24`} width="100%" height="24" preserveAspectRatio="none"
        style={{ transform: inView ? "scaleX(1)" : "scaleX(0)", transformOrigin: "left", transition: "transform 1.1s cubic-bezier(.2,.7,.2,1)" }}
      >
        <line x1="0" y1="0" x2={width} y2="0" stroke={color} strokeWidth="1.4" />
        {ticks}
      </svg>
    </div>
  );
}

/* --------------------------------- CHALK MARKS ------------------------------- */
export function ChalkUnderline({ width = 160, color = "var(--mustard)" }) {
  const [ref, inView] = useReveal();
  return (
    <svg ref={ref} width={width} height="10" viewBox={`0 0 ${width} 10`} className="block">
      <path
        d={`M2 6 C ${width * 0.25} 2, ${width * 0.5} 9, ${width * 0.75} 4 S ${width - 6} 3, ${width - 2} 6`}
        fill="none" stroke={color} strokeWidth="2" strokeLinecap="round"
        pathLength="1" strokeDasharray="1"
        style={{ strokeDashoffset: inView ? 0 : 1, transition: "stroke-dashoffset 0.8s ease .3s" }}
      />
    </svg>
  );
}

export function ChalkCircle({ className = "", color = "var(--oxblood)" }) {
  return (
    <svg className={className} width="100%" height="100%" viewBox="0 0 120 60" preserveAspectRatio="none" style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
      <path d="M10 30 C 8 10, 40 3, 60 4 C 95 5, 114 15, 110 32 C 107 52, 70 58, 45 56 C 18 54, 4 45, 10 30 Z"
        fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" opacity="0.75" />
    </svg>
  );
}

/* ------------------------------ ANIMATED SWING TAG --------------------------- */
export function AnimatedSwingTag({ size = 64 }) {
  return (
    <div className="swing-tag-drop mx-auto" style={{ width: size }}>
      <div className="swing-tag-swing">
        <svg width={size} height={size} viewBox="0 0 64 64">
          <line x1="32" y1="0" x2="32" y2="14" stroke="var(--ink-soft)" strokeWidth="1.5" />
          <path d="M32 14 L54 30 L54 52 A6 6 0 0 1 48 58 L18 58 A6 6 0 0 1 12 52 L12 30 Z"
            fill="var(--ivory)" stroke="var(--ink)" strokeWidth="1.5" />
          <circle cx="32" cy="24" r="3.2" fill="var(--parchment)" stroke="var(--ink)" strokeWidth="1.5" />
          <path d="M18 40 L28 48 L46 32" fill="none" stroke="var(--mustard)" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </div>
  );
}

/* -------------------------------- SWATCH ---------------------------------- */
export function Swatch({ p, className = "" }) {
  if (!p) return <div className={`bg-gray-200 ${className}`} />;
  
  const displayImg = (Array.isArray(p.images) && p.images.length > 0) ? p.images[0] : p.image;

  // If product has a custom uploaded image URL, display the uploaded photo!
  if (displayImg) {
    return (
      <div className={`relative flex items-center justify-center overflow-hidden bg-cover bg-center ${className}`}>
        <img
          src={displayImg}
          alt={p.name}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
        {!p.inStock && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center">
            <span className="font-mono text-xs text-white bg-black/80 px-3 py-1 rounded border border-white/30 tracking-widest uppercase">
              Out of stock
            </span>
          </div>
        )}
      </div>
    );
  }

  const c1 = p.c1 || "#1B2A4A";
  const c2 = p.c2 || "#0D1830";

  return (
    <div
      className={`swatch relative flex items-center justify-center overflow-hidden ${className}`}
      style={{ background: `linear-gradient(155deg, ${c1}, ${c2})` }}
    >
      <div className="texture-layer" style={textureFor(p.category)} />
      <CategoryIcon name={p.category} size={38} />
      {!p.inStock && (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center z-10">
          <span className="font-mono text-xs text-white bg-black/80 px-3 py-1 rounded border border-white/30 tracking-widest uppercase">
            Out of stock
          </span>
        </div>
      )}
    </div>
  );
}

export function WaxSeal({ size = 48, className = "" }) {
  return (
    <div
      className={`relative flex items-center justify-center rounded-full shadow-lg ${className}`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        background: "radial-gradient(circle at 35% 35%, #8B1E3F, #4A0E22)",
        border: "2px solid #D4AF37",
        boxShadow: "0 4px 12px rgba(74, 14, 34, 0.4)",
      }}
    >
      <div
        className="rounded-full border border-[#D4AF37]/50 flex items-center justify-center"
        style={{ width: `${size * 0.72}px`, height: `${size * 0.72}px` }}
      >
        <span
          style={{
            fontFamily: "'Fraunces', serif",
            color: "#D4AF37",
            fontSize: `${size * 0.36}px`,
            fontWeight: "700",
            lineHeight: 1,
          }}
        >
          Y
        </span>
      </div>
    </div>
  );
}
