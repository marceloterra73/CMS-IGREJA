import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  id: string;
  title: string;
  value: string | number;
  description: string;
  icon: LucideIcon;
  iconBgColor?: string;
  iconColor?: string;
  trend?: string;
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  id,
  title,
  value,
  description,
  icon: Icon,
  iconBgColor = 'bg-stone-100',
  iconColor = 'text-stone-700',
  trend,
  onClick,
}) => {
  return (
    <div
      id={id}
      onClick={onClick}
      className={`
        bg-white p-5 rounded-xl border border-stone-200 shadow-xs transition-all
        ${onClick ? 'cursor-pointer hover:border-stone-300 hover:shadow-sm' : ''}
      `}
    >
      <div className="flex items-start justify-between">
        <div>
          <span className="text-xs font-medium text-stone-500 uppercase tracking-wider">
            {title}
          </span>
          <div className="text-2xl font-bold text-stone-900 mt-1 tracking-tight">
            {value}
          </div>
        </div>

        <div className={`w-10 h-10 rounded-lg ${iconBgColor} ${iconColor} flex items-center justify-center shrink-0`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
        <span className="text-stone-600 truncate">{description}</span>
        {trend && (
          <span className="font-medium text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded text-[11px] shrink-0">
            {trend}
          </span>
        )}
      </div>
    </div>
  );
};
