import { motion } from 'framer-motion';
import { Download, ZoomIn, ZoomOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

interface ImageViewerProps {
  src: string;
  alt: string;
  filename: string;
}

export const ImageViewer = ({ src, alt, filename }: ImageViewerProps) => {
  const [zoom, setZoom] = useState(100);

  const handleDownload = () => {
    const a = document.createElement('a');
    a.href = src;
    a.download = filename;
    a.click();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-strong rounded-lg overflow-hidden"
    >
      {/* Header with controls */}
      <div className="bg-card/20 border-b border-glass-border/20 px-4 py-3 flex items-center justify-between">
        <span className="text-sm font-medium text-foreground">{filename}</span>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setZoom(Math.max(50, zoom - 10))}
            className="glass"
          >
            <ZoomOut className="w-4 h-4" />
          </Button>
          <span className="text-xs text-muted-foreground min-w-[3rem] text-center">
            {zoom}%
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setZoom(Math.min(200, zoom + 10))}
            className="glass"
          >
            <ZoomIn className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownload}
            className="glass"
          >
            <Download className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Image container */}
      <div className="p-6 bg-background/50 overflow-auto max-h-[500px] scrollbar-thin scrollbar-thumb-accent/50 scrollbar-track-transparent">
        <div className="flex items-center justify-center">
          <img
            src={src}
            alt={alt}
            style={{ width: `${zoom}%` }}
            className="rounded-lg shadow-lg"
          />
        </div>
      </div>
    </motion.div>
  );
};
