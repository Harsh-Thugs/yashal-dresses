import React from "react";

export default function BrandStyles() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,450;0,9..144,600;0,9..144,700;1,9..144,500&family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@500;600&display=swap');
      .yd-root{ --ink:#1A1224; --ink-soft:#4A3B5C; --parchment:#F2E8D6; --ivory:#FBF6EC;
        --mustard:#D4AF37; --mustard-deep:#A8841C; --oxblood:#5C1A3D; --royal:#3B2063; --line:rgba(26,18,36,0.16);
        font-family:'Inter',sans-serif; background:var(--parchment); color:var(--ink); }
      .yd-root .font-display{ font-family:'Fraunces',serif; }
      .yd-root .font-mono{ font-family:'IBM Plex Mono',monospace; letter-spacing:.04em; }
      .yd-ink-bg{ background:linear-gradient(155deg, var(--ink), #241736); color:var(--ivory); border-bottom:1px solid rgba(212,175,55,0.25); }
      .yd-mustard{ color:var(--mustard); }
      .yd-btn{ font-family:'IBM Plex Mono',monospace; letter-spacing:.05em; text-transform:uppercase; font-size:12px;
        font-weight:600; border-radius:2px; transition:all .18s ease; cursor:pointer; }
      .yd-btn-primary{ background:var(--ink); color:var(--ivory); box-shadow:0 0 0 1px rgba(212,175,55,0.35) inset; }
      .yd-btn-primary:hover{ background:var(--mustard-deep); color:var(--ink); box-shadow:0 0 0 1px var(--mustard) inset; }
      .yd-btn-outline{ background:transparent; border:1px solid var(--ink); color:var(--ink); }
      .yd-btn-outline:hover{ background:var(--ink); color:var(--ivory); }
      
      .tag-card{ background:var(--ivory); border:1px solid var(--line); border-radius:10px; position:relative;
        overflow:hidden; transition:transform .2s ease, box-shadow .2s ease, border-color .2s ease; }
      .tag-card:hover{ transform:translateY(-3px); box-shadow:0 16px 30px -14px rgba(26,18,36,0.45), 0 0 0 1px rgba(212,175,55,0.5); border-color:rgba(212,175,55,0.5); }
      .tag-hole{ position:absolute; top:10px; left:10px; width:16px; height:16px; border-radius:999px;
        background:var(--parchment); border:2px solid var(--mustard); z-index:2; }
      .tag-stitch{ border-top:1.5px dashed var(--line); }
      .swatch{ background-image: repeating-linear-gradient(135deg, rgba(255,255,255,0.06) 0px, rgba(255,255,255,0.06) 2px, transparent 2px, transparent 10px); }
      
      .cat-chip{ font-family:'IBM Plex Mono',monospace; font-size:11.5px; letter-spacing:.04em; text-transform:uppercase;
        border:1px dashed var(--line); border-radius:999px; white-space:nowrap; transition:all .15s ease; cursor:pointer; }
      .cat-chip.active{ background:var(--ink); color:var(--mustard); border-color:var(--mustard); }
      .cat-chip:hover:not(.active){ border-color:var(--mustard); }
      
      .divider{ border-top:1px solid var(--line); }
      .scrollbar-none::-webkit-scrollbar{ display:none; }
      .scrollbar-none{ -ms-overflow-style:none; scrollbar-width:none; }
      .step-dot{ width:10px; height:10px; border-radius:999px; background:var(--line); }
      .step-dot.done{ background:var(--mustard); }
      
      .badge-sale{ background:var(--oxblood); color:var(--ivory); }
      .badge-new{ background:var(--ink); color:var(--mustard); }
      .badge-best{ background:var(--mustard); color:var(--ink); }
      .badge-outofstock{ background:#4A3B5C; color:#F2E8D6; }
      
      input[type=range]{ accent-color:var(--mustard); }

      .yd-select{ width:100%; appearance:none; -webkit-appearance:none; background:var(--ivory); border:1px solid var(--line);
        border-radius:6px; padding:10px 34px 10px 12px; font-size:14px; color:var(--ink); font-family:'Inter',sans-serif;
        cursor:pointer; transition:border-color .15s ease; }
      .yd-select:hover, .yd-select:focus{ border-color:var(--mustard); outline:none; }

      .yd-check-row{ display:flex; align-items:center; gap:10px; font-size:14px; cursor:pointer; padding:5px 6px;
        border-radius:6px; transition:background .15s ease; }
      .yd-check-row:hover{ background:rgba(212,175,55,0.1); }
      .yd-checkbox{ appearance:none; -webkit-appearance:none; width:17px; height:17px; border:1.5px solid var(--line);
        border-radius:4px; position:relative; cursor:pointer; flex-shrink:0; transition:all .15s ease; background:var(--ivory); }
      .yd-checkbox:hover{ border-color:var(--mustard); }
      .yd-checkbox:checked{ background:var(--ink); border-color:var(--mustard); }
      .yd-checkbox:checked::after{ content:''; position:absolute; left:5px; top:1.5px; width:4px; height:8px;
        border:solid var(--mustard); border-width:0 2px 2px 0; transform:rotate(45deg); }

      .yd-scroll::-webkit-scrollbar{ width:5px; }
      .yd-scroll::-webkit-scrollbar-thumb{ background:var(--mustard); border-radius:99px; }
      .yd-scroll::-webkit-scrollbar-track{ background:transparent; }
      .yd-scroll{ scrollbar-width:thin; scrollbar-color:var(--mustard) transparent; }

      .filter-panel{ background:var(--ivory); border:1px solid var(--line); border-radius:12px; padding:20px;
        box-shadow:0 0 0 1px rgba(212,175,55,0.12) inset; }

      /* Creative layer animations */
      .tag-card{ --tilt:0deg; }
      .tag-card:hover{ transform:translateY(-3px) rotate(var(--tilt)); }
      .texture-layer{ position:absolute; inset:0; mix-blend-mode:overlay; opacity:.55; pointer-events:none; }

      @keyframes stitchIn{ from{ opacity:0; transform:translateY(7px); } to{ opacity:1; transform:translateY(0); } }
      .stitch-letter{ display:inline-block; opacity:0; animation:stitchIn .45s ease forwards; }

      .reveal{ opacity:0; transform:translateY(16px); transition:opacity .6s ease, transform .6s ease; }
      .reveal.in{ opacity:1; transform:translateY(0); }

      @keyframes tagDrop{ 0%{ transform:translateY(-70px); opacity:0; } 55%{ opacity:1; } 100%{ transform:translateY(0); opacity:1; } }
      @keyframes tagSwing{ 0%{ transform:rotate(0deg); } 20%{ transform:rotate(-9deg); } 45%{ transform:rotate(7deg); }
        68%{ transform:rotate(-4deg); } 85%{ transform:rotate(2deg); } 100%{ transform:rotate(0deg); } }
      .swing-tag-drop{ animation:tagDrop .55s cubic-bezier(.2,.8,.3,1) forwards; transform-origin:top center; }
      .swing-tag-swing{ animation:tagSwing 1.4s ease .55s forwards; transform-origin:top center; }

      @keyframes flyToBag{ to{ transform:translate(var(--dx), var(--dy)) scale(.35) rotate(20deg); opacity:.15; } }
      .fly-tag{ position:fixed; z-index:70; pointer-events:none; animation:flyToBag .7s cubic-bezier(.3,.6,.35,1) forwards; }

      .festive-border{ background-image:
          repeating-linear-gradient(45deg, var(--mustard) 0 6px, transparent 6px 16px),
          repeating-linear-gradient(-45deg, var(--oxblood) 0 6px, transparent 6px 16px);
        background-position: top, bottom; background-repeat:repeat-x; background-size:100% 6px;
        background-color:var(--ink); }

      @keyframes peacockFan{ 0%{ transform:scale(0.15) rotate(-10deg); opacity:0; } 55%{ opacity:1; } 100%{ transform:scale(1) rotate(0deg); opacity:1; } }
      @keyframes peacockSway{ 0%,100%{ transform:rotate(-1.5deg); } 50%{ transform:rotate(1.5deg); } }

      @keyframes sparkleTwinkle{ 0%,100%{ opacity:0; transform:translateY(0) scale(0.6); } 50%{ opacity:1; transform:translateY(-10px) scale(1); } }
      .sparkle-dot{ position:absolute; border-radius:999px; background:var(--mustard);
        box-shadow:0 0 6px 1px var(--mustard); animation:sparkleTwinkle 4s ease-in-out infinite; }

      @keyframes curtainLeft{ 0%{ transform:translateX(0); } 100%{ transform:translateX(-102%); } }
      @keyframes curtainRight{ 0%{ transform:translateX(0); } 100%{ transform:translateX(102%); } }
      .curtain-panel{ position:fixed; top:0; bottom:0; width:50%; z-index:200;
        background:linear-gradient(120deg, var(--ink) 0%, #2A1740 45%, var(--oxblood) 100%);
        box-shadow: inset 0 0 80px rgba(0,0,0,0.5); }
      .curtain-left{ left:0; animation:curtainLeft 1s cubic-bezier(.6,0,.2,1) 0.5s forwards; }
      .curtain-right{ right:0; animation:curtainRight 1s cubic-bezier(.6,0,.2,1) 0.5s forwards; }
      .curtain-panel::after{ content:''; position:absolute; top:0; bottom:0; width:6px; background:var(--mustard); opacity:0.6; }
      .curtain-left::after{ right:0; }
      .curtain-right::after{ left:0; }
      .curtain-seal{ position:fixed; top:50%; left:50%; transform:translate(-50%,-50%); z-index:201;
        animation:sealFade 1.5s ease forwards; }
      @keyframes sealFade{ 0%{ opacity:1; transform:translate(-50%,-50%) scale(1); } 60%{ opacity:1; transform:translate(-50%,-50%) scale(1.08); }
        100%{ opacity:0; transform:translate(-50%,-50%) scale(1.15); } }

      @media (prefers-reduced-motion: reduce){
        .tag-card{ transition:none; } .tag-card:hover{ transform:none; }
        .stitch-letter{ animation:none; opacity:1; }
        .reveal{ transition:none; opacity:1; transform:none; }
        .swing-tag-drop, .swing-tag-swing{ animation:none; }
        .fly-tag{ display:none; }
        .sparkle-dot{ animation:none; opacity:0.6; }
        .curtain-panel, .curtain-seal{ display:none; }
      }
    `}</style>
  );
}
