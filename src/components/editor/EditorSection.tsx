import React from 'react';
import {
  SectionInstance,
  SectionId,
  BlockId,
} from '../../types';
import { EditorBlock } from './EditorBlock';
import { SectionActions } from './SectionActions';
import { Layers, Plus, EyeOff } from 'lucide-react';

interface EditorSectionProps {
  section: SectionInstance;
  index: number;
  totalSections: number;
  isSelected: boolean;
  selectedBlockId: BlockId | null;
  isPreviewMode: boolean;
  onSelectSection: () => void;
  onSelectBlock: (blockId: BlockId) => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onDuplicate: () => void;
  onToggleVisibility: () => void;
  onDelete: () => void;
  onAddBlock: () => void;
  onMoveBlockUp: (blockIndex: number) => void;
  onMoveBlockDown: (blockIndex: number) => void;
  onDuplicateBlock: (blockId: BlockId) => void;
  onToggleBlockVisibility: (blockId: BlockId) => void;
  onDeleteBlock: (blockId: BlockId) => void;
}

export const EditorSection: React.FC<EditorSectionProps> = ({
  section,
  index,
  totalSections,
  isSelected,
  selectedBlockId,
  isPreviewMode,
  onSelectSection,
  onSelectBlock,
  onMoveUp,
  onMoveDown,
  onDuplicate,
  onToggleVisibility,
  onDelete,
  onAddBlock,
  onMoveBlockUp,
  onMoveBlockDown,
  onDuplicateBlock,
  onToggleBlockVisibility,
  onDeleteBlock,
}) => {
  // No modo preview, se a seção estiver oculta, não renderiza
  if (isPreviewMode && !section.isVisible) {
    return null;
  }

  const config = section.config || {};
  const currentBg = section.backgroundColor || config.backgroundColor;
  const currentTextColor = config.textColor;
  const themeVariant = config.themeVariant || 'light';

  // Largura do container
  const getContainerWidthClass = (width?: string) => {
    switch (width) {
      case 'narrow':
        return 'max-w-3xl mx-auto px-4';
      case 'wide':
        return 'max-w-6xl mx-auto px-4 sm:px-6';
      case 'full':
        return 'w-full px-4 sm:px-6';
      case 'standard':
      default:
        return 'max-w-5xl mx-auto px-4 sm:px-6';
    }
  };

  // Espaçamento vertical da seção
  const getSectionPaddingClass = (paddingY?: string) => {
    switch (paddingY) {
      case 'none':
        return 'py-1';
      case 'small':
        return 'py-4 sm:py-6';
      case 'large':
        return 'py-12 sm:py-16';
      case 'medium':
      default:
        return 'py-6 sm:py-10';
    }
  };

  // Classes de variante temática
  const getThemeClasses = (variant: string) => {
    switch (variant) {
      case 'dark':
        return 'text-stone-100';
      case 'accent':
        return 'text-amber-950';
      case 'neutral':
        return 'text-stone-800';
      case 'light':
      default:
        return 'text-stone-900';
    }
  };

  return (
    <section
      id={`editor-section-${section.id}`}
      onClick={(e) => {
        e.stopPropagation();
        onSelectSection();
      }}
      className={`relative transition-all ${
        isPreviewMode ? '' : 'cursor-pointer group/section my-4'
      } ${
        !section.isVisible && !isPreviewMode
          ? 'opacity-60 ring-1 ring-dashed ring-amber-400/60'
          : ''
      } ${
        isSelected && !isPreviewMode
          ? 'ring-2 ring-amber-500 rounded-2xl shadow-sm'
          : !isPreviewMode
          ? 'border border-stone-200/80 hover:border-stone-300 rounded-2xl'
          : ''
      } ${getThemeClasses(themeVariant)}`}
      style={{
        backgroundColor: currentBg || (themeVariant === 'dark' ? '#0c0a09' : '#ffffff'),
        color: currentTextColor || undefined,
      }}
    >
      {/* Barra de Seção (Visível apenas em modo Edição) */}
      {!isPreviewMode && (
        <div
          className={`px-4 py-2 border-b flex items-center justify-between rounded-t-2xl transition-colors ${
            isSelected
              ? 'bg-amber-500/10 border-amber-300 text-amber-950'
              : 'bg-stone-50/80 border-stone-100 text-stone-600 group-hover/section:bg-stone-100/70'
          }`}
        >
          <div className="flex items-center gap-2 min-w-0">
            <Layers className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-amber-600' : 'text-stone-400'}`} />
            <span className="text-xs font-bold truncate">
              {section.title || `Seção ${index + 1}`}
            </span>
            <span className="text-[10px] text-stone-600 font-mono">
              #{index + 1}
            </span>
            {!section.isVisible && (
              <span className="inline-flex items-center gap-1 text-[10px] text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded font-medium">
                <EyeOff className="w-2.5 h-2.5" />
                Oculta
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <SectionActions
              sectionId={section.id}
              isFirst={index === 0}
              isLast={index === totalSections - 1}
              isVisible={section.isVisible}
              onMoveUp={onMoveUp}
              onMoveDown={onMoveDown}
              onDuplicate={onDuplicate}
              onToggleVisibility={onToggleVisibility}
              onAddBlock={onAddBlock}
              onDelete={onDelete}
              compact={true}
            />
          </div>
        </div>
      )}

      {/* Conteúdo dos Blocos */}
      <div
        className={`${getContainerWidthClass(
          config.containerWidth
        )} ${getSectionPaddingClass(config.paddingY)}`}
      >
        {section.blocks.length === 0 ? (
          <div className="py-8 px-4 text-center border-2 border-dashed border-stone-200 rounded-xl bg-stone-50/50">
            <p className="text-xs font-medium text-stone-500">
              Esta seção está vazia.
            </p>
            {!isPreviewMode && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onAddBlock();
                }}
                className="mt-2 inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 transition-colors shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                Adicionar Primeiro Bloco
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {section.blocks.map((block, bIndex) => {
              // No modo preview, se o bloco estiver invisível, não renderiza
              if (isPreviewMode && !block.isVisible) {
                return null;
              }

              const isBlockSelected =
                selectedBlockId === block.id && isSelected;

              return (
                <EditorBlock
                  key={block.id}
                  block={block}
                  sectionId={section.id}
                  isSelected={isBlockSelected}
                  isPreviewMode={isPreviewMode}
                  isFirst={bIndex === 0}
                  isLast={bIndex === section.blocks.length - 1}
                  onSelect={() => onSelectBlock(block.id)}
                  onMoveUp={() => onMoveBlockUp(bIndex)}
                  onMoveDown={() => onMoveBlockDown(bIndex)}
                  onDuplicate={() => onDuplicateBlock(block.id)}
                  onToggleVisibility={() => onToggleBlockVisibility(block.id)}
                  onDelete={() => onDeleteBlock(block.id)}
                />
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
