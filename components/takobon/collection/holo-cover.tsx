"use client";

import { useRef, useCallback } from "react";

interface HoloCoverProps {
  children: React.ReactNode;
  intensity?: number;
}

export function HoloCover({ children, intensity = 0.6 }: HoloCoverProps) {
  const shineRef = useRef<HTMLDivElement>(null);
  const glareRef = useRef<HTMLDivElement>(null);

  const handleMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      const hue = Math.round(x * 360);

      if (shineRef.current) {
        shineRef.current.style.backgroundImage = `
          radial-gradient(
            ellipse 80% 80% at ${x * 100}% ${y * 100}%,
            hsla(${hue}, 100%, 70%, ${intensity * 0.55}) 0%,
            hsla(${(hue + 90) % 360}, 100%, 60%, ${intensity * 0.35}) 35%,
            hsla(${(hue + 180) % 360}, 100%, 50%, ${intensity * 0.2}) 65%,
            transparent 100%
          )
        `;
        shineRef.current.style.opacity = "1";
      }

      if (glareRef.current) {
        glareRef.current.style.background = `
          radial-gradient(
            circle at ${x * 100}% ${y * 100}%,
            rgba(255,255,255,0.18) 0%,
            rgba(255,255,255,0.05) 40%,
            transparent 70%
          )
        `;
      }
    },
    [intensity]
  );

  const handleLeave = useCallback(() => {
    if (shineRef.current) shineRef.current.style.opacity = "0";
    if (glareRef.current) glareRef.current.style.background = "transparent";
  }, []);

  return (
    <div
      className="relative w-full h-full"
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
    >
      {children}

      {/* Holographic shimmer — confined to this element only */}
      <div
        ref={shineRef}
        className="pointer-events-none absolute inset-0 rounded-[inherit] transition-opacity duration-300"
        style={{ opacity: 0, mixBlendMode: "color-dodge", zIndex: 10 }}
      />
      <div
        ref={glareRef}
        className="pointer-events-none absolute inset-0 rounded-[inherit]"
        style={{ zIndex: 11 }}
      />
    </div>
  );
}
