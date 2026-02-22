import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

interface Sparkle {
  id: number;
  x: number;
  y: number;
  scale: number;
  opacity: number;
}

export const CursorSparkles: React.FC = () => {
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);
  const sparkleIdRef = useRef(0);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Create container for sparkles if it doesn't exist
    if (!containerRef.current) {
      const container = document.createElement("div");
      container.id = "sparkles-container";
      container.style.pointerEvents = "none";
      document.body.appendChild(container);
      containerRef.current = container;
    }

    return () => {
      // Clean up container on unmount
      if (containerRef.current && containerRef.current.parentNode) {
        containerRef.current.parentNode.removeChild(containerRef.current);
        containerRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Create a new sparkle at random distance from cursor
      const newSparkle: Sparkle = {
        id: sparkleIdRef.current++,
        x: e.clientX + (Math.random() - 0.5) * 30,
        y: e.clientY + (Math.random() - 0.5) * 30,
        scale: Math.random() * 0.5 + 0.5,
        opacity: 1,
      };

      setSparkles((prev) => [...prev, newSparkle].slice(-15));

      // Animate sparkle
      const startTime = Date.now();
      const duration = 600;

      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = elapsed / duration;

        if (progress >= 1) {
          setSparkles((prev) => prev.filter((s) => s.id !== newSparkle.id));
          return;
        }

        setSparkles((prev) =>
          prev.map((s) =>
            s.id === newSparkle.id
              ? {
                  ...s,
                  y: s.y - progress * 30,
                  opacity: Math.max(0, 1 - progress),
                  scale: s.scale * (1 + progress * 0.5),
                }
              : s
          )
        );

        requestAnimationFrame(animate);
      };

      animate();
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  if (!containerRef.current) return null;

  return createPortal(
    <>
      {sparkles.map((sparkle) => (
        <div
          key={sparkle.id}
          style={{
            position: "fixed",
            left: `${sparkle.x}px`,
            top: `${sparkle.y}px`,
            opacity: sparkle.opacity,
            transform: `translate(-50%, -50%) scale(${sparkle.scale})`,
            zIndex: 9999,
            pointerEvents: "none",
          }}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M10 0C10 0 12.5 7.5 20 10C12.5 12.5 10 20 10 20C10 20 7.5 12.5 0 10C7.5 7.5 10 0 10 0Z"
              fill="url(#gradient)"
            />
            <defs>
              <linearGradient
                id="gradient"
                x1="0"
                y1="0"
                x2="20"
                y2="20"
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0%" stopColor="#ef4444" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#dc2626" stopOpacity="0.4" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      ))}
    </>,
    containerRef.current
  );
};

export default CursorSparkles;
