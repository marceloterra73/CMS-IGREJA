import React from 'react';
import { LeaderStatus } from '../../types';
import { getLeaderStatusLabel } from './leadersUtils';

interface LeaderStatusBadgeProps {
  status: LeaderStatus;
  size?: 'sm' | 'md';
}

export const LeaderStatusBadge: React.FC<LeaderStatusBadgeProps> = ({
  status,
  size = 'md',
}) => {
  const isSmall = size === 'sm';
  const label = getLeaderStatusLabel(status);

  const config = {
    active: {
      bg: 'bg-emerald-50/90 text-emerald-700 border-emerald-200/80',
      dot: 'bg-emerald-500',
    },
    inactive: {
      bg: 'bg-stone-100/90 text-stone-600 border-stone-200',
      dot: 'bg-stone-400',
    },
  }[status] || {
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
      <span>{label}</span>
    </span>
  );
};
