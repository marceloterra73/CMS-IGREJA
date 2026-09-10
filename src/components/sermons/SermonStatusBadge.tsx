import React from 'react';
import { SermonStatus } from '../../types';
import { getSermonStatusLabel } from './sermonsUtils';

interface SermonStatusBadgeProps {
  status: SermonStatus;
  size?: 'sm' | 'md';
}

export const SermonStatusBadge: React.FC<SermonStatusBadgeProps> = ({
  status,
  size = 'sm',
}) => {
  const label = getSermonStatusLabel(status);

  const sizeClasses =
    size === 'sm'
      ? 'text-[11px] px-2 py-0.5 gap-1.5'
      : 'text-xs px-2.5 py-1 gap-2 font-medium';

  switch (status) {
    case 'published':
      return (
        <span
          className={`inline-flex items-center rounded-full font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/80 ${sizeClasses}`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>{label}</span>
        </span>
      );
    case 'draft':
      return (
        <span
          className={`inline-flex items-center rounded-full font-semibold bg-amber-50 text-amber-700 border border-amber-200/80 ${sizeClasses}`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
          <span>{label}</span>
        </span>
      );
    case 'archived':
      return (
        <span
          className={`inline-flex items-center rounded-full font-semibold bg-stone-100 text-stone-600 border border-stone-200 ${sizeClasses}`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-stone-400" />
          <span>{label}</span>
        </span>
      );
    default:
      return (
        <span
          className={`inline-flex items-center rounded-full font-semibold bg-stone-100 text-stone-600 border border-stone-200 ${sizeClasses}`}
        >
          <span>{status}</span>
        </span>
      );
  }
};
