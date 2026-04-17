"use client";

import { useRef, useCallback } from "react";
import Tilt from "react-parallax-tilt";

interface HoloCardProps {
  children: React.ReactNode;
  className?: string;
  /** 0–1, how strong the holo shimmer is. Default 0.6 */
  intensity?: number;
}

export function HoloCard({ children, className, intensity = 0.6 }: HoloCardProps) {
  const glareRef = useRef<HTMLDivElement>(null);
  const shineRef = useRef<HTMLDivElement>(null);

  const handleMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;   // 0→1
      const y = (e.clientY - rect.top) / rect.height;    // 0→1

      if (shineRef.current) {
        // Holo rainbow: move a conic-gradient based on pointer
        const hue = Math.round(x * 360);
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
    <Tilt
      tiltMaxAngleX={12}
      tiltMaxAngleY={12}
      perspective={800}
      transitionSpeed={400}
      scale={1.03}
      glareEnable={false}
      className={className}
    >
      <div
        className="relative w-full h-full"
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
        style={{ transformStyle: "preserve-3d" }}
      >
        {children}

        {/* Holographic shimmer layer */}
        <div
          ref={shineRef}
          className="pointer-events-none absolute inset-0 rounded-[inherit] transition-opacity duration-300"
          style={{
            opacity: 0,
            mixBlendMode: "color-dodge",
            zIndex: 10,
          }}
        />

        {/* Specular glare layer */}
        <div
          ref={glareRef}
          className="pointer-events-none absolute inset-0 rounded-[inherit]"
          style={{
            zIndex: 11,
          }}
        />
      </div>
    </Tilt>
  );
}
