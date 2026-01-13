import React from 'react';
import { StatusTag } from '@/types/database';

interface StatusBadgesProps {
  tags?: StatusTag[];
  size?: 'sm' | 'md';
  className?: string;
}

export const StatusBadges: React.FC<StatusBadgesProps> = ({ 
  tags = [], 
  size = 'sm',
  className = '' 
}) => {
  if (!tags || tags.length === 0) return null;

  const sizeClasses = size === 'sm' 
    ? 'px-1.5 py-0.5 text-[10px] sm:text-xs' 
    : 'px-2 py-1 text-xs sm:text-sm';

  return (
    <div className={`flex flex-wrap gap-1 ${className}`}>
      {tags.map((tag) => (
        <span
          key={tag.id}
          className={`rounded font-semibold text-white shadow-sm ${sizeClasses}`}
          style={{ backgroundColor: tag.color }}
        >
          {tag.name}
        </span>
      ))}
    </div>
  );
};
