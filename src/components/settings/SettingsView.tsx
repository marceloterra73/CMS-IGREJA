import React, { useState } from 'react';
import {
  Settings,
  Building2,
  MapPin,
  Phone,
  Share2,
  Sliders,
  Save,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Image as ImageIcon,
  ExternalLink,
  Trash2,
  Calendar,
  Globe,
  Clock,
} from 'lucide-react';
import {
  InstitutionalContent,
  SiteSettings,
  ChurchProfile,
  ChurchAddress,
  ChurchContact,
  ChurchSocialLinks,
  MediaItem,
} from '../../types';
import {
  INITIAL_DEMO_INSTITUTIONAL,
  INITIAL_DEMO_SITE_SETTINGS,
} from './demoSettingsData';
import { cmsRepository } from '../../core/persistence';
import { SettingsSectionCard } from './SettingsSectionCard';
import { MediaPickerModal } from '../media/MediaPickerModal';

export const SettingsView: React.FC = () => {
  // Estado original salvo (fonte canônica persistida)
  const [savedInstitutional, setSavedInstitutional] = useState<InstitutionalContent>(() =>
    cmsRepository.loadInstitutional()
  );
  const [savedSettings, setSavedSettings] = useState<SiteSettings>(() =>
    cmsRepository.loadSettings()
  );

  // Estado em edição ativa no formulário
  const [institutionalData, setInstitutionalData] = useState<InstitutionalContent>(() =>
    cmsRepository.loadInstitutional()
  );
  const [settingsData, setSettingsData] = useState<SiteSettings>(() =>
    cmsRepository.loadSettings()
  );

  // Controle do MediaPickerModal para Logo e Favicon
  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);
  const [mediaTarget, setMediaTarget] = useState<'logo' | 'favicon' | null>(null);

  // Estados de feedback visual
  const [feedbackToast, setFeedbackToast] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [hasErrors, setHasErrors] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Detecta alterações pendentes comparando com os valores salvos
  const hasUnsavedChanges =
    JSON.stringify(institutionalData) !== JSON.stringify(savedInstitutional) ||
    JSON.stringify(settingsData) !== JSON.stringify(savedSettings);

  // Helpers para atualização de dados aninhados
  const handleProfileChange = (field: keyof ChurchProfile, value: any) => {
    setInstitutionalData((prev) => ({
      ...prev,
      profile: {
        ...prev.profile,
        [field]: value,
      },
    }));
  };

  const handleAddressChange = (field: keyof ChurchAddress, value: string) => {
    setInstitutionalData((prev) => ({
      ...prev,
      address: {
        ...(prev.address || {
          street: '',
          city: '',
          state: '',
        }),
        [field]: value,
      },
    }));
  };

  const handleContactChange = (field: keyof ChurchContact, value: string) => {
    setInstitutionalData((prev) => ({
      ...prev,
      contact: {
        ...(prev.contact || {
          email: '',
        }),
        [field]: value,
      },
    }));
  };

  const handleSocialChange = (field: keyof ChurchSocialLinks, value: string) => {
    setInstitutionalData((prev) => ({
      ...prev,
      socialLinks: {
        ...(prev.socialLinks || {}),
        [field]: value,
      },
    }));
  };

  const handleSettingsChange = (field: keyof SiteSettings, value: any) => {
    setSettingsData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Seleção de mídia via MediaPickerModal existente
  const handleOpenMediaPicker = (target: 'logo' | 'favicon') => {
    setMediaTarget(target);
    setIsMediaPickerOpen(true);
  };

  const handleSelectMedia = (media: MediaItem) => {
    if (mediaTarget === 'logo') {
      setInstitutionalData((prev) => ({
        ...prev,
        profile: {
          ...prev.profile,
          logoMediaId: media.id,
          logoUrl: media.url,
        },
      }));
    } else if (mediaTarget === 'favicon') {
      setSettingsData((prev) => ({
        ...prev,
        faviconMediaId: media.id,
        faviconUrl: media.url,
      }));
    }
    setIsMediaPickerOpen(false);
    setMediaTarget(null);
  };

  const handleRemoveMedia = (target: 'logo' | 'favicon') => {
    if (target === 'logo') {
      setInstitutionalData((prev) => ({
        ...prev,
        profile: {
          ...prev.profile,
          logoMediaId: undefined,
          logoUrl: undefined,
        },
      }));
    } else if (target === 'favicon') {
      setSettingsData((prev) => ({
        ...prev,
        faviconMediaId: undefined,
        faviconUrl: undefined,
      }));
    }
  };

  // Cancelar alterações
  const handleCancel = () => {
    setInstitutionalData(savedInstitutional);
    setSettingsData(savedSettings);
    setValidationError(null);
    setHasErrors(false);
    showToast('Alterações descartadas. Valores originais restaurados.');
  };

  // Salvar alterações
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    // Validações mínimas de campos obrigatórios
    if (!institutionalData.profile.name?.trim()) {
      setValidationError('O Nome da Igreja é obrigatório.');
      setHasErrors(true);
      return;
    }

    if (!settingsData.siteName?.trim()) {
      setValidationError('O Nome Público do Site é obrigatório.');
      setHasErrors(true);
      return;
    }

    if (!institutionalData.contact?.email?.trim()) {
      setValidationError('O E-mail institucional de contato é obrigatório.');
      setHasErrors(true);
      return;
    }

    setValidationError(null);
    setHasErrors(false);
    setIsSaving(true);

    const nowIso = new Date().toISOString();
    const updatedInstitutional: InstitutionalContent = {
      ...institutionalData,
      updatedAt: nowIso,
    };
    const updatedSiteSettings: SiteSettings = {
      ...settingsData,
      updatedAt: nowIso,
    };

    setTimeout(() => {
      cmsRepository.saveInstitutional(updatedInstitutional);
      cmsRepository.saveSettings(updatedSiteSettings);
      setSavedInstitutional(updatedInstitutional);
      setSavedSettings(updatedSiteSettings);
      setInstitutionalData(updatedInstitutional);
      setSettingsData(updatedSiteSettings);
      setIsSaving(false);
      showToast('Configurações salvas com sucesso no armazenamento local!');
    }, 400);
  };

  const showToast = (msg: string) => {
    setFeedbackToast(msg);
    setTimeout(() => {
      setFeedbackToast(null);
    }, 3500);
  };

  return (
    <div id="settings-view" className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Toast de Notificação */}
      {feedbackToast && (
        <div
          id="settings-feedback-toast"
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-stone-900 text-white px-4 py-3 rounded-lg shadow-lg border border-stone-800 text-sm animate-in fade-in slide-in-from-bottom-2 duration-200"
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{feedbackToast}</span>
        </div>
      )}

      {/* Cabeçalho Padronizado da Seção */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-stone-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight">
              Configurações Gerais
            </h1>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 border border-amber-200">
              Fase 42
            </span>
          </div>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Gestão da identidade institucional da congregação, endereço, canais oficiais e parâmetros do site.
          </p>
        </div>

        {/* Botões de Ação de Topo */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={handleCancel}
            disabled={!hasUnsavedChanges || isSaving}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900 bg-white hover:bg-stone-50 border border-stone-200 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-xs"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Descartar</span>
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={!hasUnsavedChanges || isSaving}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-lg transition-colors shadow-xs disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="w-3.5 h-3.5 text-amber-400" />
            <span>{isSaving ? 'Salvando...' : 'Salvar Configurações'}</span>
          </button>
        </div>
      </div>

      {/* Alerta de Alterações Pendentes */}
      {hasUnsavedChanges && (
        <div
          id="unsaved-changes-banner"
          className="flex items-center justify-between p-3.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-xs"
        >
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            <span className="font-semibold">Você possui alterações não salvas.</span>
            <span className="hidden sm:inline text-amber-700">
              Clique em "Salvar Configurações" para confirmar suas edições.
            </span>
          </div>
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="font-bold underline hover:text-amber-950 transition-colors"
          >
            Salvar agora
          </button>
        </div>
      )}

      {/* Alerta de Validação com Erro */}
      {hasErrors && validationError && (
        <div
          id="validation-error-banner"
          className="flex items-center gap-2 p-3.5 rounded-lg bg-red-50 border border-red-200 text-red-900 text-xs"
        >
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          <span className="font-medium">{validationError}</span>
        </div>
      )}

      {/* Formulário Principal Estruturado em Seções Canônicas */}
      <form onSubmit={handleSave} className="space-y-6">
        {/* 1. IDENTIDADE DA IGREJA (ChurchProfile - Fase 11) */}
        <SettingsSectionCard
          id="section-church-identity"
          title="Identidade Institucional da Igreja"
          subtitle="Dados oficiais da congregação conforme o contrato canônico ChurchProfile (Fase 11)"
          icon={<Building2 className="w-4 h-4 text-amber-600" />}
          badge="ChurchProfile"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Nome Oficial da Igreja <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={institutionalData.profile.name || ''}
                onChange={(e) => handleProfileChange('name', e.target.value)}
                placeholder="Ex: Igreja Batista Central"
                className="w-full text-xs px-3 py-2 border border-stone-300 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-stone-900 focus:border-stone-900 bg-white"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Nome Curto / Sigla
              </label>
              <input
                type="text"
                value={institutionalData.profile.shortName || ''}
                onChange={(e) => handleProfileChange('shortName', e.target.value)}
                placeholder="Ex: IBC Central"
                className="w-full text-xs px-3 py-2 border border-stone-300 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-stone-900 focus:border-stone-900 bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Pastor Presidente / Líder Principal
              </label>
              <input
                type="text"
                value={institutionalData.profile.leadPastor || ''}
                onChange={(e) => handleProfileChange('leadPastor', e.target.value)}
                placeholder="Ex: Pr. Alexandre Mendes"
                className="w-full text-xs px-3 py-2 border border-stone-300 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-stone-900 focus:border-stone-900 bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Denominação / Convenção
              </label>
              <input
                type="text"
                value={institutionalData.profile.denomination || ''}
                onChange={(e) => handleProfileChange('denomination', e.target.value)}
                placeholder="Ex: Batista, Presbiteriana, Assembleia de Deus..."
                className="w-full text-xs px-3 py-2 border border-stone-300 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-stone-900 focus:border-stone-900 bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Ano de Fundação
              </label>
              <input
                type="number"
                value={institutionalData.profile.foundingYear || ''}
                onChange={(e) =>
                  handleProfileChange(
                    'foundingYear',
                    e.target.value ? parseInt(e.target.value, 10) : undefined
                  )
                }
                placeholder="Ex: 1984"
                min="1800"
                max={new Date().getFullYear()}
                className="w-full text-xs px-3 py-2 border border-stone-300 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-stone-900 focus:border-stone-900 bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Lema / Tagline
              </label>
              <input
                type="text"
                value={institutionalData.profile.tagline || ''}
                onChange={(e) => handleProfileChange('tagline', e.target.value)}
                placeholder="Ex: Comunhão, Adoração e Missão"
                className="w-full text-xs px-3 py-2 border border-stone-300 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-stone-900 focus:border-stone-900 bg-white"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Slogan Institucional
              </label>
              <input
                type="text"
                value={institutionalData.profile.slogan || ''}
                onChange={(e) => handleProfileChange('slogan', e.target.value)}
                placeholder="Ex: Lugar de recomeços e esperança viva"
                className="w-full text-xs px-3 py-2 border border-stone-300 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-stone-900 focus:border-stone-900 bg-white"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Descrição Institucional
              </label>
              <textarea
                rows={3}
                value={institutionalData.profile.description || ''}
                onChange={(e) => handleProfileChange('description', e.target.value)}
                placeholder="Apresentação institucional e visão da comunidade de fé..."
                className="w-full text-xs px-3 py-2 border border-stone-300 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-stone-900 focus:border-stone-900 bg-white leading-relaxed"
              />
            </div>

            {/* Logotipo da Igreja (logoMediaId e logoUrl) */}
            <div className="md:col-span-2 pt-2 border-t border-stone-100">
              <label className="block text-xs font-bold text-stone-700 mb-2">
                Logotipo da Igreja (Ativo de Mídia)
              </label>
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-3.5 bg-stone-50 rounded-lg border border-stone-200">
                {institutionalData.profile.logoUrl ? (
                  <div className="relative group w-24 h-24 rounded-lg bg-white border border-stone-200 overflow-hidden flex items-center justify-center p-2 shrink-0">
                    <img
                      src={institutionalData.profile.logoUrl}
                      alt="Logo da Igreja"
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                ) : (
                  <div className="w-24 h-24 rounded-lg bg-stone-200/70 border border-dashed border-stone-300 flex flex-col items-center justify-center text-stone-400 shrink-0">
                    <ImageIcon className="w-7 h-7 mb-1" />
                    <span className="text-[10px] font-medium">Sem logo</span>
                  </div>
                )}

                <div className="space-y-1.5 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleOpenMediaPicker('logo')}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-stone-800 bg-white hover:bg-stone-100 border border-stone-300 rounded-md transition-colors"
                    >
                      <ImageIcon className="w-3.5 h-3.5 text-amber-600" />
                      <span>
                        {institutionalData.profile.logoUrl
                          ? 'Alterar Logotipo'
                          : 'Selecionar da Biblioteca'}
                      </span>
                    </button>

                    {institutionalData.profile.logoUrl && (
                      <button
                        type="button"
                        onClick={() => handleRemoveMedia('logo')}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Remover</span>
                      </button>
                    )}
                  </div>
                  <p className="text-[11px] text-stone-500">
                    ID de Mídia:{' '}
                    <code className="font-mono text-[10px] bg-stone-200/60 px-1 py-0.5 rounded text-stone-700">
                      {institutionalData.profile.logoMediaId || 'Não vinculado'}
                    </code>
                  </p>
                  <p className="text-[11px] text-stone-400">
                    Recomendado: imagem transparente PNG ou SVG, proporção retangular ou quadrada.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </SettingsSectionCard>

        {/* 2. CONFIGURAÇÕES TÉCNICAS DO SITE (SiteSettings - Fase 17) */}
        <SettingsSectionCard
          id="section-site-settings"
          title="Informações e Preferências Gerais do Site"
          subtitle="Preferências técnicas e operacionais conforme o contrato canônico SiteSettings (Fase 17)"
          icon={<Sliders className="w-4 h-4 text-amber-600" />}
          badge="SiteSettings"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Nome Público do Site <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={settingsData.siteName || ''}
                onChange={(e) => handleSettingsChange('siteName', e.target.value)}
                placeholder="Ex: Igreja Batista Central — Portal Oficial"
                className="w-full text-xs px-3 py-2 border border-stone-300 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-stone-900 focus:border-stone-900 bg-white"
                required
              />
              <p className="text-[11px] text-stone-400 mt-1">
                Utilizado no cabeçalho do navegador e na identificação geral da plataforma.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Fuso Horário (Timezone)
              </label>
              <select
                value={settingsData.timezone || 'America/Sao_Paulo'}
                onChange={(e) => handleSettingsChange('timezone', e.target.value)}
                className="w-full text-xs px-3 py-2 border border-stone-300 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-stone-900 focus:border-stone-900 bg-white"
              >
                <option value="America/Sao_Paulo">Brasília (GMT-3) — America/Sao_Paulo</option>
                <option value="America/Manaus">Manaus (GMT-4) — America/Manaus</option>
                <option value="America/Belem">Belém (GMT-3) — America/Belem</option>
                <option value="America/Fortaleza">Fortaleza (GMT-3) — America/Fortaleza</option>
                <option value="America/Cuiaba">Cuiabá (GMT-4) — America/Cuiaba</option>
                <option value="America/Rio_Branco">Rio Branco (GMT-5) — America/Rio_Branco</option>
                <option value="Atlantic/Fernando_de_Noronha">Noronha (GMT-2)</option>
                <option value="UTC">UTC (Universal Time)</option>
              </select>
              <p className="text-[11px] text-stone-400 mt-1">
                Referência para agendamento de eventos, sermões e cultos ao vivo.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Idioma Principal (Language)
              </label>
              <select
                value={settingsData.language || 'pt-BR'}
                onChange={(e) => handleSettingsChange('language', e.target.value)}
                className="w-full text-xs px-3 py-2 border border-stone-300 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-stone-900 focus:border-stone-900 bg-white"
              >
                <option value="pt-BR">Português do Brasil (pt-BR)</option>
                <option value="en-US">English (en-US)</option>
                <option value="es-ES">Español (es-ES)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Localidade (Locale)
              </label>
              <input
                type="text"
                value={settingsData.locale || 'pt_BR'}
                onChange={(e) => handleSettingsChange('locale', e.target.value)}
                placeholder="Ex: pt_BR"
                className="w-full text-xs px-3 py-2 border border-stone-300 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-stone-900 focus:border-stone-900 bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Formato Padrão de Data
              </label>
              <select
                value={settingsData.dateFormat || 'DD/MM/YYYY'}
                onChange={(e) => handleSettingsChange('dateFormat', e.target.value)}
                className="w-full text-xs px-3 py-2 border border-stone-300 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-stone-900 focus:border-stone-900 bg-white"
              >
                <option value="DD/MM/YYYY">DD/MM/YYYY (Ex: 08/09/2026)</option>
                <option value="YYYY-MM-DD">YYYY-MM-DD (Ex: 2026-09-08)</option>
                <option value="D [de] MMMM [de] YYYY">
                  Extenso (Ex: 8 de setembro de 2026)
                </option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Formato de Hora
              </label>
              <select
                value={settingsData.timeFormat || '24h'}
                onChange={(e) => handleSettingsChange('timeFormat', e.target.value)}
                className="w-full text-xs px-3 py-2 border border-stone-300 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-stone-900 focus:border-stone-900 bg-white"
              >
                <option value="24h">24 horas (Ex: 19:30)</option>
                <option value="12h">12 horas AM/PM (Ex: 07:30 PM)</option>
              </select>
            </div>

            {/* Favicon do Site (faviconMediaId e faviconUrl) */}
            <div className="md:col-span-2 pt-2 border-t border-stone-100">
              <label className="block text-xs font-bold text-stone-700 mb-2">
                Ícone da Aba do Navegador (Favicon)
              </label>
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-3.5 bg-stone-50 rounded-lg border border-stone-200">
                {settingsData.faviconUrl ? (
                  <div className="w-14 h-14 rounded-lg bg-white border border-stone-200 overflow-hidden flex items-center justify-center p-1 shrink-0">
                    <img
                      src={settingsData.faviconUrl}
                      alt="Favicon do Site"
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                ) : (
                  <div className="w-14 h-14 rounded-lg bg-stone-200/70 border border-dashed border-stone-300 flex items-center justify-center text-stone-400 shrink-0">
                    <Globe className="w-5 h-5" />
                  </div>
                )}

                <div className="space-y-1.5 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleOpenMediaPicker('favicon')}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-stone-800 bg-white hover:bg-stone-100 border border-stone-300 rounded-md transition-colors"
                    >
                      <ImageIcon className="w-3.5 h-3.5 text-amber-600" />
                      <span>
                        {settingsData.faviconUrl ? 'Alterar Favicon' : 'Selecionar Favicon'}
                      </span>
                    </button>

                    {settingsData.faviconUrl && (
                      <button
                        type="button"
                        onClick={() => handleRemoveMedia('favicon')}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Remover</span>
                      </button>
                    )}
                  </div>
                  <p className="text-[11px] text-stone-500">
                    ID de Mídia:{' '}
                    <code className="font-mono text-[10px] bg-stone-200/60 px-1 py-0.5 rounded text-stone-700">
                      {settingsData.faviconMediaId || 'Não vinculado'}
                    </code>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </SettingsSectionCard>

        {/* 3. CONTATOS OFICIAIS (ChurchContact - Fase 11) */}
        <SettingsSectionCard
          id="section-church-contact"
          title="Canais de Contato Institucional"
          subtitle="Meios de comunicação oficiais da igreja conforme o contrato canônico ChurchContact"
          icon={<Phone className="w-4 h-4 text-amber-600" />}
          badge="ChurchContact"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                E-mail Institucional <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={institutionalData.contact?.email || ''}
                onChange={(e) => handleContactChange('email', e.target.value)}
                placeholder="contato@igreja.com.br"
                className="w-full text-xs px-3 py-2 border border-stone-300 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-stone-900 focus:border-stone-900 bg-white"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Telefone Fixo / Secretaria
              </label>
              <input
                type="tel"
                value={institutionalData.contact?.phone || ''}
                onChange={(e) => handleContactChange('phone', e.target.value)}
                placeholder="(11) 3456-7890"
                className="w-full text-xs px-3 py-2 border border-stone-300 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-stone-900 focus:border-stone-900 bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                WhatsApp Oficial de Atendimento
              </label>
              <input
                type="tel"
                value={institutionalData.contact?.whatsapp || ''}
                onChange={(e) => handleContactChange('whatsapp', e.target.value)}
                placeholder="(11) 98765-4321"
                className="w-full text-xs px-3 py-2 border border-stone-300 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-stone-900 focus:border-stone-900 bg-white"
              />
            </div>
          </div>
        </SettingsSectionCard>

        {/* 4. ENDEREÇO FÍSICO (ChurchAddress - Fase 11) */}
        <SettingsSectionCard
          id="section-church-address"
          title="Endereço e Sede da Congregação"
          subtitle="Localização física oficial da igreja conforme o contrato canônico ChurchAddress"
          icon={<MapPin className="w-4 h-4 text-amber-600" />}
          badge="ChurchAddress"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Logradouro (Rua / Avenida)
              </label>
              <input
                type="text"
                value={institutionalData.address?.street || ''}
                onChange={(e) => handleAddressChange('street', e.target.value)}
                placeholder="Ex: Avenida das Nações"
                className="w-full text-xs px-3 py-2 border border-stone-300 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-stone-900 focus:border-stone-900 bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Número
              </label>
              <input
                type="text"
                value={institutionalData.address?.number || ''}
                onChange={(e) => handleAddressChange('number', e.target.value)}
                placeholder="Ex: 1420"
                className="w-full text-xs px-3 py-2 border border-stone-300 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-stone-900 focus:border-stone-900 bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Complemento
              </label>
              <input
                type="text"
                value={institutionalData.address?.complement || ''}
                onChange={(e) => handleAddressChange('complement', e.target.value)}
                placeholder="Ex: Templo Sede / Bloco A"
                className="w-full text-xs px-3 py-2 border border-stone-300 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-stone-900 focus:border-stone-900 bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Bairro
              </label>
              <input
                type="text"
                value={institutionalData.address?.neighborhood || ''}
                onChange={(e) => handleAddressChange('neighborhood', e.target.value)}
                placeholder="Ex: Centro"
                className="w-full text-xs px-3 py-2 border border-stone-300 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-stone-900 focus:border-stone-900 bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Cidade
              </label>
              <input
                type="text"
                value={institutionalData.address?.city || ''}
                onChange={(e) => handleAddressChange('city', e.target.value)}
                placeholder="Ex: São Paulo"
                className="w-full text-xs px-3 py-2 border border-stone-300 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-stone-900 focus:border-stone-900 bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Estado (UF)
              </label>
              <input
                type="text"
                value={institutionalData.address?.state || ''}
                onChange={(e) => handleAddressChange('state', e.target.value)}
                placeholder="Ex: SP"
                maxLength={2}
                className="w-full text-xs px-3 py-2 border border-stone-300 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-stone-900 focus:border-stone-900 bg-white uppercase"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                CEP / Código Postal
              </label>
              <input
                type="text"
                value={institutionalData.address?.postalCode || ''}
                onChange={(e) => handleAddressChange('postalCode', e.target.value)}
                placeholder="Ex: 01310-100"
                className="w-full text-xs px-3 py-2 border border-stone-300 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-stone-900 focus:border-stone-900 bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                País
              </label>
              <input
                type="text"
                value={institutionalData.address?.country || 'Brasil'}
                onChange={(e) => handleAddressChange('country', e.target.value)}
                placeholder="Ex: Brasil"
                className="w-full text-xs px-3 py-2 border border-stone-300 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-stone-900 focus:border-stone-900 bg-white"
              />
            </div>
          </div>
        </SettingsSectionCard>

        {/* 5. REDES SOCIAIS (ChurchSocialLinks - Fase 11) */}
        <SettingsSectionCard
          id="section-church-social"
          title="Redes Sociais e Canais Oficiais"
          subtitle="Links dos perfis institucionais conforme o contrato canônico ChurchSocialLinks"
          icon={<Share2 className="w-4 h-4 text-amber-600" />}
          badge="ChurchSocialLinks"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Instagram Oficial
              </label>
              <div className="relative">
                <input
                  type="url"
                  value={institutionalData.socialLinks?.instagram || ''}
                  onChange={(e) => handleSocialChange('instagram', e.target.value)}
                  placeholder="https://instagram.com/ibcentral"
                  className="w-full text-xs px-3 py-2 border border-stone-300 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-stone-900 focus:border-stone-900 bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Canal no YouTube
              </label>
              <div className="relative">
                <input
                  type="url"
                  value={institutionalData.socialLinks?.youtube || ''}
                  onChange={(e) => handleSocialChange('youtube', e.target.value)}
                  placeholder="https://youtube.com/@ibcentral"
                  className="w-full text-xs px-3 py-2 border border-stone-300 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-stone-900 focus:border-stone-900 bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Página no Facebook
              </label>
              <div className="relative">
                <input
                  type="url"
                  value={institutionalData.socialLinks?.facebook || ''}
                  onChange={(e) => handleSocialChange('facebook', e.target.value)}
                  placeholder="https://facebook.com/ibcentral"
                  className="w-full text-xs px-3 py-2 border border-stone-300 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-stone-900 focus:border-stone-900 bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Spotify / Podcasts
              </label>
              <div className="relative">
                <input
                  type="url"
                  value={institutionalData.socialLinks?.spotify || ''}
                  onChange={(e) => handleSocialChange('spotify', e.target.value)}
                  placeholder="https://spotify.com/show/ibcpodcast"
                  className="w-full text-xs px-3 py-2 border border-stone-300 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-stone-900 focus:border-stone-900 bg-white"
                />
              </div>
            </div>
          </div>
        </SettingsSectionCard>

        {/* Barra de Ações Inferior */}
        <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-stone-200 shadow-xs">
          <div className="text-xs text-stone-500">
            Última atualização registrada:{' '}
            <span className="font-semibold text-stone-700">
              {new Date(savedInstitutional.updatedAt || Date.now()).toLocaleString('pt-BR')}
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={handleCancel}
              disabled={!hasUnsavedChanges || isSaving}
              className="px-3.5 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900 bg-stone-50 hover:bg-stone-100 border border-stone-200 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Descartar
            </button>

            <button
              type="submit"
              disabled={!hasUnsavedChanges || isSaving}
              className="inline-flex items-center gap-2 px-5 py-2 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-lg transition-colors shadow-xs disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-3.5 h-3.5 text-amber-400" />
              <span>{isSaving ? 'Salvando...' : 'Salvar Configurações'}</span>
            </button>
          </div>
        </div>
      </form>

      {/* Modal Reutilizável de Seleção da Biblioteca de Mídia */}
      <MediaPickerModal
        isOpen={isMediaPickerOpen}
        onClose={() => {
          setIsMediaPickerOpen(false);
          setMediaTarget(null);
        }}
        onSelectImage={handleSelectMedia}
        selectedMediaId={
          mediaTarget === 'logo'
            ? institutionalData.profile.logoMediaId
            : settingsData.faviconMediaId
        }
      />
    </div>
  );
};
