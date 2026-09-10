import React from 'react';
import {
  FileText,
  Image as ImageIcon,
  CheckSquare,
  Calendar,
  Newspaper,
  Video,
  Users,
  HeartHandshake,
  Camera,
  UserCheck,
  Palette,
  Compass,
  Search,
  Globe,
  BarChart3,
  Settings,
  ArrowLeft,
  Clock,
  Layers,
  Sparkles,
  Gift,
  Radio,
} from 'lucide-react';
import { NavigationKey } from '../layout/Sidebar';

interface SectionInfo {
  title: string;
  subtitle: string;
  phaseRef: string;
  icon: React.ElementType;
  primaryActionLabel: string;
  description: string;
}

const SECTION_DETAILS: Record<NavigationKey, SectionInfo> = {
  dashboard: {
    title: 'Dashboard',
    subtitle: 'Painel principal de controle',
    phaseRef: 'Fase 24',
    icon: Layers,
    primaryActionLabel: 'Atualizar dados',
    description: 'Visão unificada das métricas e atividades da congregação.',
  },
  pages: {
    title: 'Gerenciamento de Páginas',
    subtitle: 'Estruturação de rotas, seções e conteúdo público',
    phaseRef: 'Fase 6 & Fase 19 (Page, Sections, Blocks)',
    icon: FileText,
    primaryActionLabel: '+ Nova Página',
    description: 'Gestão declarativa de páginas institucionais, rotas e seções sem código arbitrário.',
  },
  media: {
    title: 'Biblioteca de Mídia',
    subtitle: 'Gestão segura de arquivos e ativos eclesiais',
    phaseRef: 'Fase 10 (MediaItem & MediaLibrary)',
    icon: ImageIcon,
    primaryActionLabel: '+ Enviar Arquivos',
    description: 'Armazenamento isolado por congregação com otimização automática de imagens e documentos.',
  },
  banners: {
    title: 'Banners',
    subtitle: 'Destaques visuais, avisos principais e campanhas pastorais',
    phaseRef: 'Fase 41 (ChurchBanner)',
    icon: Layers,
    primaryActionLabel: '+ Novo Banner',
    description: 'Gestão visual dos banners e destaques visuais do site da igreja.',
  },
  forms: {
    title: 'Formulários do Site',
    subtitle: 'Definições declarativas e respostas recebidas',
    phaseRef: 'Fase 22 (FormDefinition & FormSubmission)',
    icon: CheckSquare,
    primaryActionLabel: '+ Novo Formulário',
    description: 'Criação estruturada de formulários para visitantes (pedidos de oração, contato e inscrições).',
  },
  schedule: {
    title: 'Horários & Cultos',
    subtitle: 'Programação de cultos regulares e reuniões da congregação',
    phaseRef: 'Fase 47 (ChurchSchedule)',
    icon: Clock,
    primaryActionLabel: '+ Novo Horário',
    description: 'Gestão visual de dias, horários, locais e status dos cultos da igreja.',
  },
  events: {
    title: 'Calendário de Eventos',
    subtitle: 'Agenda, conferências, retiros e cultos especiais',
    phaseRef: 'Fase 12 (ChurchEvent)',
    icon: Calendar,
    primaryActionLabel: '+ Novo Evento',
    description: 'Publicação de eventos com horários, palestrantes e orientações para a comunidade.',
  },
  news: {
    title: 'Notícias & Comunicados',
    subtitle: 'Avisos da liderança e cartas pastorais',
    phaseRef: 'Fase 12 (ChurchNews)',
    icon: Newspaper,
    primaryActionLabel: '+ Nova Notícia',
    description: 'Artigos formatados e avisos oficiais vinculados à congregação.',
  },
  sermons: {
    title: 'Sermões & Cultos Gravados',
    subtitle: 'Catálogo de pregações, áudios e vídeos',
    phaseRef: 'Fase 12 (ChurchSermon)',
    icon: Video,
    primaryActionLabel: '+ Novo Sermão',
    description: 'Mensagens em vídeo e áudio organizadas por preletor, série e livro bíblico.',
  },
  livestream: {
    title: 'Transmissão ao Vivo',
    subtitle: 'Cultos transmitidos em tempo real e agendamentos',
    phaseRef: 'Fase 49 (ChurchLiveStreamInfo)',
    icon: Radio,
    primaryActionLabel: 'Salvar Configurações',
    description: 'Gestão visual das informações do player de transmissão, links e agendamento.',
  },
  ministries: {
    title: 'Ministérios & Liderança',
    subtitle: 'Apresentação dos departamentos da igreja',
    phaseRef: 'Fase 11 & 12 (ChurchLeadership)',
    icon: Users,
    primaryActionLabel: '+ Novo Ministério',
    description: 'Grupos, células, ministério infantil, jovens e louvor.',
  },
  prayers: {
    title: 'Pedidos de Oração',
    subtitle: 'Solicitações pastorais recebidas pelo site',
    phaseRef: 'Fase 12 (ChurchPrayerRequest)',
    icon: HeartHandshake,
    primaryActionLabel: 'Ver Solicitações',
    description: 'Caixa de oração confidencial moderada pela equipe pastoral.',
  },
  gallery: {
    title: 'Galeria de Fotos',
    subtitle: 'Álbuns de eventos, batismos e retiros',
    phaseRef: 'Fase 10 & 12 (ChurchGallery)',
    icon: Camera,
    primaryActionLabel: '+ Novo Álbum',
    description: 'Fotografias organizadas por eventos e celebrações.',
  },
  leaders: {
    title: 'Lideranças',
    subtitle: 'Corpo pastoral, ministros e líderes',
    phaseRef: 'Fase 40 (ChurchLeader)',
    icon: UserCheck,
    primaryActionLabel: '+ Nova Liderança',
    description: 'Gestão visual do cadastro e exibição da equipe pastoral e líderes ministeriais.',
  },
  donations: {
    title: 'Doações & PIX',
    subtitle: 'Dízimos, ofertas, chave PIX e orientações bancárias',
    phaseRef: 'Fase 48 (ChurchDonationInfo)',
    icon: Gift,
    primaryActionLabel: 'Salvar Configurações',
    description: 'Gestão visual das instruções de contribuição, chave PIX e contas bancárias da igreja.',
  },
  appearance: {
    title: 'Aparência & Tema Visual',
    subtitle: 'Design tokens, paleta de cores e tipografia',
    phaseRef: 'Fase 8 (VisualTheme & DesignTokens)',
    icon: Palette,
    primaryActionLabel: 'Personalizar Tema',
    description: 'Aplicação padronizada da identidade visual e estilo sem quebra de leiaute.',
  },
  navigation: {
    title: 'Menus de Navegação',
    subtitle: 'Estruturação do cabeçalho e rodapé do site',
    phaseRef: 'Fase 9 (NavigationMenu & NavigationItem)',
    icon: Compass,
    primaryActionLabel: '+ Novo Menu',
    description: 'Hierarquia de links para cabeçalho, rodapé e navegação móvel.',
  },
  seo: {
    title: 'SEO & Otimização para Buscas',
    subtitle: 'Metadados, Open Graph e diretivas de robôs',
    phaseRef: 'Fase 16 (SiteSEO & PageSEO)',
    icon: Search,
    primaryActionLabel: 'Configurar Metadados',
    description: 'Configuração estruturada de indexação no Google sem scripts livres.',
  },
  domains: {
    title: 'Domínios do Site',
    subtitle: 'Endereços próprios, subdomínios e certificados',
    phaseRef: 'Fase 18 (SiteDomain)',
    icon: Globe,
    primaryActionLabel: '+ Conectar Domínio',
    description: 'Resolução e validação de nomes de domínio multi-tenant.',
  },
  analytics: {
    title: 'Analytics & Tags',
    subtitle: 'Identificadores de medição e privacidade',
    phaseRef: 'Fase 23 (SiteAnalytics)',
    icon: BarChart3,
    primaryActionLabel: 'Configurar Tags',
    description: 'Google Analytics 4, Meta Pixel e verificação de propriedade protegidos.',
  },
  settings: {
    title: 'Configurações Gerais',
    subtitle: 'Dados institucionais, fuso horário e preferências',
    phaseRef: 'Fase 17 (SiteSettings)',
    icon: Settings,
    primaryActionLabel: 'Salvar Alterações',
    description: 'Identidade da congregação, horários, endereço físico e contatos oficiais.',
  },
};

