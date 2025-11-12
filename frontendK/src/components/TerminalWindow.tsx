import { useEffect, useRef } from "react";

interface TerminalLine {
  text: string;
  type?: "success" | "error" | "warning" | "info";
}

interface TerminalWindowProps {
  lines: TerminalLine[];
  isActive?: boolean;
  isComputing?: boolean;
}

export const TerminalWindow = ({
  lines,
  isActive = true,
  isComputing = false,
}: TerminalWindowProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll when new lines arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [lines]);

  const getLineColor = (type?: string) => {
    switch (type) {
      case "success":
        return "text-green-400";
      case "error":
        return "text-red-400";
      case "warning":
        return "text-yellow-400";
      case "info":
        return "text-blue-400";
      default:
        return "text-gray-200";
    }
  };

  return (
    <div className="glass-strong rounded-lg overflow-hidden">
      {/* Terminal Header */}
      <div className="bg-card/20 border-b border-glass-border/20 px-4 py-2 flex items-center space-x-2">
        <div className="flex space-x-2">
          <div className="w-3 h-3 rounded-full bg-red-500/80" />
          <div className="w-3 h-3 rounded-full bg-yellow-400/80" />
          <div className="w-3 h-3 rounded-full bg-green-500/80" />
        </div>
        <span className="text-xs text-muted-foreground ml-4">
          Terminal Output
        </span>
      </div>

      {/* Terminal Content */}
      <div
        ref={scrollRef}
        className="bg-background/50 p-4 font-mono text-sm h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-accent/50 scrollbar-track-transparent"
      >
        {lines.map((line, index) => (
          <div key={index} className={`mb-1 ${getLineColor(line.type)}`}>
            <span className="text-accent mr-2">$</span>
            {line.text}
          </div>
        ))}

        {/* Cursor animation */}
        {isActive && !isComputing && (
          <span className="inline-block w-2 h-4 bg-accent animate-pulse ml-1" />
        )}
        {isComputing && (
          <div className="text-accent/70 animate-pulse mt-2">⏳ Computing...</div>
        )}
      </div>
    </div>
  );
};
