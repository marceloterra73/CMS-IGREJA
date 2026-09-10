import React from 'react';
import {
  FileText,
  Newspaper,
  Calendar,
  Video,
  Image as ImageIcon,
  CheckSquare,
  ArrowUpRight,
  Layers,
} from 'lucide-react';
import { NavigationKey } from '../layout/Sidebar';

interface ContentOverviewProps {
  onNavigate: (section: NavigationKey) => void;
}

interface ContentCategoryItem {
  id: string;
  label: string;
  count: number;
  section: NavigationKey;
  icon: React.ElementType;
  colorClass: string;
  barColor: string;
  badgeBg: string;
}

const CONTENT_ITEMS: ContentCategoryItem[] = [
  {
    id: 'content-pages',
    label: 'Páginas',
    count: 12,
    section: 'pages',
    icon: FileText,
    colorClass: 'text-blue-600',
    barColor: 'bg-blue-500',
    badgeBg: 'bg-blue-50 text-blue-700 border-blue-200',
  },
  {
    id: 'content-news',
    label: 'Notícias',
    count: 19,
    section: 'news',
    icon: Newspaper,
    colorClass: 'text-stone-600',
    barColor: 'bg-stone-500',
    badgeBg: 'bg-stone-100 text-stone-700 border-stone-200',
  },
  {
    id: 'content-events',
    label: 'Eventos',
    count: 8,
    section: 'events',
    icon: Calendar,
    colorClass: 'text-amber-600',
    barColor: 'bg-amber-500',
    badgeBg: 'bg-amber-50 text-amber-700 border-amber-200',
  },
  {
    id: 'content-sermons',
    label: 'Sermões',
    count: 42,
    section: 'sermons',
    icon: Video,
    colorClass: 'text-red-600',
    barColor: 'bg-red-500',
    badgeBg: 'bg-red-50 text-red-700 border-red-200',
  },
  {
    id: 'content-media',
    label: 'Mídia',
    count: 156,
    section: 'media',
    icon: ImageIcon,
    colorClass: 'text-purple-600',
    barColor: 'bg-purple-500',
    badgeBg: 'bg-purple-50 text-purple-700 border-purple-200',
  },
  {
    id: 'content-forms',
    label: 'Formulários',
    count: 24,
    section: 'forms',
    icon: CheckSquare,
    colorClass: 'text-emerald-600',
    barColor: 'bg-emerald-500',
    badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  },
];

export const ContentOverview: React.FC<ContentOverviewProps> = ({ onNavigate }) => {
  const totalCount = CONTENT_ITEMS.reduce((sum, item) => sum + item.count, 0);

  return (
    <div
      id="content-overview-panel"
      className="bg-white p-5 rounded-xl border border-stone-200 shadow-xs"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-stone-100 text-stone-700 flex items-center justify-center">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-stone-900 tracking-tight">
              Visão Geral de Conteúdo
            </h2>
            <p className="text-xs text-stone-500">
              Distribuição dos itens cadastrados no site
            </p>
          </div>
        </div>

        <div className="inline-flex items-center gap-2 self-start sm:self-auto">
          <span className="text-xs font-semibold text-stone-700 bg-stone-100 px-2.5 py-1 rounded-full border border-stone-200">
            {totalCount} itens no total
          </span>
        </div>
      </div>

      {/* Barra de distribuição proporcional */}
      <div className="mb-5">
        <div className="h-2.5 w-full rounded-full bg-stone-100 overflow-hidden flex shadow-inner">
          {CONTENT_ITEMS.map((item) => {
            const percentage = Math.round((item.count / totalCount) * 100);
            return (
              <div
                key={item.id}
                style={{ width: `${(item.count / totalCount) * 100}%` }}
                className={`${item.barColor} transition-all duration-300 hover:opacity-80`}
                title={`${item.label}: ${item.count} (${percentage}%)`}
              />
            );
          })}
        </div>
      </div>

      {/* Grid com os 6 itens de conteúdo */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {CONTENT_ITEMS.map((item) => {
          const Icon = item.icon;
          const percentage = Math.round((item.count / totalCount) * 100);

          return (
            <button
              key={item.id}
              id={item.id}
              type="button"
              onClick={() => onNavigate(item.section)}
              className="p-3 rounded-lg border border-stone-200 bg-stone-50/60 hover:bg-white hover:border-stone-300 hover:shadow-xs transition-all text-left flex flex-col justify-between group"
            >
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-1.5">
                  <Icon className={`w-3.5 h-3.5 ${item.colorClass}`} />
                  <span className="text-xs font-semibold text-stone-900 truncate">
                    {item.label}
                  </span>
                </div>
                <ArrowUpRight className="w-3 h-3 text-stone-400 group-hover:text-stone-700 transition-colors" />
              </div>

              <div className="mt-3 flex items-baseline justify-between">
                <span className="text-lg font-bold text-stone-900 tracking-tight">
                  {item.count}
                </span>
                <span className="text-[11px] font-medium text-stone-400">
                  {percentage}%
                </span>
              </div>

              {/* Mini barra de progresso individual */}
              <div className="mt-2 h-1 w-full bg-stone-200 rounded-full overflow-hidden">
                <div
                  className={`h-full ${item.barColor}`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
