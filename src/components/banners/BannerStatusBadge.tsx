import React from 'react';
import { CheckCircle, XCircle } from 'lucide-react';
import { BannerStatus } from '../../types';
import { getBannerStatusLabel } from './bannersUtils';

interface BannerStatusBadgeProps {
  status: BannerStatus;
  size?: 'sm' | 'md';
}

export const BannerStatusBadge: React.FC<BannerStatusBadgeProps> = ({
  status,
  size = 'sm',
}) => {
  const label = getBannerStatusLabel(status);
  const isActive = status === 'active';

  const sizeClasses =
    size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs';
  const iconSize = size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5';

  if (isActive) {
    return (
      <span
        className={`inline-flex items-center gap-1 font-semibold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/80 ${sizeClasses}`}
        title="Banner ativo e visível na congregação"
      >
        <CheckCircle className={`${iconSize} text-emerald-600 shrink-0`} />
        <span>{label}</span>
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1 font-semibold rounded-full bg-stone-100 text-stone-600 border border-stone-200 ${sizeClasses}`}
      title="Banner inativo ou arquivado"
    >
      <XCircle className={`${iconSize} text-stone-400 shrink-0`} />
      <span>{label}</span>
    </span>
  );
};
