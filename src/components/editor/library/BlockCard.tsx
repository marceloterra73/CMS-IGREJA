import React from 'react';
import { BlockDefinition } from '../../../types';
import { getBlockIcon } from '../blockIcons';
import { BlockPreviewWireframe } from './BlockPreviewWireframe';
import { Plus, Eye, Check } from 'lucide-react';

interface BlockCardProps {
  block: BlockDefinition;
  isSelected: boolean;
  onSelect: () => void;
  onAdd: () => void;
}

const CATEGORY_STYLES: Record<string, { label: string; badgeClass: string }> = {
  church_specific: {
    label: 'Igreja',
    badgeClass: 'bg-amber-100/80 text-amber-800 border-amber-200',
  },
  content: {
    label: 'Conteúdo',
    badgeClass: 'bg-sky-100/80 text-sky-800 border-sky-200',
  },
  hero: {
    label: 'Destaque',
    badgeClass: 'bg-orange-100/80 text-orange-800 border-orange-200',
  },
  navigation: {
    label: 'Navegação',
    badgeClass: 'bg-emerald-100/80 text-emerald-800 border-emerald-200',
  },
  footer: {
    label: 'Rodapé',
    badgeClass: 'bg-stone-100 text-stone-700 border-stone-200',
  },
};

export const BlockCard: React.FC<BlockCardProps> = ({
  block,
  isSelected,
  onSelect,
  onAdd,
}) => {
  const categoryMeta = CATEGORY_STYLES[block.category] || {
    label: block.category,
    badgeClass: 'bg-stone-100 text-stone-700 border-stone-200',
  };

  return (
    <div
      id={`block-library-card-${block.type}`}
      onClick={onSelect}
      className={`group relative flex flex-col justify-between bg-white rounded-xl border transition-all cursor-pointer overflow-hidden text-left p-3.5 ${
        isSelected
          ? 'border-amber-500 ring-2 ring-amber-500/20 shadow-sm bg-amber-50/10'
          : 'border-stone-200 hover:border-amber-400/80 hover:shadow-sm'
      }`}
    >
      {/* Topo do Card: Ícone, Nome e Categoria */}
      <div className="space-y-2.5">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                isSelected
                  ? 'bg-amber-600 text-white'
                  : 'bg-stone-100 group-hover:bg-amber-100 text-stone-700 group-hover:text-amber-700'
              }`}
            >
              {getBlockIcon(block.type, 'w-4 h-4')}
            </div>
            <div className="min-w-0">
              <h3 className="text-xs font-bold text-stone-900 group-hover:text-amber-900 truncate">
                {block.name}
              </h3>
              <span
                className={`inline-block text-[10px] font-semibold uppercase px-1.5 py-0.2 rounded border ${categoryMeta.badgeClass}`}
              >
                {categoryMeta.label}
              </span>
            </div>
          </div>

          {isSelected && (
            <span className="w-5 h-5 rounded-full bg-amber-500 text-white flex items-center justify-center shrink-0">
              <Check className="w-3 h-3" />
            </span>
          )}
        </div>

        {/* Miniatura do Wireframe Visual do Bloco */}
        <div className="rounded-lg overflow-hidden border border-stone-100 shadow-2xs">
          <BlockPreviewWireframe type={block.type} className="w-full h-18" />
        </div>

        {/* Descrição Funcional do Bloco */}
        <p className="text-[11px] text-stone-500 line-clamp-2 leading-relaxed">
          {block.description}
        </p>
      </div>

      {/* Rodapé de Ações do Card */}
      <div className="mt-3 pt-2.5 border-t border-stone-100 flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onSelect();
          }}
          className="text-[11px] font-semibold text-stone-500 hover:text-stone-800 flex items-center gap-1 transition-colors"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>Ver detalhes</span>
        </button>

        <button
          type="button"
          id={`btn-add-block-${block.type}`}
          onClick={(e) => {
            e.stopPropagation();
            onAdd();
          }}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white transition-colors shadow-2xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Adicionar</span>
        </button>
      </div>
    </div>
  );
};
