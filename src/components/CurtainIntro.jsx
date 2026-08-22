import React, { useState, useEffect } from "react";
import { Crest } from "./BrandDecorations";

export default function CurtainIntro() {
  const [show, setShow] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setShow(false), 1600);
    return () => clearTimeout(t);
  }, []);
  if (!show) return null;
  return (
    <>
      <div className="curtain-panel curtain-left" />
      <div className="curtain-panel curtain-right" />
      <div className="curtain-seal">
        <Crest size={70} showBanner={false} />
      </div>
    </>
  );
}
