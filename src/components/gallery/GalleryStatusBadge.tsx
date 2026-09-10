import React from 'react';
import { GalleryStatus } from '../../types';
import { CheckCircle2, Archive } from 'lucide-react';
import { getGalleryStatusLabel } from './galleryUtils';

interface GalleryStatusBadgeProps {
  status: GalleryStatus;
  size?: 'sm' | 'md';
}

export const GalleryStatusBadge: React.FC<GalleryStatusBadgeProps> = ({
  status,
  size = 'md',
}) => {
  const isSm = size === 'sm';
  const label = getGalleryStatusLabel(status);

  if (status === 'active') {
    return (
      <span
        id={`gallery-status-badge-${status}`}
        className={`inline-flex items-center gap-1.5 font-medium rounded-full border bg-emerald-50 text-emerald-800 border-emerald-200/70 whitespace-nowrap ${
          isSm ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs'
        }`}
      >
        <CheckCircle2 className={isSm ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
        <span>{label}</span>
      </span>
    );
  }

  return (
    <span
      id={`gallery-status-badge-${status}`}
      className={`inline-flex items-center gap-1.5 font-medium rounded-full border bg-stone-100 text-stone-700 border-stone-200 whitespace-nowrap ${
        isSm ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs'
      }`}
    >
      <Archive className={isSm ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
      <span>{label}</span>
    </span>
  );
};
