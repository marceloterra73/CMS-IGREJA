import React from 'react';

interface SettingsSectionCardProps {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  badge?: string;
  children: React.ReactNode;
}

export const SettingsSectionCard: React.FC<SettingsSectionCardProps> = ({
  id,
  title,
  subtitle,
  icon,
  badge,
  children,
}) => {
  return (
    <section
      id={id}
      className="bg-white rounded-xl border border-stone-200 shadow-xs overflow-hidden transition-all"
    >
      <div className="px-5 py-4 border-b border-stone-100 flex items-center justify-between gap-3 bg-stone-50/50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-stone-100 text-stone-700 flex items-center justify-center shrink-0 border border-stone-200">
            {icon}
          </div>
          <div>
            <h2 className="text-sm font-bold text-stone-900 tracking-tight">{title}</h2>
            <p className="text-xs text-stone-500">{subtitle}</p>
          </div>
        </div>

        {badge && (
          <span className="text-[11px] font-semibold text-stone-600 bg-stone-100 border border-stone-200 px-2 py-0.5 rounded-md">
            {badge}
          </span>
        )}
      </div>

      <div className="p-5 sm:p-6 space-y-5">{children}</div>
    </section>
  );
};
