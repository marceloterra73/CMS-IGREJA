import React from 'react';
import {
  ChevronUp,
  ChevronDown,
  Copy,
  Trash2,
  Eye,
  EyeOff,
} from 'lucide-react';

interface BlockActionsProps {
  blockId: string;
  isFirst: boolean;
  isLast: boolean;
  isVisible: boolean;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onDuplicate: () => void;
  onToggleVisibility: () => void;
  onDelete: () => void;
}

export const BlockActions: React.FC<BlockActionsProps> = ({
  isFirst,
  isLast,
  isVisible,
  onMoveUp,
  onMoveDown,
  onDuplicate,
  onToggleVisibility,
  onDelete,
}) => {
  return (
    <div className="inline-flex items-center rounded-md bg-stone-900/90 backdrop-blur-xs text-white shadow-md border border-stone-700/60 p-0.5 scale-90 origin-right">
      <button
        type="button"
        disabled={isFirst}
        onClick={(e) => {
          e.stopPropagation();
          onMoveUp();
        }}
        title="Mover bloco para cima"
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
        title="Mover bloco para baixo"
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
        title={isVisible ? 'Ocultar bloco' : 'Exibir bloco'}
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
        title="Duplicar bloco"
        className="p-1 rounded hover:bg-stone-800 text-stone-300 hover:text-white transition-colors"
      >
        <Copy className="w-3.5 h-3.5" />
      </button>

      <div className="w-px h-3 bg-stone-700 mx-0.5" />

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
        title="Excluir bloco"
        className="p-1 rounded hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-colors"
      >
        <Trash2 className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
