import React from 'react';
import {
  ArrowLeft,
  Monitor,
  Tablet,
  Smartphone,
  Eye,
  EyeOff,
  Save,
  Check,
  Layers,
  SlidersHorizontal,
  Layout,
} from 'lucide-react';
import { Page } from '../../types';
import { EditorViewport, EditorMobileTab } from './types';
import { PageStatusBadge } from '../pages/PageStatusBadge';

interface EditorToolbarProps {
  page: Page;
  viewport: EditorViewport;
  onViewportChange: (viewport: EditorViewport) => void;
  isPreviewMode: boolean;
  onTogglePreview: () => void;
  isDirty: boolean;
  onSaveSession: () => void;
  onBack: () => void;
  activeMobileTab: EditorMobileTab;
  onMobileTabChange: (tab: EditorMobileTab) => void;
}

export const EditorToolbar: React.FC<EditorToolbarProps> = ({
  page,
  viewport,
  onViewportChange,
  isPreviewMode,
  onTogglePreview,
  isDirty,
  onSaveSession,
  onBack,
  activeMobileTab,
  onMobileTabChange,
}) => {
  return (
    <header
      id="editor-toolbar"
      className="bg-white border-b border-stone-200 px-3 sm:px-5 py-2.5 flex items-center justify-between gap-3 shrink-0 select-none z-30 shadow-xs"
    >
      {/* Esquerda: Voltar e Identificação da Página */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          id="editor-btn-back"
          onClick={onBack}
          type="button"
          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-stone-700 hover:text-stone-950 hover:bg-stone-100 transition-colors border border-stone-200 shrink-0"
          title="Voltar para a listagem de páginas"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Páginas</span>
        </button>

        <div className="h-4 w-px bg-stone-200 hidden sm:block" />

        <div className="flex items-center gap-2 min-w-0">
          <span className="text-xs text-stone-600 font-medium hidden md:inline truncate">
            Igreja Batista Central
          </span>
          <span className="text-stone-400 text-xs hidden md:inline">•</span>
          <h1 className="text-xs sm:text-sm font-bold text-stone-900 truncate">
            {page.title}
          </h1>
          <div className="shrink-0">
            <PageStatusBadge status={page.status} />
          </div>
        </div>

        {/* Indicador de Alterações Locais */}
        <div className="hidden lg:flex items-center gap-1.5 text-[11px] px-2 py-0.5 rounded-full border bg-stone-50 border-stone-200">
          <span
            className={`w-2 h-2 rounded-full ${
              isDirty ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'
            }`}
          />
          <span className="text-stone-600 font-medium">
            {isDirty ? 'Alterações não salvas' : 'Sessão atualizada'}
          </span>
        </div>
      </div>

      {/* Centro: Seletores de Viewport (Desktop / Tablet / Mobile) */}
      <div className="hidden md:flex items-center bg-stone-100 p-0.5 rounded-lg border border-stone-200">
        <button
          id="editor-btn-viewport-desktop"
          type="button"
          onClick={() => onViewportChange('desktop')}
          className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-md transition-colors ${
            viewport === 'desktop'
              ? 'bg-white text-stone-900 shadow-xs'
              : 'text-stone-500 hover:text-stone-800'
          }`}
          title="Visualização Desktop"
        >
          <Monitor className="w-3.5 h-3.5" />
          <span className="hidden lg:inline">Desktop</span>
        </button>

        <button
          id="editor-btn-viewport-tablet"
          type="button"
          onClick={() => onViewportChange('tablet')}
          className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-md transition-colors ${
            viewport === 'tablet'
              ? 'bg-white text-stone-900 shadow-xs'
              : 'text-stone-500 hover:text-stone-800'
          }`}
          title="Visualização Tablet (768px)"
        >
          <Tablet className="w-3.5 h-3.5" />
          <span className="hidden lg:inline">Tablet</span>
        </button>

        <button
          id="editor-btn-viewport-mobile"
          type="button"
          onClick={() => onViewportChange('mobile')}
          className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-md transition-colors ${
            viewport === 'mobile'
              ? 'bg-white text-stone-900 shadow-xs'
              : 'text-stone-500 hover:text-stone-800'
          }`}
          title="Visualização Mobile (375px)"
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span className="hidden lg:inline">Mobile</span>
        </button>
      </div>

      {/* Direita: Abas Mobile, Preview e Salvar */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Switcher para Telas Pequenas (Estrutura, Canvas, Inspector) */}
        <div className="flex md:hidden items-center bg-stone-100 p-0.5 rounded-lg border border-stone-200">
          <button
            type="button"
            onClick={() => onMobileTabChange('structure')}
            className={`p-1.5 rounded-md ${
              activeMobileTab === 'structure' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-500'
            }`}
            title="Estrutura"
          >
            <Layers className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onMobileTabChange('canvas')}
            className={`p-1.5 rounded-md ${
              activeMobileTab === 'canvas' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-500'
            }`}
            title="Visualização Canvas"
          >
            <Layout className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onMobileTabChange('inspector')}
            className={`p-1.5 rounded-md ${
              activeMobileTab === 'inspector' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-500'
            }`}
            title="Propriedades"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Botão de Preview */}
        <button
          id="editor-btn-preview"
          type="button"
          onClick={onTogglePreview}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors border ${
            isPreviewMode
              ? 'bg-amber-100 text-amber-900 border-amber-300 shadow-xs'
              : 'bg-white text-stone-700 hover:text-stone-900 hover:bg-stone-50 border-stone-200'
          }`}
          title={isPreviewMode ? 'Sair do Modo Prévia' : 'Visualizar Prévia Limpa'}
        >
          {isPreviewMode ? (
            <>
              <EyeOff className="w-3.5 h-3.5 text-amber-700" />
              <span className="hidden sm:inline">Editar</span>
            </>
          ) : (
            <>
              <Eye className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Prévia</span>
            </>
          )}
        </button>

        {/* Botão Salvar Sessão Local */}
        <button
          id="editor-btn-save"
          type="button"
          onClick={onSaveSession}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 active:bg-amber-800 transition-colors shadow-xs shadow-amber-600/20"
          title="Salvar alterações na sessão local"
        >
          {isDirty ? <Save className="w-3.5 h-3.5" /> : <Check className="w-3.5 h-3.5" />}
          <span>Salvar</span>
        </button>
      </div>
    </header>
  );
};
