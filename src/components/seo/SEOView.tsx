import React, { useState } from 'react';
import {
  Search,
  FileText,
  Globe,
  Share2,
  Save,
  RotateCcw,
  CheckCircle2,
  Sparkles,
  Plus,
  X,
  Image as ImageIcon,
  Bot,
  Layers,
  Check,
  Twitter,
  ExternalLink,
  Shield,
  HelpCircle,
  Tag,
} from 'lucide-react';
import {
  SiteSEO,
  PageSEO,
  Page,
  MediaItem,
  RobotsDirective,
} from '../../types';
import { INITIAL_DEMO_SITE_SEO, INITIAL_DEMO_PAGES_SEO } from './demoSeoData';
import { cmsRepository } from '../../core/persistence';
import { SEOPreview } from './SEOPreview';
import { SettingsSectionCard } from '../settings/SettingsSectionCard';
import { MediaPickerModal } from '../media/MediaPickerModal';

export const SEOView: React.FC = () => {
  // Aba ativa: 'site' (SiteSEO Global) ou 'pages' (PageSEO por página)
  const [activeTab, setActiveTab] = useState<'site' | 'pages'>('site');

  // Estado do SiteSEO Global (persistência canônica)
  const [siteSeo, setSiteSeo] = useState<SiteSEO>(() =>
    cmsRepository.loadSiteSeo()
  );
  const [savedSiteSeo, setSavedSiteSeo] = useState<SiteSEO>(() =>
    cmsRepository.loadSiteSeo()
  );

  // Estado das Páginas e seus PageSEO
  const [pages, setPages] = useState<Page[]>(() =>
    cmsRepository.loadPages()
  );
  const [savedPages, setSavedPages] = useState<Page[]>(() =>
    cmsRepository.loadPages()
  );

  // Página atualmente selecionada para edição de PageSEO
  const [selectedPageId, setSelectedPageId] = useState<string>(
    INITIAL_DEMO_PAGES_SEO[0]?.id || 'page_home'
  );

  // Estado de Palavra-chave em digitação
  const [newKeywordInput, setNewKeywordInput] = useState('');
  const [newPageKeywordInput, setNewPageKeywordInput] = useState('');

  // Controle de Mídia via MediaPickerModal
  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);
  const [mediaPickerTarget, setMediaPickerTarget] = useState<
    'site_default' | 'site_og' | 'site_twitter' | 'page_image'
  >('site_default');

  // Estado de Salvamento e Feedback Toast
  const [isSaving, setIsSaving] = useState(false);
  const [feedbackToast, setFeedbackToast] = useState<string | null>(null);

  // Identifica se há alterações não salvas (dirty state)
  const hasSiteChanges =
    JSON.stringify(siteSeo) !== JSON.stringify(savedSiteSeo);
  const hasPagesChanges =
    JSON.stringify(pages) !== JSON.stringify(savedPages);
  const hasUnsavedChanges = hasSiteChanges || hasPagesChanges;

  // Página selecionada ativa
  const activePage =
    pages.find((p) => p.id === selectedPageId) || pages[0];

  // Helper para exibir toast
  const showToast = (message: string) => {
    setFeedbackToast(message);
    setTimeout(() => {
      setFeedbackToast(null);
    }, 3500);
  };

  // Descartar alterações
  const handleDiscard = () => {
    setSiteSeo(JSON.parse(JSON.stringify(savedSiteSeo)));
    setPages(JSON.parse(JSON.stringify(savedPages)));
    showToast('Alterações de SEO descartadas.');
  };

  // Salvar alterações em memória
  const handleSaveAll = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    setTimeout(() => {
      cmsRepository.saveSiteSeo(siteSeo);
      cmsRepository.savePages(pages);
      setSavedSiteSeo(JSON.parse(JSON.stringify(siteSeo)));
      setSavedPages(JSON.parse(JSON.stringify(pages)));
      setIsSaving(false);
      showToast('Configurações de SEO salvas no armazenamento local!');
    }, 450);
  };

  // ==========================================
  // HANDLERS: SiteSEO Global
  // ==========================================
  const handleSiteFieldChange = (field: keyof SiteSEO, value: any) => {
    setSiteSeo((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSiteRobotsChange = (
    field: keyof RobotsDirective,
    value: boolean
  ) => {
    setSiteSeo((prev) => ({
      ...prev,
      robots: {
        ...(prev.robots || { index: true, follow: true, archive: true }),
        [field]: value,
      },
    }));
  };

  const handleSiteOgChange = (field: string, value: any) => {
    setSiteSeo((prev) => ({
      ...prev,
      openGraph: {
        ...(prev.openGraph || {}),
        [field]: value,
      },
    }));
  };

  const handleSiteTwitterChange = (field: string, value: any) => {
    setSiteSeo((prev) => ({
      ...prev,
      twitter: {
        ...(prev.twitter || {}),
        [field]: value,
      },
    }));
  };

  const handleAddSiteKeyword = () => {
    const trimmed = newKeywordInput.trim();
    if (!trimmed) return;
    const currentKeywords = siteSeo.keywords || [];
    if (!currentKeywords.includes(trimmed)) {
      setSiteSeo((prev) => ({
        ...prev,
        keywords: [...(prev.keywords || []), trimmed],
      }));
    }
    setNewKeywordInput('');
  };

  const handleRemoveSiteKeyword = (keywordToRemove: string) => {
    setSiteSeo((prev) => ({
      ...prev,
      keywords: (prev.keywords || []).filter((k) => k !== keywordToRemove),
    }));
  };

  // ==========================================
  // HANDLERS: PageSEO por Página
  // ==========================================
  const handlePageSeoChange = (field: keyof PageSEO, value: any) => {
    if (!activePage) return;
    setPages((prevPages) =>
      prevPages.map((p) => {
        if (p.id !== activePage.id) return p;
        return {
          ...p,
          seo: {
            ...p.seo,
            [field]: value,
          },
        };
      })
    );
  };

  const handlePageRobotsChange = (
    field: keyof RobotsDirective,
    value: boolean
  ) => {
    if (!activePage) return;
    setPages((prevPages) =>
      prevPages.map((p) => {
        if (p.id !== activePage.id) return p;
        return {
          ...p,
          seo: {
            ...p.seo,
            robots: {
              ...(p.seo.robots || { index: true, follow: true, archive: true }),
              [field]: value,
            },
          },
        };
      })
    );
  };

  const handlePageOgChange = (field: string, value: any) => {
    if (!activePage) return;
    setPages((prevPages) =>
      prevPages.map((p) => {
        if (p.id !== activePage.id) return p;
        return {
          ...p,
          seo: {
            ...p.seo,
            openGraph: {
              ...(p.seo.openGraph || {}),
              [field]: value,
            },
          },
        };
      })
    );
  };

  const handleAddPageKeyword = () => {
    const trimmed = newPageKeywordInput.trim();
    if (!trimmed || !activePage) return;
    const currentKeywords = activePage.seo.keywords || [];
    if (!currentKeywords.includes(trimmed)) {
      handlePageSeoChange('keywords', [...currentKeywords, trimmed]);
    }
    setNewPageKeywordInput('');
  };

  const handleRemovePageKeyword = (keywordToRemove: string) => {
    if (!activePage) return;
    handlePageSeoChange(
      'keywords',
      (activePage.seo.keywords || []).filter((k) => k !== keywordToRemove)
    );
  };

  // ==========================================
  // HANDLER: MediaPickerModal
  // ==========================================
  const handleOpenMediaPicker = (
    target: 'site_default' | 'site_og' | 'site_twitter' | 'page_image'
  ) => {
    setMediaPickerTarget(target);
    setIsMediaPickerOpen(true);
  };

  const handleSelectMedia = (media: MediaItem) => {
    if (mediaPickerTarget === 'site_default') {
      setSiteSeo((prev) => ({
        ...prev,
        defaultImageMediaId: media.id,
        defaultImageUrl: media.url,
      }));
    } else if (mediaPickerTarget === 'site_og') {
      setSiteSeo((prev) => ({
        ...prev,
        openGraph: {
          ...(prev.openGraph || {}),
          imageMediaId: media.id,
          imageUrl: media.url,
        },
      }));
    } else if (mediaPickerTarget === 'site_twitter') {
      setSiteSeo((prev) => ({
        ...prev,
        twitter: {
          ...(prev.twitter || {}),
          imageMediaId: media.id,
          imageUrl: media.url,
        },
      }));
    } else if (mediaPickerTarget === 'page_image') {
      if (activePage) {
        handlePageSeoChange('imageMediaId', media.id);
        handlePageSeoChange('ogImage', media.url);
        handlePageOgChange('imageUrl', media.url);
        handlePageOgChange('imageMediaId', media.id);
      }
    }
    setIsMediaPickerOpen(false);
    showToast(`Imagem "${media.title}" vinculada ao SEO.`);
  };

  return (
    <div id="seo-view" className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Toast de Notificação */}
      {feedbackToast && (
        <div
          id="seo-feedback-toast"
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-stone-900 text-white px-4 py-3 rounded-lg shadow-lg border border-stone-800 text-sm animate-in fade-in slide-in-from-bottom-2 duration-200"
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{feedbackToast}</span>
        </div>
      )}

      {/* Cabeçalho da Rota */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-stone-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight">
              SEO & Metadados Estruturais
            </h1>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 border border-amber-200">
              Fase 44
            </span>
          </div>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Gestão visual declarativa de indexação no Google, Open Graph e diretivas de rastreamento (Fase 16).
          </p>
        </div>

        {/* Ações de Topo */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={handleDiscard}
            disabled={!hasUnsavedChanges || isSaving}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900 bg-white hover:bg-stone-50 border border-stone-200 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-xs"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Descartar</span>
          </button>

          <button
            type="button"
            onClick={handleSaveAll}
            disabled={!hasUnsavedChanges || isSaving}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-lg transition-colors shadow-xs disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="w-3.5 h-3.5 text-amber-400" />
            <span>{isSaving ? 'Salvando...' : 'Salvar SEO'}</span>
          </button>
        </div>
      </div>

      {/* Alerta de Modificações Pendentes (Dirty State) */}
      {hasUnsavedChanges && (
        <div
          id="seo-unsaved-banner"
          className="flex items-center justify-between p-3.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-xs"
        >
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            <span className="font-semibold">Existem alterações não salvas nos metadados de SEO.</span>
            <span className="hidden sm:inline text-amber-700">
              Clique em "Salvar SEO" para persistir as alterações em memória.
            </span>
          </div>
          <button
            type="button"
            onClick={handleSaveAll}
            disabled={isSaving}
            className="font-bold underline hover:text-amber-950 transition-colors"
          >
            Salvar agora
          </button>
        </div>
      )}

      {/* Alternador de Abas: SiteSEO vs PageSEO */}
      <div className="flex items-center gap-2 border-b border-stone-200 pb-px">
        <button
          type="button"
          onClick={() => setActiveTab('site')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-all ${
            activeTab === 'site'
              ? 'border-stone-900 text-stone-900 bg-stone-50/50'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          <Globe className="w-4 h-4 text-amber-600" />
          <span>SEO Global do Site</span>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-md bg-stone-100 text-stone-600 border border-stone-200">
            SiteSEO
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('pages')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-all ${
            activeTab === 'pages'
              ? 'border-stone-900 text-stone-900 bg-stone-50/50'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          <FileText className="w-4 h-4 text-amber-600" />
          <span>SEO das Páginas</span>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-md bg-stone-100 text-stone-600 border border-stone-200">
            PageSEO ({pages.length})
          </span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* 1. ABA: SEO GLOBAL DO SITE (SiteSEO) */}
      {/* ========================================================================= */}
      {activeTab === 'site' && (
        <form onSubmit={handleSaveAll} className="space-y-6">
          {/* Card de Preview Visual Dinâmico */}
          <section id="section-site-preview">
            <SEOPreview
              title={siteSeo.title || ''}
              description={siteSeo.description || ''}
              url={siteSeo.canonicalBaseUrl || 'https://www.igrejabatistacentral.com.br'}
              imageUrl={siteSeo.openGraph?.imageUrl || siteSeo.defaultImageUrl}
              siteName={siteSeo.siteName || 'Igreja Batista Central'}
              robots={siteSeo.robots}
              scopeLabel="SiteSEO Global (Padrão para todo o portal)"
            />
          </section>

          {/* 1.1 Metadados Canônicos Principais */}
          <SettingsSectionCard
            id="section-site-indexing"
            title="Metadados Principais de Busca (SiteSEO)"
            subtitle="Título padrão, descrição principal e URL base canônica do portal (Fase 16)"
            icon={<Search className="w-4 h-4 text-amber-600" />}
            badge="SiteSEO"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Título Padrão do Site (title)
                </label>
                <input
                  type="text"
                  value={siteSeo.title || ''}
                  onChange={(e) => handleSiteFieldChange('title', e.target.value)}
                  placeholder="Igreja Batista Central — Comunhão, Adoração e Missão"
                  className="w-full text-xs px-3 py-2 border border-stone-300 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-stone-900 bg-white"
                />
                <div className="flex items-center justify-between text-[10px] text-stone-400 mt-1">
                  <span>Exibido na barra do navegador e título principal no Google.</span>
                  <span className="font-mono">{(siteSeo.title || '').length} / 65 caracteres</span>
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Descrição Padrão do Site (description)
                </label>
                <textarea
                  rows={3}
                  value={siteSeo.description || ''}
                  onChange={(e) => handleSiteFieldChange('description', e.target.value)}
                  placeholder="Portal oficial com informações dos cultos, horários, eventos e ministérios da igreja..."
                  className="w-full text-xs px-3 py-2 border border-stone-300 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-stone-900 bg-white"
                />
                <div className="flex items-center justify-between text-[10px] text-stone-400 mt-1">
                  <span>Snippet que os mecanismos de busca apresentam abaixo do título.</span>
                  <span className="font-mono">{(siteSeo.description || '').length} / 160 caracteres</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Nome do Site para SEO (siteName)
                </label>
                <input
                  type="text"
                  value={siteSeo.siteName || ''}
                  onChange={(e) => handleSiteFieldChange('siteName', e.target.value)}
                  placeholder="Igreja Batista Central"
                  className="w-full text-xs px-3 py-2 border border-stone-300 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-stone-900 bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  URL Canônica Base (canonicalBaseUrl)
                </label>
                <input
                  type="url"
                  value={siteSeo.canonicalBaseUrl || ''}
                  onChange={(e) => handleSiteFieldChange('canonicalBaseUrl', e.target.value)}
                  placeholder="https://www.igrejabatistacentral.com.br"
                  className="w-full text-xs font-mono px-3 py-2 border border-stone-300 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-stone-900 bg-white"
                />
                <p className="text-[10px] text-stone-400 mt-1">
                  Previne problemas de conteúdo duplicado em múltiplos domínios.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Localidade / Idioma (locale)
                </label>
                <input
                  type="text"
                  value={siteSeo.locale || ''}
                  onChange={(e) => handleSiteFieldChange('locale', e.target.value)}
                  placeholder="pt_BR"
                  className="w-full text-xs font-mono px-3 py-2 border border-stone-300 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-stone-900 bg-white"
                />
              </div>

              {/* Palavras-chave (keywords) */}
              <div className="sm:col-span-2 space-y-2 pt-2 border-t border-stone-100">
                <label className="block text-xs font-bold text-stone-700">
                  Palavras-chave Declarativas (keywords)
                </label>
                <div className="flex flex-wrap items-center gap-1.5 mb-2">
                  {(siteSeo.keywords || []).map((keyword, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-md bg-stone-100 text-stone-700 border border-stone-200"
                    >
                      <Tag className="w-3 h-3 text-stone-400" />
                      <span>{keyword}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveSiteKeyword(keyword)}
                        className="hover:text-red-600 transition-colors ml-0.5"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                  {(!siteSeo.keywords || siteSeo.keywords.length === 0) && (
                    <span className="text-xs text-stone-400 italic">
                      Nenhuma palavra-chave cadastrada.
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={newKeywordInput}
                    onChange={(e) => setNewKeywordInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddSiteKeyword();
                      }
                    }}
                    placeholder="Adicionar termo e pressionar Enter (ex: 'cultos de celebração')"
                    className="w-full text-xs px-3 py-2 border border-stone-300 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-stone-900 bg-white"
                  />
                  <button
                    type="button"
                    onClick={handleAddSiteKeyword}
                    className="px-3.5 py-2 text-xs font-semibold bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-lg border border-stone-200 shrink-0 transition-colors"
                  >
                    Adicionar
                  </button>
                </div>
              </div>
            </div>
          </SettingsSectionCard>

          {/* 1.2 Diretivas de Robôs (RobotsDirective) */}
          <SettingsSectionCard
            id="section-site-robots"
            title="Diretivas de Robôs e Rastreamento (RobotsDirective)"
            subtitle="Instruções para mecanismos de busca conforme o contrato canônico RobotsDirective (Fase 16)"
            icon={<Bot className="w-4 h-4 text-amber-600" />}
            badge="RobotsDirective"
          >
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* index */}
              <div className="p-3.5 rounded-xl border border-stone-200 bg-stone-50/50 flex items-start gap-3">
                <input
                  type="checkbox"
                  id="robot-index"
                  checked={siteSeo.robots?.index !== false}
                  onChange={(e) => handleSiteRobotsChange('index', e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded text-stone-900 focus:ring-stone-900 border-stone-300"
                />
                <div>
                  <label
                    htmlFor="robot-index"
                    className="text-xs font-bold text-stone-900 block cursor-pointer"
                  >
                    Indexar Site (index)
                  </label>
                  <p className="text-[11px] text-stone-500 mt-0.5">
                    Permite que buscadores como Google e Bing listem as páginas do site nos resultados.
                  </p>
                </div>
              </div>

              {/* follow */}
              <div className="p-3.5 rounded-xl border border-stone-200 bg-stone-50/50 flex items-start gap-3">
                <input
                  type="checkbox"
                  id="robot-follow"
                  checked={siteSeo.robots?.follow !== false}
                  onChange={(e) => handleSiteRobotsChange('follow', e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded text-stone-900 focus:ring-stone-900 border-stone-300"
                />
                <div>
                  <label
                    htmlFor="robot-follow"
                    className="text-xs font-bold text-stone-900 block cursor-pointer"
                  >
                    Seguir Links (follow)
                  </label>
                  <p className="text-[11px] text-stone-500 mt-0.5">
                    Instrui os robôs a rastrearem os links internos e menus contidos nas páginas.
                  </p>
                </div>
              </div>

              {/* archive */}
              <div className="p-3.5 rounded-xl border border-stone-200 bg-stone-50/50 flex items-start gap-3">
                <input
                  type="checkbox"
                  id="robot-archive"
                  checked={siteSeo.robots?.archive !== false}
                  onChange={(e) => handleSiteRobotsChange('archive', e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded text-stone-900 focus:ring-stone-900 border-stone-300"
                />
                <div>
                  <label
                    htmlFor="robot-archive"
                    className="text-xs font-bold text-stone-900 block cursor-pointer"
                  >
                    Permitir Cache (archive)
                  </label>
                  <p className="text-[11px] text-stone-500 mt-0.5">
                    Permite que os mecanismos de busca mantenham cópia em cache das páginas.
                  </p>
                </div>
              </div>
            </div>
          </SettingsSectionCard>

          {/* 1.3 Imagem Padrão e Open Graph (OpenGraphMetadata) */}
          <SettingsSectionCard
            id="section-site-opengraph"
            title="Compartilhamento Social & Open Graph (OpenGraphMetadata)"
            subtitle="Metadados para cards no WhatsApp, Facebook e Telegram com integração à biblioteca de mídia"
            icon={<Share2 className="w-4 h-4 text-amber-600" />}
            badge="OpenGraphMetadata"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Título Open Graph (openGraph.title)
                </label>
                <input
                  type="text"
                  value={siteSeo.openGraph?.title || ''}
                  onChange={(e) => handleSiteOgChange('title', e.target.value)}
                  placeholder="Igreja Batista Central — Portal Oficial"
                  className="w-full text-xs px-3 py-2 border border-stone-300 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-stone-900 bg-white"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Descrição Open Graph (openGraph.description)
                </label>
                <textarea
                  rows={2}
                  value={siteSeo.openGraph?.description || ''}
                  onChange={(e) => handleSiteOgChange('description', e.target.value)}
                  placeholder="Um lugar de acolhimento, palavra viva e esperança para você e sua casa..."
                  className="w-full text-xs px-3 py-2 border border-stone-300 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-stone-900 bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Tipo de Objeto Open Graph (openGraph.type)
                </label>
                <select
                  value={siteSeo.openGraph?.type || 'website'}
                  onChange={(e) => handleSiteOgChange('type', e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-stone-300 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-stone-900 bg-white"
                >
                  <option value="website">website (Padrão institucional)</option>
                  <option value="article">article (Artigo pastoral)</option>
                  <option value="organization">organization (Entidade eclesial)</option>
                </select>
              </div>

              {/* Imagem Padrão de SEO (defaultImageUrl e defaultImageMediaId) */}
              <div className="sm:col-span-2 p-4 rounded-xl border border-stone-200 bg-stone-50/50 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-xs font-bold text-stone-900 block">
                      Imagem Padrão de Compartilhamento (defaultImageUrl / defaultImageMediaId)
                    </label>
                    <p className="text-[11px] text-stone-500">
                      Utilizada quando o link do site for compartilhado nas redes sociais.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleOpenMediaPicker('site_default')}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-stone-700 bg-white border border-stone-200 rounded-lg hover:bg-stone-50 transition-colors shadow-2xs"
                  >
                    <ImageIcon className="w-3.5 h-3.5 text-amber-600" />
                    <span>Selecionar da Mídia</span>
                  </button>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  {siteSeo.defaultImageUrl ? (
                    <div className="w-32 h-20 rounded-lg border border-stone-300 bg-white overflow-hidden shrink-0 shadow-2xs">
                      <img
                        src={siteSeo.defaultImageUrl}
                        alt="Imagem Padrão de SEO"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-32 h-20 rounded-lg border border-dashed border-stone-300 bg-stone-100 flex items-center justify-center shrink-0 text-stone-400">
                      <ImageIcon className="w-6 h-6" />
                    </div>
                  )}

                  <div className="w-full space-y-1.5">
                    <input
                      type="url"
                      value={siteSeo.defaultImageUrl || ''}
                      onChange={(e) => {
                        handleSiteFieldChange('defaultImageUrl', e.target.value);
                        handleSiteOgChange('imageUrl', e.target.value);
                      }}
                      placeholder="https://..."
                      className="w-full text-xs font-mono px-3 py-1.5 border border-stone-300 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-stone-900 bg-white"
                    />
                    <div className="flex items-center justify-between text-[10px] text-stone-400">
                      <span>MediaId: {siteSeo.defaultImageMediaId || 'Não vinculado'}</span>
                      {siteSeo.defaultImageUrl && (
                        <button
                          type="button"
                          onClick={() => {
                            handleSiteFieldChange('defaultImageUrl', '');
                            handleSiteFieldChange('defaultImageMediaId', undefined);
                          }}
                          className="text-red-500 hover:underline"
                        >
                          Remover imagem
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </SettingsSectionCard>

          {/* 1.4 Twitter / X Cards (TwitterCardMetadata) */}
          <SettingsSectionCard
            id="section-site-twitter"
            title="Cartões do Twitter / X (TwitterCardMetadata)"
            subtitle="Formato de exibição ao compartilhar links no Twitter/X (Fase 16)"
            icon={<Twitter className="w-4 h-4 text-amber-600" />}
            badge="TwitterCardMetadata"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Modelo do Card (twitter.card)
                </label>
                <select
                  value={siteSeo.twitter?.card || 'summary_large_image'}
                  onChange={(e) => handleSiteTwitterChange('card', e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-stone-300 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-stone-900 bg-white"
                >
                  <option value="summary_large_image">summary_large_image (Card com imagem grande)</option>
                  <option value="summary">summary (Card quadrado compacto)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Título no Twitter (twitter.title)
                </label>
                <input
                  type="text"
                  value={siteSeo.twitter?.title || ''}
                  onChange={(e) => handleSiteTwitterChange('title', e.target.value)}
                  placeholder="Igreja Batista Central"
                  className="w-full text-xs px-3 py-2 border border-stone-300 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-stone-900 bg-white"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Descrição no Twitter (twitter.description)
                </label>
                <textarea
                  rows={2}
                  value={siteSeo.twitter?.description || ''}
                  onChange={(e) => handleSiteTwitterChange('description', e.target.value)}
                  placeholder="Cultos dominicais, mensagens pastorais e ministérios..."
                  className="w-full text-xs px-3 py-2 border border-stone-300 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-stone-900 bg-white"
                />
              </div>
            </div>
          </SettingsSectionCard>
        </form>
      )}

      {/* ========================================================================= */}
      {/* 2. ABA: SEO DAS PÁGINAS (PageSEO) */}
      {/* ========================================================================= */}
      {activeTab === 'pages' && activePage && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Coluna Esquerda: Seletor de Páginas (Fase 26) */}
          <div className="lg:col-span-4 space-y-3">
            <div className="bg-white rounded-xl border border-stone-200 p-4 shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                <div>
                  <h3 className="text-xs font-bold text-stone-900">
                    Páginas Cadastradas
                  </h3>
                  <p className="text-[11px] text-stone-500">
                    Selecione para ajustar o PageSEO
                  </p>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-stone-100 text-stone-600 font-semibold">
                  {pages.length} páginas
                </span>
              </div>

              <div className="mt-3 space-y-1.5 max-h-[560px] overflow-y-auto pr-1">
                {pages.map((p) => {
                  const isSelected = p.id === activePage.id;
                  const hasCustomSeo = Boolean(p.seo?.metaTitle || p.seo?.metaDescription);
                  const isPageNoIndex = p.seo?.noIndex || p.seo?.robots?.index === false;

                  return (
                    <div
                      key={p.id}
                      onClick={() => setSelectedPageId(p.id)}
                      className={`cursor-pointer rounded-lg p-2.5 transition-all text-left border ${
                        isSelected
                          ? 'border-stone-900 bg-stone-900 text-white shadow-xs'
                          : 'border-stone-100 hover:border-stone-200 hover:bg-stone-50 text-stone-800'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold truncate">
                          {p.title}
                        </span>
                        {p.isHome && (
                          <span
                            className={`text-[9px] font-semibold px-1.5 py-0.5 rounded ${
                              isSelected
                                ? 'bg-amber-400 text-stone-950'
                                : 'bg-amber-50 text-amber-800 border border-amber-200'
                            }`}
                          >
                            HOME
                          </span>
                        )}
                      </div>

                      <div
                        className={`flex items-center justify-between text-[10px] mt-1 font-mono ${
                          isSelected ? 'text-stone-300' : 'text-stone-400'
                        }`}
                      >
                        <span className="truncate">{p.slug}</span>
                        {isPageNoIndex ? (
                          <span className="text-red-400 font-bold">noindex</span>
                        ) : hasCustomSeo ? (
                          <span className={isSelected ? 'text-emerald-300' : 'text-emerald-600'}>
                            SEO configurado
                          </span>
                        ) : (
                          <span>Padrão do site</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Coluna Direita: Editor de PageSEO da Página Selecionada */}
          <div className="lg:col-span-8 space-y-6">
            {/* Banner da Página Ativa */}
            <div className="flex items-center justify-between p-4 rounded-xl bg-white border border-stone-200 shadow-xs">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-sm font-bold text-stone-900">
                      {activePage.title}
                    </h2>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold uppercase">
                      {activePage.status}
                    </span>
                  </div>
                  <span className="text-xs text-stone-500 font-mono">
                    Rota: {activePage.slug}
                  </span>
                </div>
              </div>

              <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-stone-100 text-stone-600 border border-stone-200">
                PageSEO
              </span>
            </div>

            {/* Simulador SERP & Social da Página Ativa */}
            <SEOPreview
              title={activePage.seo.metaTitle || activePage.title}
              description={
                activePage.seo.metaDescription ||
                siteSeo.description ||
                'Descrição herdada do SEO do site.'
              }
              url={`https://www.igrejabatistacentral.com.br${activePage.slug === '/' ? '' : activePage.slug}`}
              imageUrl={activePage.seo.ogImage || activePage.seo.openGraph?.imageUrl || siteSeo.defaultImageUrl}
              siteName={siteSeo.siteName}
              robots={activePage.seo.robots}
              noIndex={activePage.seo.noIndex}
              scopeLabel={`Página: ${activePage.title} (${activePage.slug})`}
            />

            {/* Formulário de PageSEO */}
            <div className="space-y-6">
              {/* Metadados Básicos da Página */}
              <SettingsSectionCard
                id="section-page-seo-meta"
                title="Metadados da Página (PageSEO)"
                subtitle="Permite override declarativo dos metadados globais para esta página específica (Fase 16)"
                icon={<Search className="w-4 h-4 text-amber-600" />}
                badge="PageSEO"
              >
                <div className="space-y-4">
                  {/* metaTitle */}
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Título SEO da Página (metaTitle) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={activePage.seo.metaTitle || ''}
                      onChange={(e) => handlePageSeoChange('metaTitle', e.target.value)}
                      placeholder={`${activePage.title} — Igreja Batista Central`}
                      className="w-full text-xs px-3 py-2 border border-stone-300 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-stone-900 bg-white"
                      required
                    />
                    <div className="flex items-center justify-between text-[10px] text-stone-400 mt-1">
                      <span>Substitui o título do site nos resultados de busca do Google.</span>
                      <span className="font-mono">
                        {(activePage.seo.metaTitle || '').length} / 65 caracteres
                      </span>
                    </div>
                  </div>

                  {/* metaDescription */}
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Descrição da Página (metaDescription) <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      rows={3}
                      value={activePage.seo.metaDescription || ''}
                      onChange={(e) => handlePageSeoChange('metaDescription', e.target.value)}
                      placeholder="Descrição resumida do conteúdo desta página..."
                      className="w-full text-xs px-3 py-2 border border-stone-300 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-stone-900 bg-white"
                      required
                    />
                    <div className="flex items-center justify-between text-[10px] text-stone-400 mt-1">
                      <span>Resumo exibido no snippet do Google para esta página.</span>
                      <span className="font-mono">
                        {(activePage.seo.metaDescription || '').length} / 160 caracteres
                      </span>
                    </div>
                  </div>

                  {/* canonicalUrl */}
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      URL Canônica Específica (canonicalUrl)
                    </label>
                    <input
                      type="url"
                      value={activePage.seo.canonicalUrl || ''}
                      onChange={(e) => handlePageSeoChange('canonicalUrl', e.target.value)}
                      placeholder={`https://www.igrejabatistacentral.com.br${activePage.slug === '/' ? '' : activePage.slug}`}
                      className="w-full text-xs font-mono px-3 py-2 border border-stone-300 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-stone-900 bg-white"
                    />
                    <p className="text-[10px] text-stone-400 mt-1">
                      Opcional. Se vazio, a URL padrão da página é considerada canônica.
                    </p>
                  </div>

                  {/* noIndex */}
                  <div className="p-3.5 rounded-xl border border-stone-200 bg-stone-50/50 flex items-start gap-3">
                    <input
                      type="checkbox"
                      id="page-noindex"
                      checked={activePage.seo.noIndex === true}
                      onChange={(e) => handlePageSeoChange('noIndex', e.target.checked)}
                      className="mt-0.5 h-4 w-4 rounded text-stone-900 focus:ring-stone-900 border-stone-300"
                    />
                    <div>
                      <label
                        htmlFor="page-noindex"
                        className="text-xs font-bold text-stone-900 block cursor-pointer"
                      >
                        Ocultar esta página dos resultados de busca (noIndex)
                      </label>
                      <p className="text-[11px] text-stone-500 mt-0.5">
                        Adiciona a instrução para que os robôs do Google não indexem esta página (útil para páginas de confirmação, formulários internos ou rascunhos).
                      </p>
                    </div>
                  </div>

                  {/* Palavras-chave da Página */}
                  <div className="space-y-2 pt-2 border-t border-stone-100">
                    <label className="block text-xs font-bold text-stone-700">
                      Palavras-chave da Página (keywords)
                    </label>
                    <div className="flex flex-wrap items-center gap-1.5 mb-2">
                      {(activePage.seo.keywords || []).map((keyword, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-md bg-stone-100 text-stone-700 border border-stone-200"
                        >
                          <Tag className="w-3 h-3 text-stone-400" />
                          <span>{keyword}</span>
                          <button
                            type="button"
                            onClick={() => handleRemovePageKeyword(keyword)}
                            className="hover:text-red-600 transition-colors ml-0.5"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                      {(!activePage.seo.keywords || activePage.seo.keywords.length === 0) && (
                        <span className="text-xs text-stone-400 italic">
                          Nenhuma palavra-chave cadastrada para esta página.
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={newPageKeywordInput}
                        onChange={(e) => setNewPageKeywordInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddPageKeyword();
                          }
                        }}
                        placeholder="Adicionar termo e pressionar Enter"
                        className="w-full text-xs px-3 py-2 border border-stone-300 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-stone-900 bg-white"
                      />
                      <button
                        type="button"
                        onClick={handleAddPageKeyword}
                        className="px-3.5 py-2 text-xs font-semibold bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-lg border border-stone-200 shrink-0 transition-colors"
                      >
                        Adicionar
                      </button>
                    </div>
                  </div>

                  {/* Imagem Social da Página (ogImage / imageMediaId) */}
                  <div className="p-4 rounded-xl border border-stone-200 bg-stone-50/50 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-xs font-bold text-stone-900 block">
                          Imagem de Compartilhamento desta Página (ogImage / imageMediaId)
                        </label>
                        <p className="text-[11px] text-stone-500">
                          Imagem destacada específica ao compartilhar esta página.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleOpenMediaPicker('page_image')}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-stone-700 bg-white border border-stone-200 rounded-lg hover:bg-stone-50 transition-colors shadow-2xs"
                      >
                        <ImageIcon className="w-3.5 h-3.5 text-amber-600" />
                        <span>Selecionar da Mídia</span>
                      </button>
                    </div>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                      {activePage.seo.ogImage ? (
                        <div className="w-32 h-20 rounded-lg border border-stone-300 bg-white overflow-hidden shrink-0 shadow-2xs">
                          <img
                            src={activePage.seo.ogImage}
                            alt={activePage.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-32 h-20 rounded-lg border border-dashed border-stone-300 bg-stone-100 flex items-center justify-center shrink-0 text-stone-400">
                          <ImageIcon className="w-6 h-6" />
                        </div>
                      )}

                      <div className="w-full space-y-1.5">
                        <input
                          type="url"
                          value={activePage.seo.ogImage || ''}
                          onChange={(e) => {
                            handlePageSeoChange('ogImage', e.target.value);
                            handlePageOgChange('imageUrl', e.target.value);
                          }}
                          placeholder="https://... (Se vazio, herda a imagem geral do site)"
                          className="w-full text-xs font-mono px-3 py-1.5 border border-stone-300 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-stone-900 bg-white"
                        />
                        <div className="flex items-center justify-between text-[10px] text-stone-400">
                          <span>MediaId: {activePage.seo.imageMediaId || 'Não vinculado'}</span>
                          {activePage.seo.ogImage && (
                            <button
                              type="button"
                              onClick={() => {
                                handlePageSeoChange('ogImage', '');
                                handlePageSeoChange('imageMediaId', undefined);
                              }}
                              className="text-red-500 hover:underline"
                            >
                              Remover imagem
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </SettingsSectionCard>

              {/* Diretivas de Robôs Específicas da Página (RobotsDirective) */}
              <SettingsSectionCard
                id="section-page-robots"
                title="Diretivas de Robôs da Página (RobotsDirective)"
                subtitle="Instruções de indexação específicas para esta página (Fase 16)"
                icon={<Bot className="w-4 h-4 text-amber-600" />}
                badge="RobotsDirective"
              >
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-3.5 rounded-xl border border-stone-200 bg-stone-50/50 flex items-start gap-3">
                    <input
                      type="checkbox"
                      id="page-robot-index"
                      checked={activePage.seo.robots?.index !== false}
                      onChange={(e) => handlePageRobotsChange('index', e.target.checked)}
                      className="mt-0.5 h-4 w-4 rounded text-stone-900 focus:ring-stone-900 border-stone-300"
                    />
                    <div>
                      <label
                        htmlFor="page-robot-index"
                        className="text-xs font-bold text-stone-900 block cursor-pointer"
                      >
                        Indexar (index)
                      </label>
                      <p className="text-[11px] text-stone-500 mt-0.5">
                        Permitir que a página apareça nos buscadores.
                      </p>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl border border-stone-200 bg-stone-50/50 flex items-start gap-3">
                    <input
                      type="checkbox"
                      id="page-robot-follow"
                      checked={activePage.seo.robots?.follow !== false}
                      onChange={(e) => handlePageRobotsChange('follow', e.target.checked)}
                      className="mt-0.5 h-4 w-4 rounded text-stone-900 focus:ring-stone-900 border-stone-300"
                    />
                    <div>
                      <label
                        htmlFor="page-robot-follow"
                        className="text-xs font-bold text-stone-900 block cursor-pointer"
                      >
                        Seguir Links (follow)
                      </label>
                      <p className="text-[11px] text-stone-500 mt-0.5">
                        Rastrear links contidos nesta página.
                      </p>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl border border-stone-200 bg-stone-50/50 flex items-start gap-3">
                    <input
                      type="checkbox"
                      id="page-robot-archive"
                      checked={activePage.seo.robots?.archive !== false}
                      onChange={(e) => handlePageRobotsChange('archive', e.target.checked)}
                      className="mt-0.5 h-4 w-4 rounded text-stone-900 focus:ring-stone-900 border-stone-300"
                    />
                    <div>
                      <label
                        htmlFor="page-robot-archive"
                        className="text-xs font-bold text-stone-900 block cursor-pointer"
                      >
                        Permitir Cache (archive)
                      </label>
                      <p className="text-[11px] text-stone-500 mt-0.5">
                        Permitir versão em cache pelos buscadores.
                      </p>
                    </div>
                  </div>
                </div>
              </SettingsSectionCard>
            </div>
          </div>
        </div>
      )}

      {/* Barra de Ações Inferior */}
      <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-stone-200 shadow-xs">
        <div className="text-xs text-stone-500">
          Modo ativo:{' '}
          <strong className="text-stone-800">
            {activeTab === 'site'
              ? 'SEO Global do Site (SiteSEO)'
              : `SEO da Página: ${activePage?.title || ''}`}
          </strong>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleDiscard}
            disabled={!hasUnsavedChanges || isSaving}
            className="px-3.5 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900 bg-stone-50 hover:bg-stone-100 border border-stone-200 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Descartar
          </button>

          <button
            type="button"
            onClick={handleSaveAll}
            disabled={!hasUnsavedChanges || isSaving}
            className="inline-flex items-center gap-2 px-5 py-2 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-lg transition-colors shadow-xs disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="w-3.5 h-3.5 text-amber-400" />
            <span>{isSaving ? 'Salvando...' : 'Salvar SEO'}</span>
          </button>
        </div>
      </div>

      {/* Modal de Seleção de Mídia (Reutilização de MediaPickerModal da Fase 28) */}
      <MediaPickerModal
        isOpen={isMediaPickerOpen}
        onClose={() => setIsMediaPickerOpen(false)}
        onSelectImage={handleSelectMedia}
        selectedMediaId={
          mediaPickerTarget === 'site_default'
            ? siteSeo.defaultImageMediaId
            : mediaPickerTarget === 'page_image'
            ? activePage?.seo?.imageMediaId
            : undefined
        }
      />
    </div>
  );
};
