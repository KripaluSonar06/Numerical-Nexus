import React, { useRef, useEffect } from "react";

interface GlareHoverProps {
  glareColor?: string;
  glareOpacity?: number;
  glareAngle?: number;
  glareSize?: number;
  transitionDuration?: number;
  className?: string;
  style?: React.CSSProperties;
}

const GlareHover: React.FC<GlareHoverProps> = ({
  glareColor = "#ffffff",
  glareOpacity = 0.25,
  glareAngle = -30,
  glareSize = 250,
  transitionDuration = 800,
  className = "",
  style = {},
}) => {
  const overlayRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = overlayRef.current;
    if (!el) return;

    el.style.backgroundPosition = "-150% -150%";

    const handleMouseEnter = () => {
      el.style.transition = `background-position ${transitionDuration}ms ease`;
      el.style.backgroundPosition = "150% 150%";
    };

    const handleMouseLeave = () => {
      el.style.transition = `background-position ${transitionDuration}ms ease`;
      el.style.backgroundPosition = "-150% -150%";
    };

    const parent = el.parentElement;
    if (parent) {
      parent.addEventListener("mouseenter", handleMouseEnter);
      parent.addEventListener("mouseleave", handleMouseLeave);
    }

    return () => {
      if (parent) {
        parent.removeEventListener("mouseenter", handleMouseEnter);
        parent.removeEventListener("mouseleave", handleMouseLeave);
      }
    };
  }, [transitionDuration]);

  const hex = glareColor.replace("#", "");
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);
  const rgba = `rgba(${r}, ${g}, ${b}, ${glareOpacity})`;

  return (
    <div
      ref={overlayRef}
      className={`absolute inset-0 rounded-xl pointer-events-none ${className}`}
      style={{
        background: `linear-gradient(${glareAngle}deg, transparent 60%, ${rgba} 75%, transparent 90%)`,
        backgroundSize: `${glareSize}% ${glareSize}%`,
        backgroundRepeat: "no-repeat",
        transition: `background-position ${transitionDuration}ms ease`,
        zIndex: 5,
        ...style,
      }}
    />
  );
};

export default GlareHover;
