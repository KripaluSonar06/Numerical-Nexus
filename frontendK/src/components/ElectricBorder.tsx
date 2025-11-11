import React, {
  CSSProperties,
  PropsWithChildren,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
} from "react";

type ElectricBorderProps = PropsWithChildren<{
  color?: string;
  speed?: number;
  chaos?: number;
  thickness?: number;
  className?: string;
  style?: CSSProperties;
}>;

function hexToRgba(hex: string, alpha = 1): string {
  if (!hex) return `rgba(0,0,0,${alpha})`;
  let h = hex.replace("#", "");
  if (h.length === 3) h = h.split("").map((c) => c + c).join("");
  const int = parseInt(h, 16);
  const r = (int >> 16) & 255;
  const g = (int >> 8) & 255;
  const b = int & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

const ElectricBorder: React.FC<ElectricBorderProps> = ({
  children,
  color = "#5227FF",
  speed = 1,
  chaos = 1,
  thickness = 2,
  className,
  style,
}) => {
  const rawId = useId().replace(/[:]/g, "");
  const filterId = `turbulent-displace-${rawId}`;
  const svgRef = useRef<SVGSVGElement | null>(null);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const strokeRef = useRef<HTMLDivElement | null>(null);

  const updateAnim = () => {
    const svg = svgRef.current;
    const host = rootRef.current;
    if (!svg || !host) return;

    if (strokeRef.current)
      strokeRef.current.style.filter = `url(#${filterId})`;

    const width = host.clientWidth || 0;
    const height = host.clientHeight || 0;
    const dyAnims = Array.from(
      svg.querySelectorAll<SVGAnimateElement>(
        'feOffset > animate[attributeName="dy"]'
      )
    );
    const dxAnims = Array.from(
      svg.querySelectorAll<SVGAnimateElement>(
        'feOffset > animate[attributeName="dx"]'
      )
    );
    if (dyAnims.length >= 2) {
      dyAnims[0].setAttribute("values", `${height};0`);
      dyAnims[1].setAttribute("values", `0;-${height}`);
    }
    if (dxAnims.length >= 2) {
      dxAnims[0].setAttribute("values", `${width};0`);
      dxAnims[1].setAttribute("values", `0;-${width}`);
    }
    const dur = 6 / (speed || 1);
    [...dyAnims, ...dxAnims].forEach((a) =>
      a.setAttribute("dur", `${dur}s`)
    );

    const disp = svg.querySelector("feDisplacementMap");
    if (disp) disp.setAttribute("scale", String(30 * (chaos || 1)));

    requestAnimationFrame(() =>
      [...dyAnims, ...dxAnims].forEach((a: any) => a.beginElement?.())
    );
  };

  useEffect(() => updateAnim(), [speed, chaos]);

  useLayoutEffect(() => {
    if (!rootRef.current) return;
    const ro = new ResizeObserver(() => updateAnim());
    ro.observe(rootRef.current);
    updateAnim();
    return () => ro.disconnect();
  }, []);

  const inheritRadius: CSSProperties = {
    borderRadius: style?.borderRadius ?? "inherit",
  };

  const strokeStyle: CSSProperties = {
    ...inheritRadius,
    borderWidth: thickness,
    borderStyle: "solid",
    borderColor: color,
  };
  const glow1Style: CSSProperties = {
    ...inheritRadius,
    borderWidth: thickness,
    borderStyle: "solid",
    borderColor: hexToRgba(color, 0.6),
    filter: `blur(${0.5 + thickness * 0.25}px)`,
    opacity: 0.5,
  };
  const glow2Style: CSSProperties = {
    ...inheritRadius,
    borderWidth: thickness,
    borderStyle: "solid",
    borderColor: color,
    filter: `blur(${2 + thickness * 0.5}px)`,
    opacity: 0.5,
  };
  const bgGlowStyle: CSSProperties = {
    ...inheritRadius,
    transform: "scale(1.08)",
    filter: "blur(32px)",
    opacity: 0.3,
    zIndex: -1,
    background: `linear-gradient(-30deg, ${hexToRgba(
      color,
      0.8
    )}, transparent, ${color})`,
  };

  return (
    <div ref={rootRef} className={`relative isolate ${className ?? ""}`} style={style}>
      {/* SVG turbulence filter */}
      <svg
        ref={svgRef}
        className="fixed -left-[10000px] -top-[10000px] w-[10px] h-[10px] opacity-[0.001] pointer-events-none"
        aria-hidden
      >
        <defs>
          <filter id={filterId} colorInterpolationFilters="sRGB">
            <feTurbulence type="turbulence" baseFrequency="0.02" numOctaves="10" result="noise1" seed="1" />
            <feOffset in="noise1" dx="0" dy="0" result="offsetNoise1">
              <animate attributeName="dy" values="700;0" dur="6s" repeatCount="indefinite" />
            </feOffset>

            <feTurbulence type="turbulence" baseFrequency="0.02" numOctaves="10" result="noise2" seed="2" />
            <feOffset in="noise2" dx="0" dy="0" result="offsetNoise2">
              <animate attributeName="dy" values="0;-700" dur="6s" repeatCount="indefinite" />
            </feOffset>

            <feComposite in="offsetNoise1" in2="offsetNoise2" operator="arithmetic" k2="0.5" k3="0.5" result="combined" />
            <feDisplacementMap in="SourceGraphic" in2="combined" scale="30" />
          </filter>
        </defs>
      </svg>

      {/* Border layers */}
      <div className="absolute inset-0 pointer-events-none" style={inheritRadius}>
        <div ref={strokeRef} className="absolute inset-0 box-border" style={strokeStyle} />
        <div className="absolute inset-0 box-border" style={glow1Style} />
        <div className="absolute inset-0 box-border" style={glow2Style} />
        <div className="absolute inset-0" style={bgGlowStyle} />
      </div>

      <div className="relative" style={inheritRadius}>
        {children}
      </div>
    </div>
  );
};

export default ElectricBorder;
