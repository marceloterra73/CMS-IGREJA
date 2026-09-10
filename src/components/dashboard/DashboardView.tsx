import React from 'react';
import {
  FileText,
  Calendar,
  CheckSquare,
  Image as ImageIcon,
  Video,
  Newspaper,
  ExternalLink,
  Plus,
  Sparkles,
  ShieldCheck,
  Globe,
} from 'lucide-react';
import { StatCard } from './StatCard';
import { QuickActions } from './QuickActions';
import { ContentOverview } from './ContentOverview';
import { RecentActivity } from './RecentActivity';
import { SiteStatusCard } from './SiteStatusCard';
import { GettingStartedCard } from './GettingStartedCard';
import { InstitutionalSummary } from './InstitutionalSummary';
import { NavigationKey } from '../layout/Sidebar';

interface DashboardViewProps {
  onNavigate: (section: NavigationKey) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onNavigate }) => {
  return (
    <div id="dashboard-view" className="space-y-6">
      {/* 1. Welcome / Header Area */}
      <div
        id="dashboard-welcome-banner"
        className="bg-white p-6 sm:p-7 rounded-2xl border border-stone-200 shadow-xs relative overflow-hidden"
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200 mb-2.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Painel Central de Gestão • Igreja Batista Central</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
              Olá, Pr. Alexandre
            </h1>
            <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-2xl leading-relaxed">
              Site publicado e 100% acessível no domínio principal. Acompanhe a distribuição de conteúdos, atividades recentes e configurações da presença digital da sua congregação.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <a
              id="btn-banner-visit-site"
              href="#site-preview"
              onClick={(e) => e.preventDefault()}
              className="inline-flex items-center gap-2 text-xs font-semibold text-stone-700 hover:text-stone-950 bg-stone-100 hover:bg-stone-200 px-3.5 py-2 rounded-xl border border-stone-200 transition-colors shadow-xs"
            >
              <Globe className="w-3.5 h-3.5 text-stone-500" />
              <span>Visitar site público</span>
              <ExternalLink className="w-3 h-3 text-stone-400" />
            </a>

            <button
              id="btn-banner-new-page"
              type="button"
              onClick={() => onNavigate('pages')}
              className="inline-flex items-center gap-2 text-xs font-semibold text-stone-950 bg-amber-500 hover:bg-amber-600 px-4 py-2 rounded-xl shadow-xs transition-colors"
            >
              <Plus className="w-4 h-4 text-stone-950" />
              <span>Nova página</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Quick Actions */}
      <QuickActions onNavigate={onNavigate} />

      {/* 3. Indicadores Principais (Overview Metrics) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        <StatCard
          id="stat-card-pages"
          title="Páginas"
          value="12"
          description="8 no ar • 4 rascunhos"
          icon={FileText}
          iconBgColor="bg-blue-50"
          iconColor="text-blue-700"
          trend="+2 este mês"
          onClick={() => onNavigate('pages')}
        />

        <StatCard
          id="stat-card-news"
          title="Notícias"
          value="19"
          description="Artigos publicados"
          icon={Newspaper}
          iconBgColor="bg-stone-100"
          iconColor="text-stone-700"
          trend="Ativo"
          onClick={() => onNavigate('news')}
        />

        <StatCard
          id="stat-card-events"
          title="Eventos"
          value="8"
          description="Próximos 30 dias"
          icon={Calendar}
          iconBgColor="bg-amber-50"
          iconColor="text-amber-700"
          trend="2 hoje"
          onClick={() => onNavigate('events')}
        />

        <StatCard
          id="stat-card-sermons"
          title="Sermões"
          value="42"
          description="Cultos gravados"
          icon={Video}
          iconBgColor="bg-red-50"
          iconColor="text-red-700"
          trend="+3 recentes"
          onClick={() => onNavigate('sermons')}
        />

        <StatCard
          id="stat-card-media"
          title="Mídia"
          value="156"
          description="Fotos e documentos"
          icon={ImageIcon}
          iconBgColor="bg-purple-50"
          iconColor="text-purple-700"
          onClick={() => onNavigate('media')}
        />

        <StatCard
          id="stat-card-forms"
          title="Formulários"
          value="24"
          description="Respostas recebidas"
          icon={CheckSquare}
          iconBgColor="bg-emerald-50"
          iconColor="text-emerald-700"
          trend="+5 novas"
          onClick={() => onNavigate('forms')}
        />
      </div>

      {/* 4. Colunas de Conteúdo e Status (2/3 e 1/3 no Desktop) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Coluna Principal (2/3): Visão Geral de Conteúdo e Atividade Recente */}
        <div className="lg:col-span-2 space-y-6">
          <ContentOverview onNavigate={onNavigate} />
          <RecentActivity />
        </div>

        {/* Coluna Lateral (1/3): Status do Site, Checklist de Configuração e Resumo Institucional */}
        <div className="space-y-6">
          <SiteStatusCard />
          <GettingStartedCard onNavigate={onNavigate} />
          <InstitutionalSummary onNavigate={onNavigate} />
        </div>
      </div>
    </div>
  );
};
