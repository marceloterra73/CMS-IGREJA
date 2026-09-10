import React from 'react';
import { Page, SectionId, BlockId } from '../../types';
import { EditorViewport } from './types';
import { ResponsivePreview } from './ResponsivePreview';
import { EditorSection } from './EditorSection';
import { Plus, Eye, Layers } from 'lucide-react';

interface EditorCanvasProps {
  page: Page;
  viewport: EditorViewport;
  isPreviewMode: boolean;
  selectedSectionId: SectionId | null;
  selectedBlockId: BlockId | null;
  onSelectPage: () => void;
  onSelectSection: (sectionId: SectionId) => void;
  onSelectBlock: (sectionId: SectionId, blockId: BlockId) => void;
  onMoveSectionUp: (index: number) => void;
  onMoveSectionDown: (index: number) => void;
  onDuplicateSection: (sectionId: SectionId) => void;
  onToggleSectionVisibility: (sectionId: SectionId) => void;
  onDeleteSection: (sectionId: SectionId) => void;
  onOpenAddSectionModal: () => void;
  onOpenAddBlockModal: (sectionId: SectionId) => void;
  onMoveBlockUp: (sectionId: SectionId, blockIndex: number) => void;
  onMoveBlockDown: (sectionId: SectionId, blockIndex: number) => void;
  onDuplicateBlock: (sectionId: SectionId, blockId: BlockId) => void;
  onToggleBlockVisibility: (sectionId: SectionId, blockId: BlockId) => void;
  onDeleteBlock: (sectionId: SectionId, blockId: BlockId) => void;
}

export const EditorCanvas: React.FC<EditorCanvasProps> = ({
  page,
  viewport,
  isPreviewMode,
  selectedSectionId,
  selectedBlockId,
  onSelectPage,
  onSelectSection,
  onSelectBlock,
  onMoveSectionUp,
  onMoveSectionDown,
  onDuplicateSection,
  onToggleSectionVisibility,
  onDeleteSection,
  onOpenAddSectionModal,
  onOpenAddBlockModal,
  onMoveBlockUp,
  onMoveBlockDown,
  onDuplicateBlock,
  onToggleBlockVisibility,
  onDeleteBlock,
}) => {
  return (
    <main
      id="editor-canvas-area"
      onClick={() => onSelectPage()}
      className="flex-1 bg-stone-100/80 overflow-y-auto relative select-none scrollbar-thin"
    >
      {/* Banner flutuante no modo Prévia */}
      {isPreviewMode && (
        <div className="sticky top-3 z-30 flex justify-center pointer-events-none">
          <div className="bg-stone-900/90 backdrop-blur-xs text-white text-xs font-semibold px-4 py-1.5 rounded-full shadow-lg border border-stone-700/60 flex items-center gap-2">
            <Eye className="w-3.5 h-3.5 text-amber-400" />
            <span>Modo Prévia Ativo — Navegação e Aparência Limpa</span>
          </div>
        </div>
      )}

      {/* Frame Responsivo */}
      <ResponsivePreview viewport={viewport}>
        {page.sections.length === 0 ? (
          <div className="py-20 px-6 text-center">
            <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center mx-auto mb-3">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-stone-900">
              Página sem Seções
            </h3>
            <p className="text-xs text-stone-500 max-w-sm mx-auto mt-1 mb-5">
              Esta página ainda não possui nenhuma seção de conteúdo. Adicione
              uma seção para começar a compor a estrutura.
            </p>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onOpenAddSectionModal();
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 transition-colors shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              Adicionar Primeira Seção
            </button>
          </div>
        ) : (
          <div className="p-3 sm:p-5 space-y-2">
            {page.sections.map((section, index) => {
              const isSectionSelected =
                selectedSectionId === section.id && !selectedBlockId;

              return (
                <EditorSection
                  key={section.id}
                  section={section}
                  index={index}
                  totalSections={page.sections.length}
                  isSelected={isSectionSelected}
                  selectedBlockId={
                    selectedSectionId === section.id ? selectedBlockId : null
                  }
                  isPreviewMode={isPreviewMode}
                  onSelectSection={() => onSelectSection(section.id)}
                  onSelectBlock={(blockId) =>
                    onSelectBlock(section.id, blockId)
                  }
                  onMoveUp={() => onMoveSectionUp(index)}
                  onMoveDown={() => onMoveSectionDown(index)}
                  onDuplicate={() => onDuplicateSection(section.id)}
                  onToggleVisibility={() =>
                    onToggleSectionVisibility(section.id)
                  }
                  onDelete={() => onDeleteSection(section.id)}
                  onAddBlock={() => onOpenAddBlockModal(section.id)}
                  onMoveBlockUp={(bIdx) => onMoveBlockUp(section.id, bIdx)}
                  onMoveBlockDown={(bIdx) => onMoveBlockDown(section.id, bIdx)}
                  onDuplicateBlock={(bId) =>
                    onDuplicateBlock(section.id, bId)
                  }
                  onToggleBlockVisibility={(bId) =>
                    onToggleBlockVisibility(section.id, bId)
                  }
                  onDeleteBlock={(bId) => onDeleteBlock(section.id, bId)}
                />
              );
            })}

            {/* Botão para adicionar seção ao final da página */}
            {!isPreviewMode && (
              <div className="pt-4 pb-2 text-center">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenAddSectionModal();
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-stone-600 hover:text-stone-900 bg-stone-50 hover:bg-stone-100 border border-dashed border-stone-300 hover:border-stone-400 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5 text-amber-600" />
                  <span>Adicionar Nova Seção</span>
                </button>
              </div>
            )}
          </div>
        )}
      </ResponsivePreview>
    </main>
  );
};
