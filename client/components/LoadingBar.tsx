import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export const LoadingBar: React.FC = () => {
  const location = useLocation();
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Start progress when location changes
    setProgress(10);
    setIsVisible(true);

    // Increment progress gradually
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev < 90) {
          return prev + Math.random() * 20;
        }
        return prev;
      });
    }, 200);

    // Complete progress after a delay
    const timeout = setTimeout(() => {
      setProgress(100);
      setTimeout(() => {
        setIsVisible(false);
        setProgress(0);
      }, 300);
    }, 800);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [location.pathname]);

  return (
    <div
      className={`fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-600 to-red-500 transition-all duration-300 z-40 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
      style={{
        width: `${progress}%`,
      }}
    />
  );
};

export default LoadingBar;
