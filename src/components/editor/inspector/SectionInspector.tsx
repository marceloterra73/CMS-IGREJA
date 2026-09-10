import React from 'react';
import {
  Layers,
  Layout,
  Palette,
  Eye,
  EyeOff,
  ChevronUp,
  ChevronDown,
  Copy,
  Trash2,
  Plus,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Maximize2,
  Minimize2,
} from 'lucide-react';
import { SectionInstance, SectionId, SectionConfig } from '../../../types';
import { CONTAINER_WIDTHS, PADDING_VARIANTS, THEME_VARIANTS } from '../../../constants';

interface SectionInspectorProps {
  section: SectionInstance;
  isFirst: boolean;
  isLast: boolean;
  onUpdateSection: (sectionId: SectionId, updates: Partial<SectionInstance>) => void;
  onAddBlockToSection: (sectionId: SectionId) => void;
  onMoveSectionUp: () => void;
  onMoveSectionDown: () => void;
  onDuplicateSection: (sectionId: SectionId) => void;
  onRequestDeleteSection: (sectionId: SectionId) => void;
}

const PRESET_BACKGROUNDS = [
  { label: 'Branco Puro', color: '#ffffff', textColor: '#1c1917', border: true },
  { label: 'Areia Suave', color: '#fafaf9', textColor: '#1c1917', border: true },
  { label: 'Pedra Neutra', color: '#f5f5f4', textColor: '#1c1917', border: true },
  { label: 'Âmbar Eclesiástico', color: '#fffbeb', textColor: '#78350f', border: true },
  { label: 'Grafite Noturno', color: '#0c0a09', textColor: '#ffffff', border: false },
  { label: 'Azul Templo', color: '#0f172a', textColor: '#ffffff', border: false },
];

const PRESET_TEXT_COLORS = [
  { label: 'Padrão (Escuro)', color: '#1c1917' },
  { label: 'Suave (Cinza)', color: '#78716c' },
  { label: 'Claro (Branco)', color: '#ffffff' },
  { label: 'Dourado / Âmbar', color: '#d97706' },
];

/**
 * Inspetor visual e estrutural de Seções (Fase 30).
 * Permite ao usuário controlar visualmente a estrutura, largura, padding, fundo,
 * variante de tema e ações da seção, consumindo estritamente SectionInstance e SectionConfig.
 */
