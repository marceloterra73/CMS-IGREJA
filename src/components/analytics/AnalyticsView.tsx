import React, { useState } from 'react';
import {
  BarChart3,
  Save,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Shield,
  ShieldCheck,
  Power,
  Layers,
  Lock,
  Eye,
  Info,
  ExternalLink,
  Copy,
  Check,
  Sparkles,
  HelpCircle,
} from 'lucide-react';
import { SiteAnalytics } from '../../types';
import { INITIAL_DEMO_ANALYTICS } from './demoAnalyticsData';
import { cmsRepository } from '../../core/persistence';
import { SettingsSectionCard } from '../settings/SettingsSectionCard';

export const AnalyticsView: React.FC = () => {
  // Estado principal das configurações de Analytics do Tenant ('ib_central') persistido localmente
  const [config, setConfig] = useState<SiteAnalytics>(() =>
    cmsRepository.loadAnalytics()
  );
  const [savedConfig, setSavedConfig] = useState<SiteAnalytics>(() =>
    cmsRepository.loadAnalytics()
  );

  // Estados de feedback e persistência em memória
  const [isSaving, setIsSaving] = useState(false);
  const [feedbackToast, setFeedbackToast] = useState<string | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Detecção de alterações não salvas (dirty state)
  const hasUnsavedChanges =
    JSON.stringify(config) !== JSON.stringify(savedConfig);

  // Helper para exibir notificações toast
  const showToast = (message: string) => {
    setFeedbackToast(message);
    setTimeout(() => {
      setFeedbackToast(null);
    }, 3500);
  };

  // Helper para copiar valor para a área de transferência
  const handleCopy = (value: string, fieldName: string) => {
    if (!value) return;
    navigator.clipboard?.writeText(value).catch(() => {});
    setCopiedField(fieldName);
    showToast(`Identificador copiado!`);
    setTimeout(() => {
      setCopiedField(null);
    }, 2000);
  };

  // Descartar alterações pendentes
  const handleDiscard = () => {
    setConfig(JSON.parse(JSON.stringify(savedConfig)));
    showToast('Alterações de Analytics e Tags descartadas.');
  };

  // Salvar alterações em memória
  const handleSaveAll = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    setTimeout(() => {
      const updated = {
        ...config,
        updatedAt: new Date().toISOString(),
      };
      cmsRepository.saveAnalytics(updated);
      setConfig(updated);
      setSavedConfig(JSON.parse(JSON.stringify(updated)));
      setIsSaving(false);
      showToast('Configurações de Analytics salvas no armazenamento local!');
    }, 400);
  };

  // Atualização genérica de campos da interface
  const handleChange = <K extends keyof SiteAnalytics>(
    field: K,
    value: SiteAnalytics[K]
  ) => {
    setConfig((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Estatísticas derivadas estritamente da configuração (SEM métricas falsas de tráfego)
  const isMasterActive = Boolean(config.isActive);
  const configuredTagsCount = [
    Boolean(config.googleAnalyticsId?.trim()),
    Boolean(config.googleTagManagerId?.trim()),
    Boolean(config.metaPixelId?.trim()),
    Boolean(config.searchConsoleVerificationToken?.trim()),
  ].filter(Boolean).length;

  return (
    <div id="analytics-view" className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Toast de Notificação */}
      {feedbackToast && (
        <div
          id="analytics-feedback-toast"
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
              Analytics e Tags
            </h1>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 border border-amber-200">
              Fase 46
            </span>
          </div>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Gestão declarativa de identificadores de medição, tags de terceiros e preferências de privacidade (Fase 23).
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
            <span>{isSaving ? 'Salvando...' : 'Salvar Configurações'}</span>
          </button>
        </div>
      </div>

      {/* Alerta de Modificações Pendentes (Dirty State) */}
      {hasUnsavedChanges && (
        <div
          id="analytics-unsaved-banner"
          className="flex items-center justify-between p-3.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-xs"
        >
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            <span className="font-semibold">Existem alterações não salvas nas configurações de Analytics e Tags.</span>
            <span className="hidden sm:inline text-amber-700">
              Clique em "Salvar Configurações" para persistir as alterações em memória.
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

      {/* PAINEL RESUMO DE STATUS DA CONFIGURAÇÃO (Derivado dos dados reais da configuração) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Card 1: Chave Mestra */}
        <div className="bg-white rounded-xl border border-stone-200 p-4 flex items-center gap-3.5 shadow-2xs">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
              isMasterActive
                ? 'bg-emerald-50 text-emerald-600 border-emerald-200'
                : 'bg-stone-100 text-stone-400 border-stone-200'
            }`}
          >
            <Power className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block">
              Serviço Geral
            </span>
            <span
              className={`text-sm font-bold block ${
                isMasterActive ? 'text-emerald-700' : 'text-stone-500'
              }`}
            >
              {isMasterActive ? 'Ativo & Operante' : 'Desativado Globalmente'}
            </span>
          </div>
        </div>

        {/* Card 2: Tags Configuradas */}
        <div className="bg-white rounded-xl border border-stone-200 p-4 flex items-center gap-3.5 shadow-2xs">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 border border-amber-200 flex items-center justify-center shrink-0">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block">
              Tags Cadastradas
            </span>
            <span className="text-sm font-bold text-stone-900 block">
              {configuredTagsCount} de 4 tags ativas
            </span>
          </div>
        </div>

        {/* Card 3: Privacidade & LGPD */}
        <div className="bg-white rounded-xl border border-stone-200 p-4 flex items-center gap-3.5 shadow-2xs">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 border border-blue-200 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block">
              Proteção & Privacidade
            </span>
            <span className="text-sm font-bold text-stone-900 block">
              {config.anonymizeIp && config.consentRequired
                ? 'IP Anonimizado & Consentimento'
                : config.anonymizeIp
                ? 'IP Anonimizado'
                : config.consentRequired
                ? 'Consentimento Exigido'
                : 'Padrão Básico'}
            </span>
          </div>
        </div>
      </div>

      {/* 1. CHAVE MESTRA DO SERVIÇO DE ANALYTICS (SiteAnalytics.isActive) */}
      <section className="bg-white rounded-xl border border-stone-200 shadow-xs overflow-hidden">
        <div className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3.5">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border transition-colors ${
                config.isActive
                  ? 'bg-emerald-500 text-white border-emerald-600'
                  : 'bg-stone-100 text-stone-400 border-stone-200'
              }`}
            >
              <Power className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-stone-900">
                Ativação Global de Analytics e Tags (isActive)
              </h2>
              <p className="text-xs text-stone-500 mt-0.5">
                Chave mestre para habilitar ou suspender globalmente a integração declarativa de medição e tags no portal.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 self-end sm:self-auto">
            <span
              className={`text-xs font-bold ${
                config.isActive ? 'text-emerald-700' : 'text-stone-400'
              }`}
            >
              {config.isActive ? 'ATIVADO' : 'DESATIVADO'}
            </span>
            <button
              type="button"
              role="switch"
              aria-checked={config.isActive}
              onClick={() => handleChange('isActive', !config.isActive)}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden focus:ring-2 focus:ring-stone-900 focus:ring-offset-2 ${
                config.isActive ? 'bg-emerald-600' : 'bg-stone-300'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                  config.isActive ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {!config.isActive && (
          <div className="px-5 sm:px-6 py-3 bg-amber-50/80 border-t border-amber-200 text-amber-900 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              <strong>Atenção:</strong> Com a chave mestra desativada, nenhum identificador de medição ou tag de terceiros será vinculado declarativamente às páginas públicas da igreja.
            </span>
          </div>
        )}
      </section>

      {/* 2. IDENTIFICADORES DE MEDIÇÃO & TAGS DE TERCEIROS */}
      <SettingsSectionCard
        id="section-analytics-providers"
        title="Identificadores de Medição e Tags de Terceiros"
        subtitle="Configuração estrita dos identificadores canônicos suportados pelo contrato SiteAnalytics (Fase 23)"
        icon={<BarChart3 className="w-4 h-4 text-amber-600" />}
        badge="Contrato Canônico"
      >
        <div className="space-y-6">
          {/* Item 1: Google Analytics 4 (googleAnalyticsId) */}
          <div className="p-4 sm:p-5 rounded-xl border border-stone-200 bg-stone-50/40 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-800 font-bold text-xs flex items-center justify-center border border-amber-200">
                  GA
                </div>
                <div>
                  <h3 className="text-xs font-bold text-stone-900">
                    Google Analytics 4 (googleAnalyticsId)
                  </h3>
                  <span className="text-[11px] text-stone-500">
                    ID de medição do fluxo web do GA4
                  </span>
                </div>
              </div>

              <span
                className={`text-[11px] font-semibold px-2 py-0.5 rounded-md self-start sm:self-auto border ${
                  config.googleAnalyticsId?.trim()
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : 'bg-stone-100 text-stone-500 border-stone-200'
                }`}
              >
                {config.googleAnalyticsId?.trim() ? 'Configurado' : 'Não configurado'}
              </span>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-stone-700">
                ID de Medição
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={config.googleAnalyticsId || ''}
                  onChange={(e) =>
                    handleChange('googleAnalyticsId', e.target.value.trim())
                  }
                  placeholder="ex: G-XXXXXXXXXX"
                  className="w-full text-xs font-mono px-3.5 py-2.5 border border-stone-300 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-stone-900 bg-white"
                />
                {config.googleAnalyticsId && (
                  <button
                    type="button"
                    onClick={() =>
                      handleCopy(config.googleAnalyticsId || '', 'ga')
                    }
                    title="Copiar ID"
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-stone-400 hover:text-stone-700 rounded-md transition-colors"
                  >
                    {copiedField === 'ga' ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                )}
              </div>
              <p className="text-[11px] text-stone-400">
                Geralmente inicia com o prefixo <code className="font-mono text-stone-600">G-</code> para propriedades GA4 (Google Analytics 4).
              </p>
            </div>
          </div>

          {/* Item 2: Google Tag Manager (googleTagManagerId) */}
          <div className="p-4 sm:p-5 rounded-xl border border-stone-200 bg-stone-50/40 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-800 font-bold text-xs flex items-center justify-center border border-blue-200">
                  GTM
                </div>
                <div>
                  <h3 className="text-xs font-bold text-stone-900">
                    Google Tag Manager (googleTagManagerId)
                  </h3>
                  <span className="text-[11px] text-stone-500">
                    ID do contêiner para orquestração de tags
                  </span>
                </div>
              </div>

              <span
                className={`text-[11px] font-semibold px-2 py-0.5 rounded-md self-start sm:self-auto border ${
                  config.googleTagManagerId?.trim()
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : 'bg-stone-100 text-stone-500 border-stone-200'
                }`}
              >
                {config.googleTagManagerId?.trim() ? 'Configurado' : 'Não configurado'}
              </span>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-stone-700">
                ID do Contêiner GTM
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={config.googleTagManagerId || ''}
                  onChange={(e) =>
                    handleChange('googleTagManagerId', e.target.value.trim())
                  }
                  placeholder="ex: GTM-XXXXXXX"
                  className="w-full text-xs font-mono px-3.5 py-2.5 border border-stone-300 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-stone-900 bg-white"
                />
                {config.googleTagManagerId && (
                  <button
                    type="button"
                    onClick={() =>
                      handleCopy(config.googleTagManagerId || '', 'gtm')
                    }
                    title="Copiar ID"
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-stone-400 hover:text-stone-700 rounded-md transition-colors"
                  >
                    {copiedField === 'gtm' ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                )}
              </div>
              <p className="text-[11px] text-stone-400">
                Formato padrão fornecido no painel do Google Tag Manager (prefixo <code className="font-mono text-stone-600">GTM-</code>).
              </p>
            </div>
          </div>

          {/* Item 3: Meta Pixel (metaPixelId) */}
          <div className="p-4 sm:p-5 rounded-xl border border-stone-200 bg-stone-50/40 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-800 font-bold text-xs flex items-center justify-center border border-indigo-200">
                  FB
                </div>
                <div>
                  <h3 className="text-xs font-bold text-stone-900">
                    Meta Pixel / Facebook (metaPixelId)
                  </h3>
                  <span className="text-[11px] text-stone-500">
                    ID numérico do pixel de campanhas e engajamento da igreja
                  </span>
                </div>
              </div>

              <span
                className={`text-[11px] font-semibold px-2 py-0.5 rounded-md self-start sm:self-auto border ${
                  config.metaPixelId?.trim()
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : 'bg-stone-100 text-stone-500 border-stone-200'
                }`}
              >
                {config.metaPixelId?.trim() ? 'Configurado' : 'Não configurado'}
              </span>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-stone-700">
                ID do Meta Pixel
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={config.metaPixelId || ''}
                  onChange={(e) =>
                    handleChange('metaPixelId', e.target.value.trim())
                  }
                  placeholder="ex: 1234567890123456"
                  className="w-full text-xs font-mono px-3.5 py-2.5 border border-stone-300 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-stone-900 bg-white"
                />
                {config.metaPixelId && (
                  <button
                    type="button"
                    onClick={() =>
                      handleCopy(config.metaPixelId || '', 'meta')
                    }
                    title="Copiar ID"
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-stone-400 hover:text-stone-700 rounded-md transition-colors"
                  >
                    {copiedField === 'meta' ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                )}
              </div>
              <p className="text-[11px] text-stone-400">
                Identificador puramente numérico (normalmente composto por 15 a 16 dígitos).
              </p>
            </div>
          </div>

          {/* Item 4: Google Search Console (searchConsoleVerificationToken) */}
          <div className="p-4 sm:p-5 rounded-xl border border-stone-200 bg-stone-50/40 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center border border-emerald-200">
                  GSC
                </div>
                <div>
                  <h3 className="text-xs font-bold text-stone-900">
                    Google Search Console (searchConsoleVerificationToken)
                  </h3>
                  <span className="text-[11px] text-stone-500">
                    Token declarativo para validação de propriedade do site no Google
                  </span>
                </div>
              </div>

              <span
                className={`text-[11px] font-semibold px-2 py-0.5 rounded-md self-start sm:self-auto border ${
                  config.searchConsoleVerificationToken?.trim()
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : 'bg-stone-100 text-stone-500 border-stone-200'
                }`}
              >
                {config.searchConsoleVerificationToken?.trim() ? 'Configurado' : 'Não configurado'}
              </span>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-stone-700">
                Token de Verificação de Propriedade
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={config.searchConsoleVerificationToken || ''}
                  onChange={(e) =>
                    handleChange('searchConsoleVerificationToken', e.target.value.trim())
                  }
                  placeholder="ex: google123456789abcdef0"
                  className="w-full text-xs font-mono px-3.5 py-2.5 border border-stone-300 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-stone-900 bg-white"
                />
                {config.searchConsoleVerificationToken && (
                  <button
                    type="button"
                    onClick={() =>
                      handleCopy(config.searchConsoleVerificationToken || '', 'gsc')
                    }
                    title="Copiar Token"
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-stone-400 hover:text-stone-700 rounded-md transition-colors"
                  >
                    {copiedField === 'gsc' ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                )}
              </div>
              <p className="text-[11px] text-stone-400">
                Token fornecido pelo Google Search Console pelo método de verificação de tag meta HTML.
              </p>
            </div>
          </div>
        </div>
      </SettingsSectionCard>

      {/* 3. PREFERÊNCIAS DE PRIVACIDADE E CONFORMIDADE (LGPD) */}
      <SettingsSectionCard
        id="section-analytics-privacy"
        title="Privacidade dos Visitantes e Conformidade (LGPD)"
        subtitle="Configurações declarativas de proteção de dados vinculadas ao Tenant (Fase 23)"
        icon={<Shield className="w-4 h-4 text-amber-600" />}
        badge="Privacidade"
      >
        <div className="space-y-4">
          {/* Toggle 1: anonymizeIp */}
          <div className="p-4 rounded-xl border border-stone-200 bg-stone-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-xs font-bold text-stone-900 flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-stone-600" />
                <span>Anonimização de Endereço IP (anonymizeIp)</span>
              </span>
              <p className="text-[11px] text-stone-500 leading-relaxed max-w-2xl">
                Quando ativado, os identificadores de endereço IP dos visitantes são mascarados antes do registro de telemetria, protegendo a privacidade individual dos membros e visitantes da congregação.
              </p>
            </div>

            <button
              type="button"
              role="switch"
              aria-checked={config.anonymizeIp}
              onClick={() => handleChange('anonymizeIp', !config.anonymizeIp)}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden focus:ring-2 focus:ring-stone-900 focus:ring-offset-2 self-start sm:self-center ${
                config.anonymizeIp ? 'bg-stone-900' : 'bg-stone-300'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                  config.anonymizeIp ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Toggle 2: consentRequired */}
          <div className="p-4 rounded-xl border border-stone-200 bg-stone-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-xs font-bold text-stone-900 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-stone-600" />
                <span>Exigência Declarativa de Consentimento (consentRequired)</span>
              </span>
              <p className="text-[11px] text-stone-500 leading-relaxed max-w-2xl">
                Exige o consentimento explícito do visitante para ativação de tags e cookies de medição não essenciais, em estrita conformidade com a Lei Geral de Proteção de Dados (LGPD).
              </p>
            </div>

            <button
              type="button"
              role="switch"
              aria-checked={config.consentRequired}
              onClick={() =>
                handleChange('consentRequired', !config.consentRequired)
              }
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden focus:ring-2 focus:ring-stone-900 focus:ring-offset-2 self-start sm:self-center ${
                config.consentRequired ? 'bg-stone-900' : 'bg-stone-300'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                  config.consentRequired ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>
      </SettingsSectionCard>

      {/* 4. DIRETRIZES DE SEGURANÇA E FRONTEIRA ARQUITETURAL (Informativo) */}
      <div className="p-5 rounded-xl border border-stone-200 bg-stone-50/60 space-y-3">
        <div className="flex items-center gap-2 text-stone-900 font-bold text-xs">
          <Shield className="w-4 h-4 text-amber-600" />
          <span>Fronteira Arquitetural de Segurança e Integridade (Fase 23)</span>
        </div>
        <div className="text-xs text-stone-600 space-y-2 leading-relaxed">
          <p>
            O CMS adota o padrão de <strong>Segurança Declarativa por Identificador</strong>:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-[11px] text-stone-500">
            <li>
              <strong>Sem Injeção de Scripts Arbitrários:</strong> Não são aceitos blocos de código JavaScript livre (<code className="font-mono text-stone-700">&lt;script&gt;</code>) no painel administrativo, eliminando vetores de ataque do tipo Cross-Site Scripting (XSS).
            </li>
            <li>
              <strong>Sem Execução de Tracking em Ambiente Administrativo:</strong> Nenhuma métrica real ou pixel de rastreamento é disparado durante a navegação nos painéis internos de gestão do portal.
            </li>
            <li>
              <strong>Isolamento por Congregação:</strong> Todos os identificadores pertencem exclusivamente ao escopo do Tenant (<code className="font-mono text-stone-700">{config.tenantId}</code>), assegurando conformidade multi-tenant irrestrita.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
