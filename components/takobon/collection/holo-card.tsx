"use client";

import { useEffect, useState } from "react";
import Tilt from "react-parallax-tilt";

function useGyroPermission() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const DevOri = DeviceOrientationEvent as unknown as {
      requestPermission?: () => Promise<string>;
    };

    if (typeof DevOri.requestPermission !== "function") {
      // Android or desktop — no permission needed
      setEnabled(true);
      return;
    }

    // iOS 13+: request on first user interaction
    const request = async () => {
      try {
        const result = await DevOri.requestPermission!();
        if (result === "granted") setEnabled(true);
      } catch {
        // silently ignore if called outside gesture
      }
      document.removeEventListener("touchstart", request);
    };

    document.addEventListener("touchstart", request, { once: true });
    return () => document.removeEventListener("touchstart", request);
  }, []);

  return enabled;
}

export function HoloCard({ children, className }: { children: React.ReactNode; className?: string }) {
  const gyro = useGyroPermission();

  return (
    <Tilt
      tiltMaxAngleX={12}
      tiltMaxAngleY={12}
      perspective={800}
      transitionSpeed={400}
      scale={1.03}
      glareEnable={false}
      gyroscope={gyro}
      className={className}
    >
      {children}
    </Tilt>
  );
}
