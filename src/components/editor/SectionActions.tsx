import React from 'react';
import {
  ChevronUp,
  ChevronDown,
  Copy,
  Trash2,
  Eye,
  EyeOff,
  Plus,
} from 'lucide-react';

interface SectionActionsProps {
  sectionId: string;
  isFirst: boolean;
  isLast: boolean;
  isVisible: boolean;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onDuplicate: () => void;
  onToggleVisibility: () => void;
  onAddBlock: () => void;
  onDelete: () => void;
  compact?: boolean;
}

export const SectionActions: React.FC<SectionActionsProps> = ({
  isFirst,
  isLast,
  isVisible,
  onMoveUp,
  onMoveDown,
  onDuplicate,
  onToggleVisibility,
  onAddBlock,
  onDelete,
  compact = false,
}) => {
  return (
    <div
      className={`inline-flex items-center rounded-lg bg-stone-900/90 backdrop-blur-xs text-white shadow-lg border border-stone-700/60 p-0.5 ${
        compact ? 'scale-90 origin-right' : ''
      }`}
    >
      <button
        type="button"
        disabled={isFirst}
        onClick={(e) => {
          e.stopPropagation();
          onMoveUp();
        }}
        title="Mover seção para cima"
        className="p-1 rounded hover:bg-stone-800 disabled:opacity-30 disabled:hover:bg-transparent text-stone-300 hover:text-white transition-colors"
      >
        <ChevronUp className="w-3.5 h-3.5" />
      </button>

      <button
        type="button"
        disabled={isLast}
        onClick={(e) => {
          e.stopPropagation();
          onMoveDown();
        }}
        title="Mover seção para baixo"
        className="p-1 rounded hover:bg-stone-800 disabled:opacity-30 disabled:hover:bg-transparent text-stone-300 hover:text-white transition-colors"
      >
        <ChevronDown className="w-3.5 h-3.5" />
      </button>

      <div className="w-px h-3 bg-stone-700 mx-0.5" />

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onToggleVisibility();
        }}
        title={isVisible ? 'Ocultar seção' : 'Exibir seção'}
        className="p-1 rounded hover:bg-stone-800 text-stone-300 hover:text-white transition-colors"
      >
        {isVisible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5 text-amber-400" />}
      </button>

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onDuplicate();
        }}
        title="Duplicar seção"
        className="p-1 rounded hover:bg-stone-800 text-stone-300 hover:text-white transition-colors"
      >
        <Copy className="w-3.5 h-3.5" />
      </button>

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onAddBlock();
        }}
        title="Adicionar bloco nesta seção"
        className="inline-flex items-center gap-1 px-1.5 py-1 rounded bg-amber-600 hover:bg-amber-500 text-white font-medium text-[11px] transition-colors ml-0.5"
      >
        <Plus className="w-3 h-3" />
        <span className="hidden sm:inline">Bloco</span>
      </button>

      <div className="w-px h-3 bg-stone-700 mx-0.5" />

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
        title="Excluir seção"
        className="p-1 rounded hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-colors"
      >
        <Trash2 className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
