import React from 'react';
import { CheckCircle2, Clock, Archive } from 'lucide-react';
import { PageStatus } from '../../types';

interface PageStatusBadgeProps {
  status: PageStatus;
  size?: 'sm' | 'md';
}

export const PageStatusBadge: React.FC<PageStatusBadgeProps> = ({ status, size = 'md' }) => {
  const isSmall = size === 'sm';

  switch (status) {
    case 'published':
      return (
        <span
          className={`inline-flex items-center gap-1 font-semibold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/80 ${
            isSmall ? 'text-[10px] px-2 py-0.5' : 'text-xs px-2.5 py-1'
          }`}
          title="Página publicada e acessível publicamente"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>Publicada</span>
        </span>
      );

    case 'draft':
      return (
        <span
          className={`inline-flex items-center gap-1 font-semibold rounded-full bg-amber-50 text-amber-700 border border-amber-200/80 ${
            isSmall ? 'text-[10px] px-2 py-0.5' : 'text-xs px-2.5 py-1'
          }`}
          title="Rascunho visível apenas para administradores"
        >
          <Clock className={isSmall ? 'w-3 h-3 text-amber-600' : 'w-3.5 h-3.5 text-amber-600'} />
          <span>Rascunho</span>
        </span>
      );

    case 'archived':
      return (
        <span
          className={`inline-flex items-center gap-1 font-semibold rounded-full bg-stone-100 text-stone-600 border border-stone-200 ${
            isSmall ? 'text-[10px] px-2 py-0.5' : 'text-xs px-2.5 py-1'
          }`}
          title="Página arquivada (fora do ar)"
        >
          <Archive className={isSmall ? 'w-3 h-3 text-stone-500' : 'w-3.5 h-3.5 text-stone-500'} />
          <span>Arquivada</span>
        </span>
      );

    default:
      return null;
  }
};