export const SectionInspector: React.FC<SectionInspectorProps> = ({
  section,
  isFirst,
  isLast,
  onUpdateSection,
  onAddBlockToSection,
  onMoveSectionUp,
  onMoveSectionDown,
  onDuplicateSection,
  onRequestDeleteSection,
}) => {
  const config = section.config || {};
  const currentBg = section.backgroundColor || config.backgroundColor || '#ffffff';
  const currentTextColor = config.textColor || '';
  const currentTheme = config.themeVariant || 'light';
  const currentWidth = config.containerWidth || 'standard';
  const currentPadding = config.paddingY || 'medium';

  const updateConfig = (newConfigUpdates: Partial<SectionConfig>) => {
    onUpdateSection(section.id, {
      config: {
        ...config,
        ...newConfigUpdates,
      },
    });
  };

  const handleBackgroundColorChange = (color: string) => {
    onUpdateSection(section.id, {
      backgroundColor: color,
      config: {
        ...config,
        backgroundColor: color,
      },
    });
  };

  return (
    <div className="space-y-5 select-none">
      {/* 1. Identificação da Seção */}
      <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 space-y-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
            <Layers className="w-4 h-4" />
          </div>
          <div className="min-w-0 flex-1">
            <span className="text-[10px] font-mono text-stone-600 block">
              Seção #{section.order} • {section.blocks.length} {section.blocks.length === 1 ? 'bloco' : 'blocos'}
            </span>
            <h3 className="text-xs font-bold text-stone-900 truncate">
              {section.title || 'Seção sem Título'}
            </h3>
          </div>
        </div>

        {/* Edição do Nome da Seção */}
        <div>
          <label className="block text-[11px] font-semibold text-stone-600 mb-1">
            Nome da Seção
          </label>
          <input
            type="text"
            value={section.title || ''}
            onChange={(e) =>
              onUpdateSection(section.id, { title: e.target.value })
            }
            placeholder="Ex: Destaque Principal, Agenda, Contato..."
            className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-stone-200 bg-white text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>

        {/* Visibilidade da Seção */}
        <div className="flex items-center justify-between pt-1 border-t border-stone-200/60">
          <span className="text-xs font-semibold text-stone-700">
            Visibilidade
          </span>
          <button
            type="button"
            onClick={() =>
              onUpdateSection(section.id, { isVisible: !section.isVisible })
            }
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
              section.isVisible
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                : 'bg-stone-200 text-stone-600 border border-stone-300 hover:bg-stone-300'
            }`}
          >
            {section.isVisible ? (
              <>
                <Eye className="w-3.5 h-3.5 text-emerald-600" />
                <span>Visível</span>
              </>
            ) : (
              <>
                <EyeOff className="w-3.5 h-3.5 text-stone-500" />
                <span>Oculta</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 2. Seção de Layout */}
      <div className="space-y-3.5 pt-1">
        <h4 className="text-xs font-bold text-stone-800 uppercase tracking-wider flex items-center gap-1.5">
          <Layout className="w-3.5 h-3.5 text-amber-600" />
          <span>Layout & Dimensões</span>
        </h4>

        {/* Largura do Container */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-[11px] font-semibold text-stone-600">
              Largura do Container
            </label>
            <span className="text-[10px] font-mono text-stone-600 capitalize">
              {currentWidth}
            </span>
          </div>

          <div className="grid grid-cols-4 gap-1.5">
            {[
              { id: 'narrow', label: 'Narrow', desc: '768px' },
              { id: 'standard', label: 'Standard', desc: '1024px' },
              { id: 'wide', label: 'Wide', desc: '1280px' },
              { id: 'full', label: 'Full', desc: '100%' },
            ].map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() =>
                  updateConfig({
                    containerWidth: opt.id as 'narrow' | 'standard' | 'wide' | 'full',
                  })
                }
                className={`py-1.5 px-1 rounded-lg text-center border flex flex-col items-center justify-center transition-all ${
                  currentWidth === opt.id
                    ? 'border-amber-500 bg-amber-50/60 ring-2 ring-amber-500/20 text-amber-900 font-bold'
                    : 'border-stone-200 bg-white text-stone-600 hover:border-stone-300 hover:bg-stone-50'
                }`}
              >
                <span className="text-[11px] font-semibold">{opt.label}</span>
                <span className="text-[9px] text-stone-600 font-mono">{opt.desc}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Espaçamento Vertical (Padding) */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-[11px] font-semibold text-stone-600">
              Espaçamento Vertical (Padding)
            </label>
            <span className="text-[10px] font-mono text-stone-600 capitalize">
              {currentPadding === 'none'
                ? 'Nenhum'
                : currentPadding === 'small'
                ? 'Pequeno'
                : currentPadding === 'medium'
                ? 'Médio'
                : 'Grande'}
            </span>
          </div>

          <div className="grid grid-cols-4 gap-1.5">
            {[
              { id: 'none', label: 'Nenhum' },
              { id: 'small', label: 'Pequeno' },
              { id: 'medium', label: 'Médio' },
              { id: 'large', label: 'Grande' },
            ].map((pad) => (
              <button
                key={pad.id}
                type="button"
                onClick={() =>
                  updateConfig({
                    paddingY: pad.id as 'none' | 'small' | 'medium' | 'large',
                  })
                }
                className={`py-1.5 px-1 rounded-lg text-center border text-xs transition-all ${
                  currentPadding === pad.id
                    ? 'border-amber-500 bg-amber-50/60 ring-2 ring-amber-500/20 text-amber-900 font-bold'
                    : 'border-stone-200 bg-white text-stone-600 hover:border-stone-300 hover:bg-stone-50'
                }`}
              >
                {pad.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Seção de Aparência e Tema */}
      <div className="space-y-3.5 pt-2 border-t border-stone-100">
        <h4 className="text-xs font-bold text-stone-800 uppercase tracking-wider flex items-center gap-1.5">
          <Palette className="w-3.5 h-3.5 text-amber-600" />
          <span>Aparência & Cores</span>
        </h4>

        {/* Variante Visual (ThemeVariant) */}
        <div>
          <label className="block text-[11px] font-semibold text-stone-600 mb-1.5">
            Variante Visual do Tema
          </label>
          <div className="grid grid-cols-4 gap-1.5">
            {[
              { id: 'light', label: 'Claro' },
              { id: 'neutral', label: 'Neutro' },
              { id: 'accent', label: 'Destaque' },
              { id: 'dark', label: 'Escuro' },
            ].map((thm) => (
              <button
                key={thm.id}
                type="button"
                onClick={() =>
                  updateConfig({
                    themeVariant: thm.id as 'light' | 'dark' | 'accent' | 'neutral',
                  })
                }
                className={`py-1.5 px-1 rounded-lg text-center border text-xs capitalize transition-all ${
                  currentTheme === thm.id
                    ? 'border-amber-500 bg-amber-50/60 ring-2 ring-amber-500/20 text-amber-900 font-bold'
                    : 'border-stone-200 bg-white text-stone-600 hover:border-stone-300 hover:bg-stone-50'
                }`}
              >
                {thm.label}
              </button>
            ))}
          </div>
        </div>

        {/* Cor de Fundo (Presets seguros + controle visual) */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-[11px] font-semibold text-stone-600">
              Cor de Fundo da Seção
            </label>
            <div className="flex items-center gap-1.5">
              <input
                type="color"
                value={currentBg.startsWith('#') ? currentBg : '#ffffff'}
                onChange={(e) => handleBackgroundColorChange(e.target.value)}
                className="w-5 h-5 rounded cursor-pointer border border-stone-300 p-0"
                title="Seletor visual de cor"
              />
              <span className="text-[10px] font-mono text-stone-600">
                {currentBg}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-1.5">
            {PRESET_BACKGROUNDS.map((preset) => {
              const isSelected = currentBg.toLowerCase() === preset.color.toLowerCase();
              return (
                <button
                  key={preset.color}
                  type="button"
                  onClick={() => handleBackgroundColorChange(preset.color)}
                  className={`p-2 rounded-lg border text-left flex items-center gap-2 transition-all ${
                    isSelected
                      ? 'border-amber-500 ring-2 ring-amber-500/20 bg-amber-50/30'
                      : 'border-stone-200 bg-white hover:border-stone-300'
                  }`}
                >
                  <div
                    className="w-4 h-4 rounded-full border border-stone-300 shadow-2xs shrink-0"
                    style={{ backgroundColor: preset.color }}
                  />
                  <span className="text-[11px] font-medium text-stone-700 truncate">
                    {preset.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Cor do Texto da Seção */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-[11px] font-semibold text-stone-600">
              Cor do Texto
            </label>
            {currentTextColor && (
              <span className="text-[10px] font-mono text-stone-600">
                {currentTextColor}
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-1.5">
            {PRESET_TEXT_COLORS.map((tc) => {
              const isSelected = currentTextColor.toLowerCase() === tc.color.toLowerCase();
              return (
                <button
                  key={tc.color}
                  type="button"
                  onClick={() => updateConfig({ textColor: tc.color })}
                  className={`p-1.5 rounded-lg border text-left flex items-center gap-2 transition-all ${
                    isSelected
                      ? 'border-amber-500 ring-2 ring-amber-500/20 bg-amber-50/40'
                      : 'border-stone-200 bg-white hover:border-stone-300'
                  }`}
                >
                  <div
                    className="w-3.5 h-3.5 rounded-full border border-stone-300 shadow-2xs shrink-0"
                    style={{ backgroundColor: tc.color }}
                  />
                  <span className="text-[10px] font-medium text-stone-700 truncate">
                    {tc.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 4. Ações Estruturais da Seção */}
      <div className="pt-3 border-t border-stone-100 space-y-2.5">
        <h4 className="text-xs font-bold text-stone-800 uppercase tracking-wider">
          Estrutura & Ações da Seção
        </h4>

        <button
          type="button"
          onClick={() => onAddBlockToSection(section.id)}
          className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-colors shadow-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>+ Adicionar Bloco Nesta Seção</span>
        </button>

        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            disabled={isFirst}
            onClick={onMoveSectionUp}
            className="flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg border border-stone-200 hover:bg-stone-50 disabled:opacity-40 disabled:hover:bg-transparent text-xs font-medium text-stone-700 transition-colors"
          >
            <ChevronUp className="w-3.5 h-3.5" />
            <span>Mover Acima</span>
          </button>
          <button
            type="button"
            disabled={isLast}
            onClick={onMoveSectionDown}
            className="flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg border border-stone-200 hover:bg-stone-50 disabled:opacity-40 disabled:hover:bg-transparent text-xs font-medium text-stone-700 transition-colors"
          >
            <ChevronDown className="w-3.5 h-3.5" />
            <span>Mover Abaixo</span>
          </button>
          <button
            type="button"
            onClick={() => onDuplicateSection(section.id)}
            className="flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg border border-stone-200 hover:bg-stone-50 text-xs font-medium text-stone-700 transition-colors"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>Duplicar Seção</span>
          </button>
          <button
            type="button"
            onClick={() => onRequestDeleteSection(section.id)}
            className="flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg border border-red-200 hover:bg-red-50 text-xs font-medium text-red-700 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Remover Seção</span>
          </button>
        </div>
      </div>
    </div>
  );
};