interface PlaceholderViewProps {
  sectionKey: NavigationKey;
  onBackToDashboard: () => void;
}

export const PlaceholderView: React.FC<PlaceholderViewProps> = ({
  sectionKey,
  onBackToDashboard,
}) => {
  const details = SECTION_DETAILS[sectionKey] || {
    title: sectionKey,
    subtitle: 'Área administrativa',
    phaseRef: 'Fase 24',
    icon: Layers,
    primaryActionLabel: '+ Ação',
    description: 'Configurações do sistema.',
  };

  const IconComponent = details.icon;

  return (
    <div id={`section-view-${sectionKey}`} className="space-y-6">
      {/* Barra de Retorno e Ações */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-xl border border-stone-200 shadow-xs">
        <div className="flex items-center gap-3">
          <button
            id="btn-back-to-dashboard"
            type="button"
            onClick={onBackToDashboard}
            className="p-2 rounded-lg text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors"
            title="Voltar ao Dashboard"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-stone-900 tracking-tight">
                {details.title}
              </h1>
              <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-stone-100 text-stone-600 border border-stone-200">
                {details.phaseRef}
              </span>
            </div>
            <p className="text-xs text-stone-500">{details.subtitle}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-center">
          <button
            type="button"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-950 bg-amber-500 hover:bg-amber-600 px-3.5 py-2 rounded-lg shadow-xs transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-stone-950" />
            <span>{details.primaryActionLabel}</span>
          </button>
        </div>
      </div>

      {/* Painel Central Informativo do Placeholder */}
      <div className="bg-white p-8 sm:p-12 rounded-2xl border border-stone-200 shadow-xs text-center max-w-2xl mx-auto space-y-4">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center shadow-xs">
          <IconComponent className="w-7 h-7" />
        </div>

        <div>
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-800 bg-amber-100/70 px-2.5 py-1 rounded-full mb-2">
            <Clock className="w-3.5 h-3.5 text-amber-700" />
            <span>Camada Visual — Módulo em Preparação</span>
          </span>
          <h2 className="text-xl font-bold text-stone-900 tracking-tight">
            Área de {details.title}
          </h2>
          <p className="text-xs text-stone-600 mt-2 leading-relaxed max-w-lg mx-auto">
            {details.description}
          </p>
        </div>

        <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 text-left text-xs space-y-2 max-w-md mx-auto">
          <div className="font-semibold text-stone-800 flex items-center gap-2">
            <Layers className="w-4 h-4 text-stone-600" />
            <span>Garantia de Não-Falsificação de CRUD</span>
          </div>
          <p className="text-[11px] text-stone-500 leading-relaxed">
            De acordo com o Modo Cirúrgico da Fase 24, esta tela respeita os contratos canônicos consolidados previamente e não simula chamadas falsas de API ou persistência em banco. O gerenciamento operacional desta seção será implementado em fase subsequente.
          </p>
        </div>

        <div className="pt-4">
          <button
            type="button"
            onClick={onBackToDashboard}
            className="inline-flex items-center gap-2 text-xs font-semibold text-stone-700 hover:text-stone-950 bg-stone-100 hover:bg-stone-200 px-4 py-2 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Retornar ao Dashboard</span>
          </button>
        </div>
      </div>
    </div>
  );
};
