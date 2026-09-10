import React from 'react';
import {
  FileText,
  Video,
  Calendar,
  Image as ImageIcon,
  CheckSquare,
  Search,
  Clock,
  CheckCircle2,
  AlertCircle,
  Sparkles,
} from 'lucide-react';

interface ActivityItem {
  id: string;
  title: string;
  type: string;
  status: 'published' | 'updated' | 'scheduled' | 'added' | 'received' | 'optimized';
  statusLabel: string;
  statusBadgeClass: string;
  timestamp: string;
  author: string;
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
}

const ACTIVITIES: ActivityItem[] = [
  {
    id: 'act-1',
    title: 'Página "Quem Somos" atualizada com nova liderança',
    type: 'Páginas',
    status: 'updated',
    statusLabel: 'Atualizado',
    statusBadgeClass: 'bg-blue-50 text-blue-700 border-blue-200',
    timestamp: 'Hoje, às 10:45',
    author: 'Pr. Alexandre',
    icon: FileText,
    iconBg: 'bg-blue-50',
    iconColor: 'text-blue-700',
  },
  {
    id: 'act-2',
    title: 'Novo sermão "A Força da Fé e a Esperança" publicado no canal',
    type: 'Sermões',
    status: 'published',
    statusLabel: 'Publicado',
    statusBadgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    timestamp: 'Hoje, às 08:30',
    author: 'Equipe de Mídia',
    icon: Video,
    iconBg: 'bg-red-50',
    iconColor: 'text-red-700',
  },
  {
    id: 'act-3',
    title: 'Evento "Conferência Eclesial 2026" cadastrado com inscrições',
    type: 'Eventos',
    status: 'scheduled',
    statusLabel: 'Agendado',
    statusBadgeClass: 'bg-amber-50 text-amber-700 border-amber-200',
    timestamp: 'Ontem, às 16:15',
    author: 'Secretaria',
    icon: Calendar,
    iconBg: 'bg-amber-50',
    iconColor: 'text-amber-700',
  },
  {
    id: 'act-4',
    title: '6 novas fotos de alta resolução adicionadas à Galeria de Batismo',
    type: 'Mídia',
    status: 'added',
    statusLabel: 'Adicionado',
    statusBadgeClass: 'bg-purple-50 text-purple-700 border-purple-200',
    timestamp: 'Ontem, às 11:20',
    author: 'Equipe de Mídia',
    icon: ImageIcon,
    iconBg: 'bg-purple-50',
    iconColor: 'text-purple-700',
  },
  {
    id: 'act-5',
    title: 'Nova mensagem de visitante recebida no formulário "Fale Conosco"',
    type: 'Formulários',
    status: 'received',
    statusLabel: 'Recebido',
    statusBadgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    timestamp: 'Há 2 dias',
    author: 'Visitante (Carlos M.)',
    icon: CheckSquare,
    iconBg: 'bg-emerald-50',
    iconColor: 'text-emerald-700',
  },
  {
    id: 'act-6',
    title: 'Metadados de SEO e Open Graph da página inicial otimizados',
    type: 'SEO',
    status: 'optimized',
    statusLabel: 'Otimizado',
    statusBadgeClass: 'bg-stone-100 text-stone-700 border-stone-200',
    timestamp: 'Há 3 dias',
    author: 'Admin Geral',
    icon: Search,
    iconBg: 'bg-stone-100',
    iconColor: 'text-stone-700',
  },
];

export const RecentActivity: React.FC = () => {
  return (
    <div id="recent-activity-panel" className="bg-white p-5 rounded-xl border border-stone-200 shadow-xs">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-sm font-bold text-stone-900 tracking-tight">
            Conteúdo Recente & Atividade
          </h2>
          <p className="text-xs text-stone-500">
            Últimas modificações realizadas no site da igreja
          </p>
        </div>
        <span className="text-[11px] font-medium text-stone-500 bg-stone-100 px-2 py-0.5 rounded-md border border-stone-200">
          {ACTIVITIES.length} registros
        </span>
      </div>

      <div className="divide-y divide-stone-100">
        {ACTIVITIES.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.id}
              className="py-3.5 first:pt-0 last:pb-0 flex items-start gap-3 group"
            >
              <div
                className={`w-8 h-8 rounded-lg ${item.iconBg} ${item.iconColor} flex items-center justify-center shrink-0 mt-0.5`}
              >
                <Icon className="w-4 h-4" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="text-xs font-semibold text-stone-900 leading-tight group-hover:text-amber-700 transition-colors">
                    {item.title}
                  </div>
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border shrink-0 ${item.statusBadgeClass}`}
                  >
                    {item.statusLabel}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2 mt-1.5 text-[11px] text-stone-500">
                  <span className="font-medium text-stone-700">{item.type}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-stone-400" />
                    {item.timestamp}
                  </span>
                  <span>•</span>
                  <span>Por {item.author}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

