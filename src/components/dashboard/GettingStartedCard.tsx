import React from 'react';
import {
  Building2,
  FileText,
  Palette,
  Compass,
  Globe,
  Search,
  CheckCircle2,
  Clock,
  ArrowRight,
  ListChecks,
} from 'lucide-react';
import { NavigationKey } from '../layout/Sidebar';

interface GettingStartedCardProps {
  onNavigate: (section: NavigationKey) => void;
}

interface ChecklistItem {
  id: string;
  title: string;
  description: string;
  section: NavigationKey;
  icon: React.ElementType;
  status: 'completed' | 'in_progress' | 'pending';
  statusLabel: string;
}

const CHECKLIST_ITEMS: ChecklistItem[] = [
  {
    id: 'step-identity',
    title: 'Configurar identidade da igreja',
    description: 'Nome, logotipo, liderança pastoral e contatos',
    section: 'settings',
    icon: Building2,
    status: 'completed',
    statusLabel: 'Concluído',
  },
  {
    id: 'step-page',
    title: 'Criar primeira página',
    description: 'Página inicial com blocos de boas-vindas e cultos',
    section: 'pages',
    icon: FileText,
    status: 'completed',
    statusLabel: 'Concluído',
  },
  {
    id: 'step-appearance',
    title: 'Escolher aparência',
    description: 'Paleta de cores e tipografia contemporânea',
    section: 'appearance',
    icon: Palette,
    status: 'completed',
    statusLabel: 'Concluído',
  },
  {
    id: 'step-navigation',
    title: 'Configurar navegação',
    description: 'Menus de cabeçalho principal e links de rodapé',
    section: 'navigation',
    icon: Compass,
    status: 'in_progress',
    statusLabel: 'Em andamento',
  },
  {
    id: 'step-domain',
    title: 'Configurar domínio',
    description: 'Vincular endereço próprio com SSL automático',
    section: 'domains',
    icon: Globe,
    status: 'completed',
    statusLabel: 'Concluído',
  },
  {
    id: 'step-seo',
    title: 'Configurar SEO',
    description: 'Otimizar títulos de busca e tags para redes sociais',
    section: 'seo',
    icon: Search,
    status: 'pending',
    statusLabel: 'Pendente',
  },
];

export const GettingStartedCard: React.FC<GettingStartedCardProps> = ({ onNavigate }) => {
  const completedCount = CHECKLIST_ITEMS.filter((i) => i.status === 'completed').length;
  const totalCount = CHECKLIST_ITEMS.length;
  const progressPercent = Math.round((completedCount / totalCount) * 100);

  return (
    <div
      id="site-getting-started-card"
      className="bg-white p-5 rounded-xl border border-stone-200 shadow-xs"
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-md bg-amber-50 text-amber-700 flex items-center justify-center">
            <ListChecks className="w-4 h-4" />
          </div>
          <h2 className="text-sm font-bold text-stone-900 tracking-tight">
            Configuração do Site
          </h2>
        </div>

        <span className="text-xs font-semibold text-stone-700 bg-stone-100 px-2 py-0.5 rounded-full border border-stone-200">
          {completedCount} de {totalCount} etapas ({progressPercent}%)
        </span>
      </div>

      <p className="text-xs text-stone-500 mb-3">
        Guia para garantir que a presença digital da congregação esteja completa
      </p>

      {/* Barra de Progresso */}
      <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden mb-4">
        <div
          className="bg-amber-500 h-full rounded-full transition-all duration-500"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Lista de Itens do Checklist */}
      <div className="space-y-2">
        {CHECKLIST_ITEMS.map((item) => {
          const Icon = item.icon;
          const isDone = item.status === 'completed';
          const isInProgress = item.status === 'in_progress';

          return (
            <div
              key={item.id}
              className="flex items-center justify-between p-2.5 rounded-lg border border-stone-100 bg-stone-50/70 hover:bg-stone-50 hover:border-stone-200 transition-all text-xs group"
            >
              <div className="flex items-start gap-2.5 min-w-0">
                <div
                  className={`w-7 h-7 rounded-md flex items-center justify-center shrink-0 mt-0.5 ${
                    isDone
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : isInProgress
                      ? 'bg-amber-50 text-amber-700 border border-amber-200'
                      : 'bg-stone-100 text-stone-500 border border-stone-200'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                </div>

                <div className="min-w-0">
                  <div className="font-semibold text-stone-900 truncate">
                    {item.title}
                  </div>
                  <div className="text-[11px] text-stone-500 truncate">
                    {item.description}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 ml-2">
                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                    isDone
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : isInProgress
                      ? 'bg-amber-50 text-amber-700 border-amber-200'
                      : 'bg-stone-100 text-stone-600 border-stone-200'
                  }`}
                >
                  {item.statusLabel}
                </span>

                <button
                  type="button"
                  onClick={() => onNavigate(item.section)}
                  className="w-6 h-6 rounded flex items-center justify-center text-stone-400 group-hover:text-stone-700 hover:bg-stone-200 transition-colors"
                  title={`Ir para ${item.title}`}
                >
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
