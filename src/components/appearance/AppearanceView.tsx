import React, { useState } from 'react';
import {
  Palette,
  Type,
  Maximize2,
  Square,
  Layers,
  Save,
  RotateCcw,
  CheckCircle2,
  Check,
  Sparkles,
  Sliders,
  Info,
} from 'lucide-react';
import {
  VisualTheme,
  ColorTokens,
  TypographyTokens,
  SpacingTokens,
  BorderTokens,
  ElevationTokens,
} from '../../types';
import { INITIAL_DEMO_THEMES } from './demoAppearanceData';
import { cmsRepository } from '../../core/persistence';
import { ThemePreview } from './ThemePreview';
import { SettingsSectionCard } from '../settings/SettingsSectionCard';

export const AppearanceView: React.FC = () => {
  // Lista de temas disponíveis (carregados do repositório canônico)
  const [themes, setThemes] = useState<VisualTheme[]>(() => cmsRepository.loadThemes());

  // ID do tema ativo atualmente selecionado
  const [activeThemeId, setActiveThemeId] = useState<string>(() =>
    cmsRepository.loadActiveThemeId()
  );

  // Cópia persistida/salva do tema sob edição
  const [savedTheme, setSavedTheme] = useState<VisualTheme>(() => {
    const loadedThemes = cmsRepository.loadThemes();
    const activeId = cmsRepository.loadActiveThemeId();
    const found = loadedThemes.find((t) => t.id === activeId);
    return JSON.parse(JSON.stringify(found || loadedThemes[0] || INITIAL_DEMO_THEMES[0]));
  });

  // Tema sob edição ativa no formulário
  const [currentTheme, setCurrentTheme] = useState<VisualTheme>(() => {
    const loadedThemes = cmsRepository.loadThemes();
    const activeId = cmsRepository.loadActiveThemeId();
    const found = loadedThemes.find((t) => t.id === activeId);
    return JSON.parse(JSON.stringify(found || loadedThemes[0] || INITIAL_DEMO_THEMES[0]));
  });

  // Feedback toast e status de salvamento
  const [feedbackToast, setFeedbackToast] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Detecta se há modificações não salvas
  const hasUnsavedChanges =
    JSON.stringify(currentTheme) !== JSON.stringify(savedTheme);

  // Troca o tema ativo
  const handleSelectTheme = (themeId: string) => {
    if (hasUnsavedChanges) {
      const confirmDiscard = window.confirm(
        'Você possui alterações não salvas no tema atual. Deseja descartá-las para alternar de tema?'
      );
      if (!confirmDiscard) return;
    }

    const nextTheme = themes.find((t) => t.id === themeId);
    if (nextTheme) {
      setActiveThemeId(themeId);
      cmsRepository.saveActiveThemeId(themeId);
      const cloned = JSON.parse(JSON.stringify(nextTheme));
      setSavedTheme(cloned);
      setCurrentTheme(cloned);
      showToast(`Tema "${nextTheme.name}" selecionado.`);
    }
  };

  // Helpers para edição de cada sub-grupo canônico de DesignTokens
  const handleColorChange = (field: keyof ColorTokens, value: string) => {
    setCurrentTheme((prev) => ({
      ...prev,
      tokens: {
        ...prev.tokens,
        colors: {
          ...prev.tokens.colors,
          [field]: value,
        },
      },
    }));
  };

  const handleTypographyChange = (field: keyof TypographyTokens, value: any) => {
    setCurrentTheme((prev) => ({
      ...prev,
      tokens: {
        ...prev.tokens,
        typography: {
          ...prev.tokens.typography,
          [field]: value,
        },
      },
    }));
  };

  const handleSpacingChange = (field: keyof SpacingTokens, value: string) => {
    setCurrentTheme((prev) => ({
      ...prev,
      tokens: {
        ...prev.tokens,
        spacing: {
          ...prev.tokens.spacing,
          [field]: value,
        },
      },
    }));
  };

  const handleBorderChange = (field: keyof BorderTokens, value: string) => {
    setCurrentTheme((prev) => ({
      ...prev,
      tokens: {
        ...prev.tokens,
        borders: {
          ...prev.tokens.borders,
          [field]: value,
        },
      },
    }));
  };

  const handleElevationChange = (field: keyof ElevationTokens, value: string) => {
    setCurrentTheme((prev) => ({
      ...prev,
      tokens: {
        ...prev.tokens,
        elevations: {
          ...(prev.tokens.elevations || {
            shadowNone: 'none',
            shadowLow: '0 1px 2px 0 rgba(0,0,0,0.05)',
            shadowMedium: '0 4px 6px -1px rgba(0,0,0,0.1)',
            shadowHigh: '0 10px 15px -3px rgba(0,0,0,0.1)',
          }),
          [field]: value,
        },
      },
    }));
  };

  // Cancelar edições
  const handleCancel = () => {
    setCurrentTheme(JSON.parse(JSON.stringify(savedTheme)));
    showToast('Alterações no tema descartadas.');
  };

  // Salvar edições
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    const nowIso = new Date().toISOString();
    const updatedTheme: VisualTheme = {
      ...currentTheme,
      updatedAt: nowIso,
    };

    setTimeout(() => {
      cmsRepository.saveActiveTheme(updatedTheme);
      setThemes((prev) =>
        prev.map((t) => (t.id === updatedTheme.id ? updatedTheme : t))
      );
      setSavedTheme(updatedTheme);
      setCurrentTheme(updatedTheme);
      setIsSaving(false);
      showToast('Configurações do tema salvas no armazenamento local!');
    }, 400);
  };

  const showToast = (msg: string) => {
    setFeedbackToast(msg);
    setTimeout(() => {
      setFeedbackToast(null);
    }, 3500);
  };

  return (
    <div id="appearance-view" className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Toast de Notificação */}
      {feedbackToast && (
        <div
          id="appearance-feedback-toast"
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
              Aparência & Temas Visuais
            </h1>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 border border-amber-200">
              Fase 43
            </span>
          </div>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Gestão dos Design Tokens e Temas Visuais do CMS conforme os contratos canônicos da Fase 8.
          </p>
        </div>

        {/* Ações de Topo */}
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
            <span>{isSaving ? 'Salvando...' : 'Salvar Tema'}</span>
          </button>
        </div>
      </div>

      {/* Alerta de Modificações Pendentes */}
      {hasUnsavedChanges && (
        <div
          id="appearance-unsaved-banner"
          className="flex items-center justify-between p-3.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-xs"
        >
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            <span className="font-semibold">Existem alterações não salvas nos tokens visuais.</span>
            <span className="hidden sm:inline text-amber-700">
              Clique em "Salvar Tema" para registrar suas personalizações.
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

      {/* 1. SELEÇÃO DE TEMA CANÔNICO (VisualTheme) */}
      <section
        id="section-theme-selection"
        className="bg-white rounded-xl border border-stone-200 shadow-xs overflow-hidden"
      >
        <div className="px-5 py-4 border-b border-stone-100 flex items-center justify-between bg-stone-50/50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-stone-100 text-stone-700 flex items-center justify-center shrink-0 border border-stone-200">
              <Sparkles className="w-4 h-4 text-amber-600" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-stone-900 tracking-tight">
                Temas Visuais Cadastrados
              </h2>
              <p className="text-xs text-stone-500">
                Selecione o tema canônico ativo conforme a interface VisualTheme
              </p>
            </div>
          </div>
          <span className="text-[11px] font-semibold text-stone-600 bg-stone-100 border border-stone-200 px-2 py-0.5 rounded-md">
            VisualTheme
          </span>
        </div>

        <div className="p-5 sm:p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          {themes.map((themeItem) => {
            const isSelected = themeItem.id === activeThemeId;
            return (
              <div
                key={themeItem.id}
                onClick={() => handleSelectTheme(themeItem.id)}
                className={`cursor-pointer rounded-xl border-2 p-4 transition-all flex flex-col justify-between gap-3 ${
                  isSelected
                    ? 'border-stone-900 bg-stone-50/70 shadow-sm'
                    : 'border-stone-200 hover:border-stone-300 bg-white'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-stone-900">
                      {themeItem.name}
                    </span>
                    {isSelected && (
                      <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        <Check className="w-3 h-3" />
                        Ativo
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-stone-500 line-clamp-2">
                    {themeItem.description}
                  </p>
                </div>

                {/* Amostra rápida das cores principais */}
                <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span
                      className="w-4 h-4 rounded-full border border-black/10 shrink-0"
                      style={{ backgroundColor: themeItem.tokens.colors.primary }}
                      title="Primary"
                    />
                    <span
                      className="w-4 h-4 rounded-full border border-black/10 shrink-0"
                      style={{ backgroundColor: themeItem.tokens.colors.secondary }}
                      title="Secondary"
                    />
                    <span
                      className="w-4 h-4 rounded-full border border-black/10 shrink-0"
                      style={{ backgroundColor: themeItem.tokens.colors.accent }}
                      title="Accent"
                    />
                    <span
                      className="w-4 h-4 rounded-full border border-black/10 shrink-0"
                      style={{ backgroundColor: themeItem.tokens.colors.background }}
                      title="Background"
                    />
                  </div>
                  <span className="text-[10px] font-mono text-stone-400">
                    v{themeItem.version}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 2. ÁREA DE PREVIEW VISUAL DOS DESIGN TOKENS */}
      <section
        id="section-theme-preview"
        className="bg-white rounded-xl border border-stone-200 shadow-xs p-5 sm:p-6"
      >
        <ThemePreview theme={currentTheme} />
      </section>

      {/* 3. FORMULÁRIO DE EDIÇÃO DOS DESIGN TOKENS CANÔNICOS */}
      <form onSubmit={handleSave} className="space-y-6">
        {/* GRUPO DE CORES: ColorTokens */}
        <SettingsSectionCard
          id="section-tokens-colors"
          title="Tokens de Cores (ColorTokens)"
          subtitle="Paleta de cores padronizada sem valores arbitrários soltos (Fase 8)"
          icon={<Palette className="w-4 h-4 text-amber-600" />}
          badge="ColorTokens"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {/* Primary */}
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Cor Primária (primary) <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={currentTheme.tokens.colors.primary}
                  onChange={(e) => handleColorChange('primary', e.target.value)}
                  className="w-8 h-8 rounded border border-stone-300 cursor-pointer p-0 shrink-0"
                />
                <input
                  type="text"
                  value={currentTheme.tokens.colors.primary}
                  onChange={(e) => handleColorChange('primary', e.target.value)}
                  className="w-full text-xs font-mono px-3 py-2 border border-stone-300 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-stone-900 bg-white"
                  required
                />
              </div>
              <p className="text-[10px] text-stone-400 mt-1">
                Utilizada para títulos nobres, botões de ação principal e identidade forte.
              </p>
            </div>

            {/* Secondary */}
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Cor Secundária (secondary) <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={currentTheme.tokens.colors.secondary}
                  onChange={(e) => handleColorChange('secondary', e.target.value)}
                  className="w-8 h-8 rounded border border-stone-300 cursor-pointer p-0 shrink-0"
                />
                <input
                  type="text"
                  value={currentTheme.tokens.colors.secondary}
                  onChange={(e) => handleColorChange('secondary', e.target.value)}
                  className="w-full text-xs font-mono px-3 py-2 border border-stone-300 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-stone-900 bg-white"
                  required
                />
              </div>
              <p className="text-[10px] text-stone-400 mt-1">
                Utilizada para destaques secundários, links e seções institucionais.
              </p>
            </div>

            {/* Accent */}
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Cor de Acento (accent) <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={currentTheme.tokens.colors.accent}
                  onChange={(e) => handleColorChange('accent', e.target.value)}
                  className="w-8 h-8 rounded border border-stone-300 cursor-pointer p-0 shrink-0"
                />
                <input
                  type="text"
                  value={currentTheme.tokens.colors.accent}
                  onChange={(e) => handleColorChange('accent', e.target.value)}
                  className="w-full text-xs font-mono px-3 py-2 border border-stone-300 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-stone-900 bg-white"
                  required
                />
              </div>
              <p className="text-[10px] text-stone-400 mt-1">
                Utilizada para badges, avisos de culto ao vivo e marcadores luminosos.
              </p>
            </div>

            {/* Background */}
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Fundo da Página (background) <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={currentTheme.tokens.colors.background}
                  onChange={(e) => handleColorChange('background', e.target.value)}
                  className="w-8 h-8 rounded border border-stone-300 cursor-pointer p-0 shrink-0"
                />
                <input
                  type="text"
                  value={currentTheme.tokens.colors.background}
                  onChange={(e) => handleColorChange('background', e.target.value)}
                  className="w-full text-xs font-mono px-3 py-2 border border-stone-300 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-stone-900 bg-white"
                  required
                />
              </div>
              <p className="text-[10px] text-stone-400 mt-1">
                Cor base de sustentação do fundo geral do site.
              </p>
            </div>

            {/* Surface */}
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Superfície / Cards (surface) <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={currentTheme.tokens.colors.surface}
                  onChange={(e) => handleColorChange('surface', e.target.value)}
                  className="w-8 h-8 rounded border border-stone-300 cursor-pointer p-0 shrink-0"
                />
                <input
                  type="text"
                  value={currentTheme.tokens.colors.surface}
                  onChange={(e) => handleColorChange('surface', e.target.value)}
                  className="w-full text-xs font-mono px-3 py-2 border border-stone-300 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-stone-900 bg-white"
                  required
                />
              </div>
              <p className="text-[10px] text-stone-400 mt-1">
                Cor dos blocos de conteúdo elevado, caixas e cartões.
              </p>
            </div>

            {/* Text */}
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Texto Principal (text) <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={currentTheme.tokens.colors.text}
                  onChange={(e) => handleColorChange('text', e.target.value)}
                  className="w-8 h-8 rounded border border-stone-300 cursor-pointer p-0 shrink-0"
                />
                <input
                  type="text"
                  value={currentTheme.tokens.colors.text}
                  onChange={(e) => handleColorChange('text', e.target.value)}
                  className="w-full text-xs font-mono px-3 py-2 border border-stone-300 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-stone-900 bg-white"
                  required
                />
              </div>
              <p className="text-[10px] text-stone-400 mt-1">
                Cor para leitura do corpo de texto principal.
              </p>
            </div>

            {/* Muted */}
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Texto Suavizado (muted) <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={currentTheme.tokens.colors.muted}
                  onChange={(e) => handleColorChange('muted', e.target.value)}
                  className="w-8 h-8 rounded border border-stone-300 cursor-pointer p-0 shrink-0"
                />
                <input
                  type="text"
                  value={currentTheme.tokens.colors.muted}
                  onChange={(e) => handleColorChange('muted', e.target.value)}
                  className="w-full text-xs font-mono px-3 py-2 border border-stone-300 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-stone-900 bg-white"
                  required
                />
              </div>
            </div>

            {/* Border */}
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Linhas de Borda (border) <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={currentTheme.tokens.colors.border}
                  onChange={(e) => handleColorChange('border', e.target.value)}
                  className="w-8 h-8 rounded border border-stone-300 cursor-pointer p-0 shrink-0"
                />
                <input
                  type="text"
                  value={currentTheme.tokens.colors.border}
                  onChange={(e) => handleColorChange('border', e.target.value)}
                  className="w-full text-xs font-mono px-3 py-2 border border-stone-300 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-stone-900 bg-white"
                  required
                />
              </div>
            </div>

            {/* Success */}
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Status de Sucesso (success)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={currentTheme.tokens.colors.success || '#16a34a'}
                  onChange={(e) => handleColorChange('success', e.target.value)}
                  className="w-8 h-8 rounded border border-stone-300 cursor-pointer p-0 shrink-0"
                />
                <input
                  type="text"
                  value={currentTheme.tokens.colors.success || ''}
                  onChange={(e) => handleColorChange('success', e.target.value)}
                  placeholder="#16a34a"
                  className="w-full text-xs font-mono px-3 py-2 border border-stone-300 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-stone-900 bg-white"
                />
              </div>
            </div>
          </div>
        </SettingsSectionCard>

        {/* GRUPO DE TIPOGRAFIA: TypographyTokens */}
        <SettingsSectionCard
          id="section-tokens-typography"
          title="Tokens de Tipografia (TypographyTokens)"
          subtitle="Hierarquia e famílias tipográficas canônicas sem scripts dinâmicos de fonte (Fase 8)"
          icon={<Type className="w-4 h-4 text-amber-600" />}
          badge="TypographyTokens"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Família dos Títulos (fontFamilyHeading) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={currentTheme.tokens.typography.fontFamilyHeading}
                onChange={(e) => handleTypographyChange('fontFamilyHeading', e.target.value)}
                placeholder="Georgia, serif"
                className="w-full text-xs px-3 py-2 border border-stone-300 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-stone-900 bg-white"
                required
              />
              <p className="text-[10px] text-stone-400 mt-1">
                Pilha de fontes tipográficas para títulos principais e cabeçalhos.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Família do Corpo (fontFamilyBody) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={currentTheme.tokens.typography.fontFamilyBody}
                onChange={(e) => handleTypographyChange('fontFamilyBody', e.target.value)}
                placeholder="system-ui, -apple-system, sans-serif"
                className="w-full text-xs px-3 py-2 border border-stone-300 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-stone-900 bg-white"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Tamanho Base (fontSizeBase)
              </label>
              <input
                type="text"
                value={currentTheme.tokens.typography.fontSizeBase}
                onChange={(e) => handleTypographyChange('fontSizeBase', e.target.value)}
                placeholder="16px"
                className="w-full text-xs px-3 py-2 border border-stone-300 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-stone-900 bg-white font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Tamanho de Título Base (fontSizeHeading)
              </label>
              <input
                type="text"
                value={currentTheme.tokens.typography.fontSizeHeading}
                onChange={(e) => handleTypographyChange('fontSizeHeading', e.target.value)}
                placeholder="32px"
                className="w-full text-xs px-3 py-2 border border-stone-300 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-stone-900 bg-white font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Altura de Linha Base (lineHeightBase)
              </label>
              <input
                type="text"
                value={String(currentTheme.tokens.typography.lineHeightBase || '1.6')}
                onChange={(e) => handleTypographyChange('lineHeightBase', e.target.value)}
                placeholder="1.6"
                className="w-full text-xs px-3 py-2 border border-stone-300 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-stone-900 bg-white font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Espaçamento entre Letras (letterSpacingBase)
              </label>
              <input
                type="text"
                value={currentTheme.tokens.typography.letterSpacingBase || '-0.01em'}
                onChange={(e) => handleTypographyChange('letterSpacingBase', e.target.value)}
                placeholder="-0.01em"
                className="w-full text-xs px-3 py-2 border border-stone-300 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-stone-900 bg-white font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Peso Normal (fontWeightNormal)
              </label>
              <input
                type="text"
                value={String(currentTheme.tokens.typography.fontWeightNormal)}
                onChange={(e) => handleTypographyChange('fontWeightNormal', e.target.value)}
                placeholder="400"
                className="w-full text-xs px-3 py-2 border border-stone-300 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-stone-900 bg-white font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Peso em Negrito (fontWeightBold)
              </label>
              <input
                type="text"
                value={String(currentTheme.tokens.typography.fontWeightBold)}
                onChange={(e) => handleTypographyChange('fontWeightBold', e.target.value)}
                placeholder="700"
                className="w-full text-xs px-3 py-2 border border-stone-300 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-stone-900 bg-white font-mono"
              />
            </div>
          </div>
        </SettingsSectionCard>

        {/* GRUPO DE BORDAS: BorderTokens */}
        <SettingsSectionCard
          id="section-tokens-borders"
          title="Tokens de Bordas & Curvatura (BorderTokens)"
          subtitle="Especificação declarativa dos raios de arredondamento e espessuras (Fase 8)"
          icon={<Square className="w-4 h-4 text-amber-600" />}
          badge="BorderTokens"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Raio Pequeno (radiusSmall)
              </label>
              <input
                type="text"
                value={currentTheme.tokens.borders.radiusSmall}
                onChange={(e) => handleBorderChange('radiusSmall', e.target.value)}
                placeholder="4px"
                className="w-full text-xs font-mono px-3 py-2 border border-stone-300 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-stone-900 bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Raio Médio (radiusMedium)
              </label>
              <input
                type="text"
                value={currentTheme.tokens.borders.radiusMedium}
                onChange={(e) => handleBorderChange('radiusMedium', e.target.value)}
                placeholder="8px"
                className="w-full text-xs font-mono px-3 py-2 border border-stone-300 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-stone-900 bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Raio Grande (radiusLarge)
              </label>
              <input
                type="text"
                value={currentTheme.tokens.borders.radiusLarge}
                onChange={(e) => handleBorderChange('radiusLarge', e.target.value)}
                placeholder="16px"
                className="w-full text-xs font-mono px-3 py-2 border border-stone-300 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-stone-900 bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Espessura Fina (borderWidthThin)
              </label>
              <input
                type="text"
                value={currentTheme.tokens.borders.borderWidthThin}
                onChange={(e) => handleBorderChange('borderWidthThin', e.target.value)}
                placeholder="1px"
                className="w-full text-xs font-mono px-3 py-2 border border-stone-300 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-stone-900 bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Espessura Grossa (borderWidthThick)
              </label>
              <input
                type="text"
                value={currentTheme.tokens.borders.borderWidthThick}
                onChange={(e) => handleBorderChange('borderWidthThick', e.target.value)}
                placeholder="2px"
                className="w-full text-xs font-mono px-3 py-2 border border-stone-300 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-stone-900 bg-white"
              />
            </div>
          </div>
        </SettingsSectionCard>

        {/* GRUPO DE ESPAÇAMENTO & ELEVAÇÃO: SpacingTokens & ElevationTokens */}
        <SettingsSectionCard
          id="section-tokens-spacing"
          title="Tokens de Espaçamento & Dimensões (SpacingTokens)"
          subtitle="Dimensões controladas de containers e respiro de seções (Fase 8)"
          icon={<Maximize2 className="w-4 h-4 text-amber-600" />}
          badge="SpacingTokens"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Espaçamento Base (base)
              </label>
              <input
                type="text"
                value={currentTheme.tokens.spacing.base}
                onChange={(e) => handleSpacingChange('base', e.target.value)}
                placeholder="16px"
                className="w-full text-xs font-mono px-3 py-2 border border-stone-300 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-stone-900 bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Padding de Seção Médio (sectionPaddingYMedium)
              </label>
              <input
                type="text"
                value={currentTheme.tokens.spacing.sectionPaddingYMedium}
                onChange={(e) => handleSpacingChange('sectionPaddingYMedium', e.target.value)}
                placeholder="64px"
                className="w-full text-xs font-mono px-3 py-2 border border-stone-300 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-stone-900 bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Largura Padrão do Container (containerStandard)
              </label>
              <input
                type="text"
                value={currentTheme.tokens.spacing.containerStandard}
                onChange={(e) => handleSpacingChange('containerStandard', e.target.value)}
                placeholder="1024px"
                className="w-full text-xs font-mono px-3 py-2 border border-stone-300 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-stone-900 bg-white"
              />
            </div>
          </div>
        </SettingsSectionCard>

        {/* Barra de Ações Inferior */}
        <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-stone-200 shadow-xs">
          <div className="text-xs text-stone-500">
            Tema ativo em edição:{' '}
            <span className="font-semibold text-stone-800">{savedTheme.name}</span>
            <span className="text-stone-400 ml-2">
              (Atualizado em {new Date(savedTheme.updatedAt || Date.now()).toLocaleDateString('pt-BR')})
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
              <span>{isSaving ? 'Salvando...' : 'Salvar Tema'}</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
