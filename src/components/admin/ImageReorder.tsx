import React, { useState } from 'react';
import { X, GripVertical, Video, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ImageReorderProps {
  images: string[];
  onReorder: (images: string[]) => void;
  onRemove: (index: number) => void;
  maxMedia?: number;
}

const isVideo = (url: string) => url.match(/\.(mp4|webm|ogg|mov)$/i);

export const ImageReorder: React.FC<ImageReorderProps> = ({
  images,
  onReorder,
  onRemove,
  maxMedia = 4
}) => {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;
    setDragOverIndex(index);
  };

  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === dropIndex) return;

    const newImages = [...images];
    const [draggedItem] = newImages.splice(draggedIndex, 1);
    newImages.splice(dropIndex, 0, draggedItem);
    
    onReorder(newImages);
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const moveToMain = (index: number) => {
    if (index === 0) return;
    const newImages = [...images];
    const [item] = newImages.splice(index, 1);
    newImages.unshift(item);
    onReorder(newImages);
  };

  if (images.length === 0) return null;

  return (
    <div className="space-y-2">
      <p className="text-xs text-muted-foreground">Drag to reorder. First image is the main image.</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {images.map((url, index) => (
          <div
            key={`${url}-${index}`}
            draggable
            onDragStart={(e) => handleDragStart(e, index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, index)}
            onDragEnd={handleDragEnd}
            className={`relative group aspect-square rounded-lg overflow-hidden border-2 bg-secondary cursor-move transition-all ${
              draggedIndex === index ? 'opacity-50 scale-95' : ''
            } ${
              dragOverIndex === index ? 'border-primary ring-2 ring-primary/30' : 'border-transparent'
            }`}
          >
            {/* Drag Handle */}
            <div className="absolute top-1 left-1 z-10 bg-black/60 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
              <GripVertical className="w-3 h-3" />
            </div>

            {/* Media Preview */}
            {isVideo(url) ? (
              <div className="w-full h-full flex items-center justify-center bg-muted">
                <Video className="w-8 h-8 text-muted-foreground" />
                <span className="absolute bottom-1 left-1 text-xs bg-black/60 text-white px-1 rounded">Video</span>
              </div>
            ) : (
              <img src={url} alt={`Media ${index + 1}`} className="w-full h-full object-cover" />
            )}

            {/* Remove Button */}
            <button
              type="button"
              onClick={() => onRemove(index)}
              className="absolute top-1 right-1 bg-destructive text-destructive-foreground p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="w-3 h-3" />
            </button>

            {/* Main Badge or Set as Main Button */}
            {index === 0 ? (
              <span className="absolute bottom-1 right-1 text-xs bg-primary text-primary-foreground px-1.5 py-0.5 rounded flex items-center gap-1">
                <Star className="w-3 h-3" /> Main
              </span>
            ) : (
              <button
                type="button"
                onClick={() => moveToMain(index)}
                className="absolute bottom-1 right-1 text-xs bg-black/70 hover:bg-primary text-white px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-all"
              >
                Set Main
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageReorder;
