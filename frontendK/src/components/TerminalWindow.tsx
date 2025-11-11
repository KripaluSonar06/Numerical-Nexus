import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TerminalLine {
  text: string;
  type?: 'success' | 'error' | 'warning' | 'info';
}

interface TerminalWindowProps {
  lines: TerminalLine[];
  isActive?: boolean;
}

export const TerminalWindow = ({ lines, isActive = true }: TerminalWindowProps) => {
  const [visibleLines, setVisibleLines] = useState<number>(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (lines.length > 0) {
      setVisibleLines(0);
      const timer = setInterval(() => {
        setVisibleLines(prev => {
          if (prev >= lines.length) {
            clearInterval(timer);
            return prev;
          }
          return prev + 1;
        });
      }, 100);
      return () => clearInterval(timer);
    }
  }, [lines]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [visibleLines]);

  const getLineColor = (type?: string) => {
    switch (type) {
      case 'success': return 'text-success';
      case 'error': return 'text-destructive';
      case 'warning': return 'text-yellow-500';
      case 'info': return 'text-accent';
      default: return 'text-foreground';
    }
  };

  return (
    <div className="glass-strong rounded-lg overflow-hidden">
      {/* Terminal Header */}
      <div className="bg-card/20 border-b border-glass-border/20 px-4 py-2 flex items-center space-x-2">
        <div className="flex space-x-2">
          <div className="w-3 h-3 rounded-full bg-destructive/80" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
          <div className="w-3 h-3 rounded-full bg-success/80" />
        </div>
        <span className="text-xs text-muted-foreground ml-4">Terminal Output</span>
      </div>

      {/* Terminal Content */}
      <div 
        ref={scrollRef}
        className="bg-background/50 p-4 font-mono text-sm h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-accent/50 scrollbar-track-transparent"
      >
        <AnimatePresence>
          {lines.slice(0, visibleLines).map((line, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2 }}
              className={`mb-1 ${getLineColor(line.type)}`}
            >
              <span className="text-accent mr-2">$</span>
              {line.text}
            </motion.div>
          ))}
        </AnimatePresence>
        
        {isActive && visibleLines >= lines.length && (
          <motion.span
            animate={{ opacity: [1, 0, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
            className="inline-block w-2 h-4 bg-accent ml-1"
          />
        )}
      </div>
    </div>
  );
};
