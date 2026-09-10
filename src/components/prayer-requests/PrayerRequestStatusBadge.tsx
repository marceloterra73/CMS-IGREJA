import React from 'react';
import { PrayerRequestStatus } from '../../types';
import { getPrayerStatusLabel } from './prayerRequestsUtils';

interface PrayerRequestStatusBadgeProps {
  status: PrayerRequestStatus;
  size?: 'sm' | 'md';
}

export const PrayerRequestStatusBadge: React.FC<PrayerRequestStatusBadgeProps> = ({
  status,
  size = 'md',
}) => {
  const isSmall = size === 'sm';

  const config = {
    pending: {
      label: getPrayerStatusLabel('pending'),
      bg: 'bg-amber-50/90 text-amber-800 border-amber-200/80',
      dot: 'bg-amber-500',
    },
    praying: {
      label: getPrayerStatusLabel('praying'),
      bg: 'bg-sky-50/90 text-sky-800 border-sky-200/80',
      dot: 'bg-sky-500',
    },
    answered: {
      label: getPrayerStatusLabel('answered'),
      bg: 'bg-emerald-50/90 text-emerald-800 border-emerald-200/80',
      dot: 'bg-emerald-500',
    },
    archived: {
      label: getPrayerStatusLabel('archived'),
      bg: 'bg-stone-100/90 text-stone-600 border-stone-200',
      dot: 'bg-stone-400',
    },
  }[status] || {
    label: status,
    bg: 'bg-stone-100 text-stone-600 border-stone-200',
    dot: 'bg-stone-400',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-semibold rounded-full border backdrop-blur-xs transition-colors shadow-2xs whitespace-nowrap ${
        isSmall ? 'text-[10px] px-2 py-0.5' : 'text-xs px-2.5 py-1'
      } ${config.bg}`}
    >
      <span className={`rounded-full shrink-0 ${isSmall ? 'w-1.5 h-1.5' : 'w-2 h-2'} ${config.dot}`} />
      <span>{config.label}</span>
    </span>
  );
};
