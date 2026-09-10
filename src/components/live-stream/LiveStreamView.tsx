import React, { useState } from 'react';
import {
  Radio,
  Save,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Link as LinkIcon,
  Copy,
  Check,
  Calendar,
  Clock,
  VideoOff,
  ShieldCheck,
  Eye,
  Info,
  Lock,
  Sparkles,
  FileText,
} from 'lucide-react';
import { ChurchLiveStreamInfo, LiveStreamStatus } from '../../types';
import { INITIAL_DEMO_LIVESTREAM } from './demoLiveStreamData';
import { cmsRepository } from '../../core/persistence';
import { LiveStreamPreview } from './LiveStreamPreview';
import { SettingsSectionCard } from '../settings/SettingsSectionCard';

export const LiveStreamView: React.FC = () => {
  // Estado principal das configurações de Live Stream do Tenant ('ib_central') persistido localmente
  const [liveStream, setLiveStream] = useState<ChurchLiveStreamInfo>(() =>
    cmsRepository.loadLiveStream()
  );
  const [savedLiveStream, setSavedLiveStream] = useState<ChurchLiveStreamInfo>(() =>
    cmsRepository.loadLiveStream()
  );

  // Estados de controle de interface, persistência em memória e feedback
  const [isSaving, setIsSaving] = useState(false);
  const [feedbackToast, setFeedbackToast] = useState<string | null>(null);
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [activeTab, setActiveTab] = useState<'editor' | 'preview'>('editor');

  // Detecção de alterações não salvas (dirty state)
  const hasUnsavedChanges =
    JSON.stringify(liveStream) !== JSON.stringify(savedLiveStream);

  // Helper para exibir notificações toast
  const showToast = (message: string) => {
    setFeedbackToast(message);
    setTimeout(() => {
      setFeedbackToast(null);
    }, 3500);
  };

  // Helper para copiar a URL do stream
  const handleCopyUrl = () => {
    if (!liveStream.streamUrl) return;
    navigator.clipboard?.writeText(liveStream.streamUrl).catch(() => {});
    setCopiedUrl(true);
    showToast('URL da transmissão copiada para a área de transferência!');
    setTimeout(() => {
      setCopiedUrl(false);
    }, 2000);
  };

  // Descartar alterações pendentes
  const handleDiscard = () => {
    setLiveStream(JSON.parse(JSON.stringify(savedLiveStream)));
    showToast('Alterações descartadas com sucesso.');
  };

  // Salvar alterações em memória
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    if (!liveStream.title.trim()) {
      showToast('O título da transmissão é obrigatório.');
      return;
    }

    setIsSaving(true);
    setTimeout(() => {
      const updated: ChurchLiveStreamInfo = {
        ...liveStream,
        updatedAt: new Date().toISOString(),
      };
      cmsRepository.saveLiveStream(updated);
      setLiveStream(updated);
      setSavedLiveStream(JSON.parse(JSON.stringify(updated)));
      setIsSaving(false);
      showToast('Configurações de Transmissão ao Vivo salvas no armazenamento local!');
    }, 400);
  };

  // Atualização genérica de campos da interface
  const handleChange = <K extends keyof ChurchLiveStreamInfo>(
    field: K,
    value: ChurchLiveStreamInfo[K]
  ) => {
    setLiveStream((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Helper para converter ISO string para input type="datetime-local" (YYYY-MM-DDTHH:mm)
  const isoToDatetimeLocal = (isoString?: string): string => {
    if (!isoString) return '';
    try {
      const d = new Date(isoString);
      if (isNaN(d.getTime())) return '';
      const pad = (n: number) => n.toString().padStart(2, '0');
      const year = d.getFullYear();
      const month = pad(d.getMonth() + 1);
      const day = pad(d.getDate());
      const hours = pad(d.getHours());
      const minutes = pad(d.getMinutes());
      return `${year}-${month}-${day}T${hours}:${minutes}`;
    } catch {
      return '';
    }
  };

  // Helper para converter input datetime-local para ISO string
  const datetimeLocalToIso = (localString: string): string | undefined => {
    if (!localString) return undefined;
    try {
      const d = new Date(localString);
      if (isNaN(d.getTime())) return undefined;
      return d.toISOString();
    } catch {
      return undefined;
    }
  };

  // Validação visual de URL simples e não intrusiva (sem requisições externas)
  const isUrlValid = (url?: string): boolean => {
    if (!url || !url.trim()) return true; // campo opcional no contrato
    return /^https?:\/\/.+\..+/i.test(url.trim());
  };

  return (
    <div id="livestream-management-view" className="space-y-6">
      {/* Toast de Notificação */}
      {feedbackToast && (
        <div
          id="livestream-toast-notification"
          className="fixed bottom-6 right-6 z-50 bg-stone-900 text-white text-xs font-semibold px-4 py-3 rounded-xl shadow-lg flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 duration-200 border border-stone-800"
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{feedbackToast}</span>
        </div>
      )}

      {/* Cabeçalho do Módulo */}
      <div
        id="livestream-header"
        className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-stone-200"
      >
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-red-700 bg-red-50 px-2.5 py-0.5 rounded-full border border-red-200 uppercase tracking-wider">
              Fase 49
            </span>
            <span className="text-xs font-semibold text-stone-600 bg-stone-100 px-2 py-0.5 rounded-md border border-stone-200">
              Tenant: {liveStream.tenantId}
            </span>
            <span
              className={`text-xs font-semibold px-2.5 py-0.5 rounded-md border inline-flex items-center gap-1.5 ${
                liveStream.status === 'live'
                  ? 'bg-red-50 text-red-700 border-red-200'
                  : liveStream.status === 'scheduled'
                  ? 'bg-blue-50 text-blue-700 border-blue-200'
                  : 'bg-stone-100 text-stone-600 border-stone-200'
              }`}
            >
              {liveStream.status === 'live' && (
                <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse" />
              )}
              {liveStream.status === 'live'
                ? 'Ao Vivo'
                : liveStream.status === 'scheduled'
                ? 'Agendada'
                : 'Offline'}
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight flex items-center gap-2.5">
            <Radio className="w-6 h-6 text-red-600" />
            Transmissão ao Vivo
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1 max-w-2xl">
            Gestão visual e declarativa das informações do player de transmissão
            ao vivo, links oficiais de cultos e agendamento para a comunidade.
          </p>
        </div>

        {/* Botões de Ação do Cabeçalho */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            id="livestream-discard-btn"
            onClick={handleDiscard}
            disabled={!hasUnsavedChanges || isSaving}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-stone-300 bg-white text-xs font-semibold text-stone-700 hover:bg-stone-50 active:bg-stone-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Descartar
          </button>

          <button
            type="button"
            id="livestream-save-btn"
            onClick={handleSave}
            disabled={!hasUnsavedChanges || isSaving}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-stone-900 hover:bg-stone-800 active:bg-black text-xs font-bold text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-xs"
          >
            {isSaving ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Salvando...
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5 text-red-400" />
                Salvar Configurações
              </>
            )}
          </button>
        </div>
      </div>

      {/* Alerta de Alterações Não Salvas (Dirty State) */}
      {hasUnsavedChanges && (
        <div
          id="livestream-unsaved-banner"
          className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-between gap-3 text-amber-900 animate-in fade-in duration-150"
        >
          <div className="flex items-center gap-2 text-xs">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              Você possui <strong>alterações não salvas</strong> nas
              configurações de Transmissão ao Vivo.
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleDiscard}
              className="text-xs font-semibold text-amber-800 hover:text-amber-950 underline px-2 py-1"
            >
              Descartar
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="text-xs font-bold bg-amber-700 hover:bg-amber-800 text-white px-3 py-1 rounded-md transition-colors"
            >
              Salvar Agora
            </button>
          </div>
        </div>
      )}

      {/* Resumo Visual / Métricas Derivadas dos Dados Reais */}
      <div
        id="livestream-status-grid"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5"
      >
        <div className="p-4 rounded-xl border border-stone-200 bg-white">
          <div className="text-[11px] font-bold uppercase tracking-wider text-stone-500 mb-1">
            Status da Transmissão
          </div>
          <div className="flex items-center gap-2">
            <div
              className={`w-2.5 h-2.5 rounded-full ${
                liveStream.status === 'live'
                  ? 'bg-red-500 animate-pulse'
                  : liveStream.status === 'scheduled'
                  ? 'bg-blue-500'
                  : 'bg-stone-400'
              }`}
            />
            <span className="text-base font-bold text-stone-900">
              {liveStream.status === 'live'
                ? 'Ao Vivo no Ar'
                : liveStream.status === 'scheduled'
                ? 'Agendada'
                : 'Offline / Inativa'}
            </span>
          </div>
          <p className="text-[11px] text-stone-500 mt-1">
            {liveStream.status === 'live'
              ? 'Exibindo badge e destaque no site'
              : liveStream.status === 'scheduled'
              ? 'Com data e horário programados'
              : 'Player oculto ou inativo'}
          </p>
        </div>

        <div className="p-4 rounded-xl border border-stone-200 bg-white">
          <div className="text-[11px] font-bold uppercase tracking-wider text-stone-500 mb-1">
            Endereço do Stream
          </div>
          <div className="flex items-center gap-1.5">
            <LinkIcon className="w-4 h-4 text-stone-700 shrink-0" />
            <span className="text-base font-bold text-stone-900 truncate">
              {liveStream.streamUrl?.trim() ? 'Configurado' : 'Não Informado'}
            </span>
          </div>
          <p className="text-[11px] text-stone-500 mt-1 truncate">
            {liveStream.streamUrl?.trim()
              ? isUrlValid(liveStream.streamUrl)
                ? 'Formato válido de URL'
                : 'Aviso: URL incompleta'
              : 'Nenhum link associado'}
          </p>
        </div>

        <div className="p-4 rounded-xl border border-stone-200 bg-white">
          <div className="text-[11px] font-bold uppercase tracking-wider text-stone-500 mb-1">
            Próxima Programação
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-blue-600 shrink-0" />
            <span className="text-base font-bold text-stone-900 truncate">
              {liveStream.scheduledAt
                ? new Date(liveStream.scheduledAt).toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                  })
                : 'Sem Agendamento'}
            </span>
          </div>
          <p className="text-[11px] text-stone-500 mt-1">
            {liveStream.scheduledAt
              ? 'Horário agendado para o culto'
              : 'Data não informada'}
          </p>
        </div>

        <div className="p-4 rounded-xl border border-stone-200 bg-white">
          <div className="text-[11px] font-bold uppercase tracking-wider text-stone-500 mb-1">
            Detalhes Pastorais
          </div>
          <div className="flex items-center gap-1.5">
            <FileText className="w-4 h-4 text-amber-600 shrink-0" />
            <span className="text-base font-bold text-stone-900 truncate">
              {liveStream.title ? 'Título Definido' : 'Sem Título'}
            </span>
          </div>
          <p className="text-[11px] text-stone-500 mt-1">
            {liveStream.description?.trim()
              ? 'Descrição configurada'
              : 'Sem descrição textual'}
          </p>
        </div>
      </div>

      {/* Alternador de Visualização (Configurações vs Pré-Visualização) */}
      <div className="flex items-center gap-2 p-1 bg-stone-100 rounded-xl w-fit border border-stone-200">
        <button
          type="button"
          id="livestream-tab-editor"
          onClick={() => setActiveTab('editor')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
            activeTab === 'editor'
              ? 'bg-white text-stone-900 shadow-xs'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          Formulário de Configuração
        </button>
        <button
          type="button"
          id="livestream-tab-preview"
          onClick={() => setActiveTab('preview')}
          className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
            activeTab === 'preview'
              ? 'bg-white text-stone-900 shadow-xs'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <Eye className="w-3.5 h-3.5 text-stone-500" />
          Pré-Visualização do Site
        </button>
      </div>

      {/* Conteúdo da Aba Ativa */}
      {activeTab === 'preview' ? (
        <LiveStreamPreview liveStream={liveStream} />
      ) : (
        <form onSubmit={handleSave} className="space-y-6">
          {/* Seção 1: Status da Transmissão */}
          <SettingsSectionCard
            id="livestream-status-section"
            title="Status da Transmissão"
            subtitle="Controle declarativo do estado da exibição ao vivo para os membros e visitantes."
            icon={<Radio className="w-4 h-4 text-red-600" />}
            badge="Contrato Canônico"
          >
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                Selecione o Estado Atual <span className="text-red-500">*</span>
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Opção: Ao Vivo */}
                <button
                  type="button"
                  id="livestream-status-live-btn"
                  onClick={() => handleChange('status', 'live')}
                  className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                    liveStream.status === 'live'
                      ? 'border-red-500 bg-red-50/70 ring-2 ring-red-500/20'
                      : 'border-stone-200 bg-white hover:bg-stone-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-red-900 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
                      Ao Vivo
                    </span>
                    <Radio className="w-4 h-4 text-red-600" />
                  </div>
                  <p className="text-[11px] text-stone-600 leading-relaxed">
                    Culto transmitido em tempo real. O player exibe o badge
                    vermelho de destaque.
                  </p>
                </button>

                {/* Opção: Agendada */}
                <button
                  type="button"
                  id="livestream-status-scheduled-btn"
                  onClick={() => handleChange('status', 'scheduled')}
                  className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                    liveStream.status === 'scheduled'
                      ? 'border-blue-500 bg-blue-50/70 ring-2 ring-blue-500/20'
                      : 'border-stone-200 bg-white hover:bg-stone-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-blue-900 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-blue-600" />
                      Agendada
                    </span>
                    <Clock className="w-4 h-4 text-blue-600" />
                  </div>
                  <p className="text-[11px] text-stone-600 leading-relaxed">
                    Transmissão futura com data e hora para os fiéis programarem o
                    acompanhamento.
                  </p>
                </button>

                {/* Opção: Offline */}
                <button
                  type="button"
                  id="livestream-status-offline-btn"
                  onClick={() => handleChange('status', 'offline')}
                  className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                    liveStream.status === 'offline'
                      ? 'border-stone-500 bg-stone-100 ring-2 ring-stone-400/20'
                      : 'border-stone-200 bg-white hover:bg-stone-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
                      <VideoOff className="w-3.5 h-3.5 text-stone-500" />
                      Offline / Encerrada
                    </span>
                    <VideoOff className="w-4 h-4 text-stone-500" />
                  </div>
                  <p className="text-[11px] text-stone-600 leading-relaxed">
                    Nenhuma transmissão ativa. O site orienta para os sermões
                    gravados da igreja.
                  </p>
                </button>
              </div>
            </div>
          </SettingsSectionCard>

          {/* Seção 2: Informações Editoriais */}
          <SettingsSectionCard
            id="livestream-details-section"
            title="Informações Principais da Transmissão"
            subtitle="Título e mensagem pastoral exibidos no cabeçalho do player e no site público."
            icon={<FileText className="w-4 h-4 text-amber-700" />}
            badge="Editorial"
          >
            {/* Título */}
            <div>
              <label
                htmlFor="livestream-title-input"
                className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5"
              >
                Título do Culto / Evento <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="livestream-title-input"
                value={liveStream.title}
                onChange={(e) => handleChange('title', e.target.value)}
                placeholder="Ex: Culto de Celebração & Ceia do Senhor — Ao Vivo"
                required
                className="w-full px-3.5 py-2.5 rounded-lg border border-stone-300 bg-white text-stone-900 text-sm focus:outline-hidden focus:ring-2 focus:ring-red-500/20 focus:border-red-600"
              />
              <p className="text-[11px] text-stone-500 mt-1">
                Nome da celebração exibido em destaque no player ao vivo.
              </p>
            </div>

            {/* Descrição Pastoral */}
            <div>
              <label
                htmlFor="livestream-description-input"
                className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5"
              >
                Descrição / Mensagem Pastoral (Opcional)
              </label>
              <textarea
                id="livestream-description-input"
                rows={3}
                value={liveStream.description || ''}
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder="Ex: Acompanhe nossa transmissão ao vivo todos os domingos às 10h e 18h. Participe da adoração comunitária..."
                className="w-full px-3.5 py-2.5 rounded-lg border border-stone-300 bg-white text-stone-900 text-sm focus:outline-hidden focus:ring-2 focus:ring-red-500/20 focus:border-red-600"
              />
              <p className="text-[11px] text-stone-500 mt-1">
                Breve texto acolhedor ou tema bíblico da transmissão para os
                membros que acompanham online.
              </p>
            </div>
          </SettingsSectionCard>

          {/* Seção 3: Endereço do Stream (URL) */}
          <SettingsSectionCard
            id="livestream-url-section"
            title="Endereço da Transmissão (URL)"
            subtitle="Link oficial do canal ou da transmissão pública onde o culto está sendo gerado."
            icon={<LinkIcon className="w-4 h-4 text-stone-700" />}
            badge="URL Declarativa"
          >
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="livestream-streamurl-input"
                  className="block text-xs font-bold text-stone-700 uppercase tracking-wider"
                >
                  URL da Transmissão
                </label>
                {liveStream.streamUrl && !isUrlValid(liveStream.streamUrl) && (
                  <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md">
                    Aviso: Insira uma URL completa (ex: https://...)
                  </span>
                )}
              </div>

              <div className="flex gap-2">
                <input
                  type="url"
                  id="livestream-streamurl-input"
                  value={liveStream.streamUrl || ''}
                  onChange={(e) => handleChange('streamUrl', e.target.value)}
                  placeholder="Ex: https://www.youtube.com/watch?v=culto_ao_vivo"
                  className="flex-1 px-3.5 py-2.5 rounded-lg border border-stone-300 bg-white text-stone-900 text-sm font-mono focus:outline-hidden focus:ring-2 focus:ring-red-500/20 focus:border-red-600"
                />

                <button
                  type="button"
                  id="livestream-copy-url-btn"
                  onClick={handleCopyUrl}
                  disabled={!liveStream.streamUrl?.trim()}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-lg border border-stone-300 bg-stone-50 hover:bg-stone-100 active:bg-stone-200 text-xs font-bold text-stone-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                >
                  {copiedUrl ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span>Copiado!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 text-stone-500" />
                      <span>Copiar</span>
                    </>
                  )}
                </button>
              </div>

              <p className="text-[11px] text-stone-500 mt-1.5">
                Pode ser o link do YouTube Live, Vimeo, Facebook Watch ou da página
                oficial de transmissão da igreja.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 flex items-start gap-2.5 text-xs text-stone-600">
              <Info className="w-4 h-4 text-stone-500 shrink-0 mt-0.5" />
              <p>
                <strong>Operação Declarativa:</strong> O CMS armazena o endereço de
                forma segura e o disponibiliza para o site público. Nenhuma chamada
                externa de scraping ou conexão a APIs é executada pelo painel
                administrativo.
              </p>
            </div>
          </SettingsSectionCard>

          {/* Seção 4: Agendamento de Culto ao Vivo */}
          <SettingsSectionCard
            id="livestream-schedule-section"
            title="Agendamento da Próxima Transmissão"
            subtitle="Data e horário da próxima celebração com transmissão ao vivo programada."
            icon={<Calendar className="w-4 h-4 text-blue-700" />}
            badge="Programação"
          >
            <div>
              <label
                htmlFor="livestream-scheduledat-input"
                className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5"
              >
                Data e Horário de Início
              </label>

              <div className="max-w-xs">
                <input
                  type="datetime-local"
                  id="livestream-scheduledat-input"
                  value={isoToDatetimeLocal(liveStream.scheduledAt)}
                  onChange={(e) =>
                    handleChange('scheduledAt', datetimeLocalToIso(e.target.value))
                  }
                  className="w-full px-3.5 py-2.5 rounded-lg border border-stone-300 bg-white text-stone-900 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                />
              </div>

              <p className="text-[11px] text-stone-500 mt-1.5">
                Utilizado para informar aos membros quando a transmissão começará
                (especialmente útil quando o status for &quot;Agendada&quot;).
              </p>
            </div>
          </SettingsSectionCard>

          {/* Seção 5: Segurança & Fronteira Arquitetural */}
          <SettingsSectionCard
            id="livestream-security-card"
            title="Segurança & Fronteira Arquitetural"
            subtitle="Garantia de conformidade, ausência de ingestão de vídeo e isolamento multi-tenant."
            icon={<ShieldCheck className="w-4 h-4 text-emerald-700" />}
            badge="Fase 49"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 text-xs text-stone-600">
              <div className="p-3.5 rounded-xl border border-stone-200 bg-stone-50 flex items-start gap-2.5">
                <Lock className="w-4 h-4 text-stone-700 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-stone-900 block mb-0.5">
                    Zero Ingestão & Sem Servidor de Mídia
                  </span>
                  <p className="text-stone-500 text-[11px] leading-relaxed">
                    O CMS gerencia unicamente os dados informativos e links da
                    transmissão. Não há tráfego de vídeo pesado, RTMP, HLS ou
                    transcoding nos servidores do sistema.
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl border border-stone-200 bg-stone-50 flex items-start gap-2.5">
                <Radio className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-stone-900 block mb-0.5">
                    Isolamento Multi-Tenant Estrito
                  </span>
                  <p className="text-stone-500 text-[11px] leading-relaxed">
                    A configuração do live stream é vinculada exclusivamente ao
                    tenant atual ({liveStream.tenantId}). Não há compartilhamento
                    ou vazamento de dados entre diferentes igrejas.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-red-50/70 border border-red-200/80 flex items-center gap-2 text-xs text-red-900">
              <Sparkles className="w-4 h-4 text-red-700 shrink-0" />
              <span>
                Última atualização registrada no estado:{' '}
                <strong>
                  {liveStream.updatedAt
                    ? new Date(liveStream.updatedAt).toLocaleString('pt-BR')
                    : 'Não informada'}
                </strong>
              </span>
            </div>
          </SettingsSectionCard>

          {/* Botões do Rodapé do Formulário */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-200">
            <button
              type="button"
              id="livestream-footer-discard-btn"
              onClick={handleDiscard}
              disabled={!hasUnsavedChanges || isSaving}
              className="px-4 py-2.5 rounded-lg border border-stone-300 bg-white text-xs font-semibold text-stone-700 hover:bg-stone-50 active:bg-stone-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Descartar Alterações
            </button>

            <button
              type="submit"
              id="livestream-footer-save-btn"
              disabled={!hasUnsavedChanges || isSaving}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-stone-900 hover:bg-stone-800 active:bg-black text-xs font-bold text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-xs"
            >
              {isSaving ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Salvando Dados...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 text-red-400" />
                  <span>Salvar Configurações de Transmissão</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
