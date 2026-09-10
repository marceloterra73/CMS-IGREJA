import React from 'react';
import {
  Plus,
  FilePlus,
  CalendarPlus,
  Newspaper,
  Video,
  UploadCloud,
  CheckSquare,
} from 'lucide-react';
import { NavigationKey } from '../layout/Sidebar';

interface QuickActionsProps {
  onNavigate: (section: NavigationKey) => void;
}

export const QuickActions: React.FC<QuickActionsProps> = ({ onNavigate }) => {
  const actions = [
    {
      id: 'quick-action-new-page',
      label: 'Nova página',
      description: 'Criar rota e estruturar seções',
      icon: FilePlus,
      section: 'pages' as NavigationKey,
      primary: true,
    },
    {
      id: 'quick-action-new-event',
      label: 'Novo evento',
      description: 'Agenda, conferência ou retiro',
      icon: CalendarPlus,
      section: 'events' as NavigationKey,
    },
    {
      id: 'quick-action-new-news',
      label: 'Nova notícia',
      description: 'Comunicados e artigos pastorais',
      icon: Newspaper,
      section: 'news' as NavigationKey,
    },
    {
      id: 'quick-action-new-sermon',
      label: 'Novo sermão',
      description: 'Vídeo, áudio ou mensagem',
      icon: Video,
      section: 'sermons' as NavigationKey,
    },
    {
      id: 'quick-action-upload-media',
      label: 'Adicionar mídia',
      description: 'Fotos, banners ou documentos',
      icon: UploadCloud,
      section: 'media' as NavigationKey,
    },
    {
      id: 'quick-action-new-form',
      label: 'Novo formulário',
      description: 'Inscrições e pedidos de oração',
      icon: CheckSquare,
      section: 'forms' as NavigationKey,
    },
  ];

  return (
    <div id="quick-actions-panel" className="bg-white p-5 rounded-xl border border-stone-200 shadow-xs">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-sm font-bold text-stone-900 tracking-tight">
            Ações Rápidas
          </h2>
          <p className="text-xs text-stone-500">
            Atalhos frequentes para atualização de conteúdo e comunicação
          </p>
        </div>
        <span className="text-[11px] font-medium text-stone-500 bg-stone-100 px-2 py-0.5 rounded-md">
          {actions.length} atalhos
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <button
              key={action.id}
              id={action.id}
              type="button"
              onClick={() => onNavigate(action.section)}
              className={`
                flex items-center gap-3 p-3 rounded-lg border text-left transition-all group
                ${
                  action.primary
                    ? 'bg-amber-50/80 border-amber-200 hover:bg-amber-100/80 hover:border-amber-300'
                    : 'bg-stone-50/70 border-stone-200 hover:bg-white hover:border-stone-300 hover:shadow-xs'
                }
              `}
            >
              <div
                className={`
                  w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors
                  ${
                    action.primary
                      ? 'bg-amber-500 text-stone-950 group-hover:bg-amber-600'
                      : 'bg-white text-stone-700 border border-stone-200 group-hover:border-stone-300'
                  }
                `}
              >
                <Icon className="w-4 h-4" />
              </div>
              <div className="truncate min-w-0">
                <div className="text-xs font-semibold text-stone-900 group-hover:text-stone-950 truncate">
                  {action.label}
                </div>
                <div className="text-[11px] text-stone-500 truncate">
                  {action.description}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
