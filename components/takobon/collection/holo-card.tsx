"use client";

import Tilt from "react-parallax-tilt";

interface HoloCardProps {
  children: React.ReactNode;
  className?: string;
}

export function HoloCard({ children, className }: HoloCardProps) {
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
      {children}
    </Tilt>
  );
}
