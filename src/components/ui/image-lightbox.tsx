import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, X, ZoomIn, ZoomOut, Play } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ImageLightboxProps {
  images: string[];
  initialIndex?: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const isVideo = (url: string) => url.match(/\.(mp4|webm|ogg|mov)$/i);

export const ImageLightbox: React.FC<ImageLightboxProps> = ({
  images,
  initialIndex = 0,
  open,
  onOpenChange
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [zoom, setZoom] = useState(1);

  useEffect(() => {
    if (open) {
      setCurrentIndex(initialIndex);
      setZoom(1);
    }
  }, [open, initialIndex]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!open) return;
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
      if (e.key === 'Escape') onOpenChange(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, currentIndex]);

  const next = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
    setZoom(1);
  };

  const prev = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    setZoom(1);
  };

  const toggleZoom = () => {
    setZoom((prev) => (prev === 1 ? 2 : 1));
  };

  const currentImage = images[currentIndex];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] max-h-[95vh] p-0 bg-black/95 border-none overflow-hidden">
        {/* Close Button */}
        <button
          onClick={() => onOpenChange(false)}
          className="absolute top-4 right-4 z-50 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          aria-label="Close"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Image Counter */}
        {images.length > 1 && (
          <div className="absolute top-4 left-4 z-50 px-3 py-1 rounded-full bg-white/10 text-white text-sm">
            {currentIndex + 1} / {images.length}
          </div>
        )}

        {/* Zoom Button */}
        {!isVideo(currentImage) && (
          <button
            onClick={toggleZoom}
            className="absolute top-4 left-1/2 -translate-x-1/2 z-50 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            aria-label={zoom === 1 ? 'Zoom in' : 'Zoom out'}
          >
            {zoom === 1 ? <ZoomIn className="w-5 h-5" /> : <ZoomOut className="w-5 h-5" />}
          </button>
        )}

        {/* Main Content */}
        <div className="relative w-full h-[90vh] flex items-center justify-center overflow-auto">
          {isVideo(currentImage) ? (
            <video
              src={currentImage}
              className="max-w-full max-h-full object-contain"
              controls
              autoPlay
              playsInline
            />
          ) : (
            <img
              src={currentImage}
              alt={`Image ${currentIndex + 1}`}
              className={cn(
                "max-w-full max-h-full object-contain transition-transform duration-300 cursor-zoom-in",
                zoom > 1 && "cursor-zoom-out scale-150"
              )}
              onClick={toggleZoom}
              style={{ transform: `scale(${zoom})` }}
            />
          )}
        </div>

        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-8 h-8" />
            </button>
            <button
              onClick={next}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              aria-label="Next image"
            >
              <ChevronRight className="w-8 h-8" />
            </button>
          </>
        )}

        {/* Thumbnail Strip */}
        {images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-50 flex gap-2 p-2 rounded-lg bg-black/50 backdrop-blur max-w-[80vw] overflow-x-auto">
            {images.map((img, index) => (
              <button
                key={index}
                onClick={() => {
                  setCurrentIndex(index);
                  setZoom(1);
                }}
                className={cn(
                  "flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all",
                  index === currentIndex
                    ? "border-white ring-2 ring-white/50"
                    : "border-transparent opacity-60 hover:opacity-100"
                )}
              >
                {isVideo(img) ? (
                  <div className="w-full h-full bg-muted flex items-center justify-center">
                    <Play className="w-6 h-6 text-white" />
                  </div>
                ) : (
                  <img src={img} alt="" className="w-full h-full object-cover" />
                )}
              </button>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ImageLightbox;
