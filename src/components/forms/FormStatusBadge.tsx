import React from 'react';
import { FormStatus } from '../../types';
import { getFormStatusLabel } from './formsUtils';

interface FormStatusBadgeProps {
  status: FormStatus;
}

export const FormStatusBadge: React.FC<FormStatusBadgeProps> = ({ status }) => {
  const getBadgeStyle = () => {
    switch (status) {
      case 'active':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'draft':
        return 'bg-stone-100 text-stone-700 border-stone-200';
      case 'archived':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      default:
        return 'bg-stone-100 text-stone-700 border-stone-200';
    }
  };

  const getDotStyle = () => {
    switch (status) {
      case 'active':
        return 'bg-emerald-500';
      case 'draft':
        return 'bg-stone-400';
      case 'archived':
        return 'bg-amber-500';
      default:
        return 'bg-stone-400';
    }
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${getBadgeStyle()}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${getDotStyle()}`} />
      {getFormStatusLabel(status)}
    </span>
  );
};
