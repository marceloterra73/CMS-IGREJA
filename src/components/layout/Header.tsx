import React from 'react';
import {
  Menu,
  ExternalLink,
  Bell,
  CheckCircle2,
  BookOpen,
  ChevronDown,
} from 'lucide-react';

interface HeaderProps {
  tenantName?: string;
  isSiteLive?: boolean;
  onToggleMobileSidebar: () => void;
  onOpenDocs?: () => void;
  onVisitSite?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  tenantName = 'Igreja Batista Central',
  isSiteLive = true,
  onToggleMobileSidebar,
  onOpenDocs,
  onVisitSite,
}) => {
  return (
    <header
      id="admin-header"
      className="bg-white border-b border-stone-200 sticky top-0 z-30 h-16 flex items-center justify-between px-4 sm:px-6 shadow-xs"
    >
      {/* Lado Esquerdo: Botão Mobile e Identificação do Tenant */}
      <div className="flex items-center gap-3">
        <button
          id="btn-toggle-mobile-sidebar"
          type="button"
          onClick={onToggleMobileSidebar}
          className="lg:hidden p-2 rounded-lg text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors focus:outline-hidden focus:ring-2 focus:ring-stone-400"
          aria-label="Abrir menu de navegação"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Tenant e Status */}
        <div className="flex items-center gap-3">
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-stone-900 tracking-tight">
                {tenantName}
              </span>
              <span
                id="site-status-badge"
                className="hidden sm:inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                {isSiteLive ? 'Site no ar' : 'Rascunho'}
              </span>
            </div>
            <span className="text-xs text-stone-500 hidden md:block">
              igrejabatistacentral.com.br
            </span>
          </div>
        </div>
      </div>

      {/* Lado Direito: Ações, Notificações e Perfil */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Botão de Documentação Técnica / Fases */}
        {onOpenDocs && (
          <button
            id="btn-header-docs"
            type="button"
            onClick={onOpenDocs}
            className="hidden md:inline-flex items-center gap-1.5 text-xs font-medium text-stone-600 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 px-3 py-1.5 rounded-lg border border-stone-200 transition-colors"
            title="Ver Arquitetura e Contratos (Fases 0 a 23)"
          >
            <BookOpen className="w-3.5 h-3.5 text-stone-600" />
            <span>Arquitetura</span>
          </button>
        )}

        {/* Botão Visitar Site */}
        <a
          id="btn-visit-site"
          href="#site"
          onClick={(e) => {
            e.preventDefault();
            if (onVisitSite) onVisitSite();
          }}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-stone-700 hover:text-stone-900 bg-stone-50 hover:bg-stone-100 px-3 py-1.5 rounded-lg border border-stone-200 transition-colors cursor-pointer"
          title="Ver o site público da igreja"
        >
          <span>Visitar site</span>
          <ExternalLink className="w-3.5 h-3.5 text-stone-500" />
        </a>

        {/* Notificações (apenas visual) */}
        <button
          id="btn-notifications"
          type="button"
          className="relative p-2 rounded-lg text-stone-500 hover:text-stone-800 hover:bg-stone-100 transition-colors"
          aria-label="Notificações"
          title="Nenhuma notificação nova"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-500 ring-2 ring-white" />
        </button>

        <div className="h-6 w-px bg-stone-200 mx-1 hidden sm:block" />

        {/* Perfil do Usuário */}
        <div
          id="user-profile-menu"
          className="flex items-center gap-2 pl-1 sm:pl-2 py-1 cursor-pointer rounded-lg hover:bg-stone-50 transition-colors"
        >
          <div className="w-8 h-8 rounded-full bg-stone-900 text-amber-400 font-bold text-xs flex items-center justify-center ring-2 ring-stone-200">
            PA
          </div>
          <div className="hidden sm:flex flex-col text-left">
            <span className="text-xs font-semibold text-stone-900 leading-tight">
              Pr. Alexandre
            </span>
            <span className="text-[10px] text-stone-500 leading-tight">
              Administrador Geral
            </span>
          </div>
          <ChevronDown className="w-3.5 h-3.5 text-stone-400 hidden sm:block" />
        </div>
      </div>
    </header>
  );
};
