import { useEffect, useRef } from "react";

export const CursorEffect: React.FC = () => {
  const cursorRef = useRef<HTMLDivElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    // Create cursor dot
    if (!cursorRef.current) {
      const cursor = document.createElement("div");
      cursor.id = "custom-cursor-effect";
      cursor.style.width = "10px";
      cursor.style.height = "10px";
      cursor.style.borderRadius = "50%";
      cursor.style.backgroundColor = "#ef4444"; // red-500
      cursor.style.position = "fixed";
      cursor.style.pointerEvents = "none";
      cursor.style.opacity = "0";
      cursor.style.zIndex = "99999";
      cursor.style.boxShadow = "0 0 10px rgba(239, 68, 68, 0.8), 0 0 20px rgba(239, 68, 68, 0.4)";
      cursor.style.transition = "opacity 0.15s ease";
      cursor.style.transform = "translate(-50%, -50%)";
      cursor.style.willChange = "transform";
      cursor.style.mixBlendMode = "normal";
      document.body.appendChild(cursor);
      cursorRef.current = cursor;
    }

    const cursor = cursorRef.current;
    if (!cursor) return;

    let mouseX = -100;
    let mouseY = -100;
    let cursorX = -100;
    let cursorY = -100;
    let isVisible = false;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      
      if (!isVisible) {
        cursor.style.opacity = "0.8";
        isVisible = true;
      }
    };

    const animate = () => {
      if (cursor && isVisible) {
        // Smooth follow with slight delay for trailing effect
        cursorX += (mouseX - cursorX) * 0.15;
        cursorY += (mouseY - cursorY) * 0.15;
        
        cursor.style.left = `${cursorX}px`;
        cursor.style.top = `${cursorY}px`;
      }
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    const handleMouseLeave = () => {
      if (cursor) {
        cursor.style.opacity = "0";
        isVisible = false;
      }
    };

    // Start animation loop
    animationFrameRef.current = requestAnimationFrame(animate);

    // Add event listeners
    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      // Cleanup
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      if (cursorRef.current && cursorRef.current.parentNode) {
        cursorRef.current.parentNode.removeChild(cursorRef.current);
        cursorRef.current = null;
      }
    };
  }, []);

  return null;
};

export default CursorEffect;
