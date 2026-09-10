import React, { useState } from 'react';
import {
  Layers,
  FileText,
  ChevronRight,
  ChevronDown,
  Eye,
  EyeOff,
  Plus,
  Trash2,
  Copy,
  ChevronUp,
  Box,
  CornerDownRight,
} from 'lucide-react';
import { Page, SectionId, BlockId } from '../../types';
import { BLOCK_CATALOG } from '../../constants';
import { getBlockIcon } from './blockIcons';

interface EditorStructurePanelProps {
  page: Page;
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
  onMoveBlockUp: (sectionId: SectionId, blockIndex: number) => void;
  onMoveBlockDown: (sectionId: SectionId, blockIndex: number) => void;
  onDuplicateBlock: (sectionId: SectionId, blockId: BlockId) => void;
  onToggleBlockVisibility: (sectionId: SectionId, blockId: BlockId) => void;
  onDeleteBlock: (sectionId: SectionId, blockId: BlockId) => void;
  onOpenAddSectionModal: () => void;
  onOpenAddBlockModal: (sectionId: SectionId) => void;
}

export const EditorStructurePanel: React.FC<EditorStructurePanelProps> = ({
  page,
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
  onMoveBlockUp,
  onMoveBlockDown,
  onDuplicateBlock,
  onToggleBlockVisibility,
  onDeleteBlock,
  onOpenAddSectionModal,
  onOpenAddBlockModal,
}) => {
  // Estado para colapsar/expandir seções
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({});

  const toggleCollapse = (sectionId: string) => {
    setCollapsedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  const isPageSelected = !selectedSectionId && !selectedBlockId;

  return (
    <aside
      id="editor-structure-panel"
      className="w-full h-full bg-white border-r border-stone-200 flex flex-col select-none overflow-hidden"
    >
      {/* Header do Painel */}
      <div className="p-3.5 border-b border-stone-200 flex items-center justify-between bg-stone-50/50">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-amber-600" />
          <h2 className="text-xs font-bold text-stone-900 uppercase tracking-wider">
            Estrutura & Camadas
          </h2>
        </div>
        <button
          type="button"
          onClick={onOpenAddSectionModal}
          className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 transition-colors"
          title="Adicionar nova seção"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Seção</span>
        </button>
      </div>

      {/* Árvore de Camadas */}
      <div className="flex-1 overflow-y-auto p-2.5 space-y-1">
        {/* Raiz: Página */}
        <div
          onClick={onSelectPage}
          className={`flex items-center justify-between px-2.5 py-2 rounded-lg cursor-pointer transition-colors text-xs font-semibold ${
            isPageSelected
              ? 'bg-amber-500/10 text-amber-900 border border-amber-300'
              : 'text-stone-700 hover:bg-stone-100 border border-transparent'
          }`}
        >
          <div className="flex items-center gap-2 truncate">
            <FileText className={`w-4 h-4 ${isPageSelected ? 'text-amber-600' : 'text-stone-400'}`} />
            <span className="truncate">{page.title}</span>
          </div>
          <span className="text-[10px] font-medium text-stone-600 bg-stone-100 px-1.5 py-0.5 rounded">
            Página
          </span>
        </div>

        {/* Separador sutil */}
        <div className="pt-1 pb-1">
          <div className="border-t border-stone-100" />
        </div>

        {/* Lista de Seções */}
        {page.sections.length === 0 ? (
          <div className="p-4 text-center text-xs text-stone-400 bg-stone-50 rounded-lg border border-dashed border-stone-200">
            Nenhuma seção nesta página.
            <button
              type="button"
              onClick={onOpenAddSectionModal}
              className="mt-2 block mx-auto text-xs font-semibold text-amber-700 hover:underline"
            >
              + Adicionar Seção
            </button>
          </div>
        ) : (
          page.sections.map((section, sIndex) => {
            const isSectionSelected =
              selectedSectionId === section.id && !selectedBlockId;
            const isCollapsed = !!collapsedSections[section.id];
            const isFirstSection = sIndex === 0;
            const isLastSection = sIndex === page.sections.length - 1;

            return (
              <div
                key={section.id}
                className={`rounded-lg transition-all border ${
                  isSectionSelected
                    ? 'border-amber-400 bg-amber-50/40 shadow-2xs'
                    : 'border-stone-200/80 bg-white hover:border-stone-300'
                }`}
              >
                {/* Linha da Seção */}
                <div
                  onClick={() => onSelectSection(section.id)}
                  className="flex items-center justify-between px-2 py-1.5 cursor-pointer group"
                >
                  <div className="flex items-center gap-1.5 min-w-0 flex-1">
                    {/* Botão Expandir / Colapsar */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleCollapse(section.id);
                      }}
                      className="p-0.5 rounded text-stone-400 hover:text-stone-700 hover:bg-stone-200/60"
                    >
                      {isCollapsed ? (
                        <ChevronRight className="w-3.5 h-3.5" />
                      ) : (
                        <ChevronDown className="w-3.5 h-3.5" />
                      )}
                    </button>

                    <Layers
                      className={`w-3.5 h-3.5 shrink-0 ${
                        isSectionSelected ? 'text-amber-600' : 'text-stone-400'
                      }`}
                    />

                    <span
                      className={`text-xs font-semibold truncate ${
                        !section.isVisible ? 'line-through opacity-50' : ''
                      } ${isSectionSelected ? 'text-amber-900' : 'text-stone-800'}`}
                      title={section.title || `Seção ${sIndex + 1}`}
                    >
                      {section.title || `Seção ${sIndex + 1}`}
                    </span>

                    <span className="text-[10px] text-stone-600 font-mono">
                      ({section.blocks.length})
                    </span>
                  </div>

                  {/* Ações da Seção */}
                  <div className="flex items-center gap-0.5 opacity-80 group-hover:opacity-100">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleSectionVisibility(section.id);
                      }}
                      className="p-1 rounded text-stone-400 hover:text-stone-700 hover:bg-stone-100"
                      title={section.isVisible ? 'Ocultar' : 'Exibir'}
                    >
                      {section.isVisible ? (
                        <Eye className="w-3 h-3" />
                      ) : (
                        <EyeOff className="w-3 h-3 text-amber-600" />
                      )}
                    </button>

                    <button
                      type="button"
                      disabled={isFirstSection}
                      onClick={(e) => {
                        e.stopPropagation();
                        onMoveSectionUp(sIndex);
                      }}
                      className="p-1 rounded text-stone-400 hover:text-stone-700 hover:bg-stone-100 disabled:opacity-20"
                      title="Mover para cima"
                    >
                      <ChevronUp className="w-3 h-3" />
                    </button>

                    <button
                      type="button"
                      disabled={isLastSection}
                      onClick={(e) => {
                        e.stopPropagation();
                        onMoveSectionDown(sIndex);
                      }}
                      className="p-1 rounded text-stone-400 hover:text-stone-700 hover:bg-stone-100 disabled:opacity-20"
                      title="Mover para baixo"
                    >
                      <ChevronDown className="w-3 h-3" />
                    </button>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenAddBlockModal(section.id);
                      }}
                      className="p-1 rounded text-amber-600 hover:text-amber-700 hover:bg-amber-100/60 ml-0.5"
                      title="Adicionar bloco nesta seção"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                {/* Filhos: Blocos da Seção */}
                {!isCollapsed && (
                  <div className="pl-4 pr-1.5 pb-1.5 space-y-1">
                    {section.blocks.length === 0 ? (
                      <div className="py-2 px-2 text-[11px] text-stone-400 bg-stone-50 rounded border border-dashed border-stone-200 flex items-center justify-between">
                        <span>Sem blocos</span>
                        <button
                          type="button"
                          onClick={() => onOpenAddBlockModal(section.id)}
                          className="text-[11px] font-semibold text-amber-700 hover:underline"
                        >
                          + Adicionar Bloco
                        </button>
                      </div>
                    ) : (
                      section.blocks.map((block, bIndex) => {
                        const isBlockSelected =
                          selectedBlockId === block.id &&
                          selectedSectionId === section.id;
                        const blockDef = BLOCK_CATALOG[block.type];
                        const blockName = blockDef?.name || block.type;
                        const isFirstBlock = bIndex === 0;
                        const isLastBlock = bIndex === section.blocks.length - 1;

                        return (
                          <div
                            key={block.id}
                            onClick={(e) => {
                              e.stopPropagation();
                              onSelectBlock(section.id, block.id);
                            }}
                            className={`flex items-center justify-between px-2 py-1 rounded-md cursor-pointer text-xs transition-colors group ${
                              isBlockSelected
                                ? 'bg-amber-600 text-white font-medium shadow-2xs'
                                : 'text-stone-600 hover:bg-stone-100/90'
                            }`}
                          >
                            <div className="flex items-center gap-1.5 truncate flex-1 min-w-0">
                              <CornerDownRight
                                className={`w-3 h-3 shrink-0 ${
                                  isBlockSelected ? 'text-amber-200' : 'text-stone-300'
                                }`}
                              />
                              <span
                                className={`shrink-0 ${
                                  isBlockSelected ? 'text-white' : 'text-stone-500'
                                }`}
                              >
                                {getBlockIcon(block.type, 'w-3 h-3')}
                              </span>
                              <span
                                className={`truncate text-[11px] ${
                                  !block.isVisible ? 'line-through opacity-50' : ''
                                }`}
                                title={blockName}
                              >
                                {blockName}
                              </span>
                            </div>

                            {/* Ações do Bloco */}
                            <div className="flex items-center gap-0.5 opacity-75 group-hover:opacity-100">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onToggleBlockVisibility(section.id, block.id);
                                }}
                                className={`p-0.5 rounded ${
                                  isBlockSelected
                                    ? 'hover:bg-amber-700 text-amber-100'
                                    : 'hover:bg-stone-200 text-stone-400'
                                }`}
                                title={block.isVisible ? 'Ocultar' : 'Exibir'}
                              >
                                {block.isVisible ? (
                                  <Eye className="w-2.5 h-2.5" />
                                ) : (
                                  <EyeOff className="w-2.5 h-2.5 text-amber-300" />
                                )}
                              </button>

                              <button
                                type="button"
                                disabled={isFirstBlock}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onMoveBlockUp(section.id, bIndex);
                                }}
                                className={`p-0.5 rounded disabled:opacity-20 ${
                                  isBlockSelected
                                    ? 'hover:bg-amber-700 text-amber-100'
                                    : 'hover:bg-stone-200 text-stone-400'
                                }`}
                                title="Mover para cima"
                              >
                                <ChevronUp className="w-2.5 h-2.5" />
                              </button>

                              <button
                                type="button"
                                disabled={isLastBlock}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onMoveBlockDown(section.id, bIndex);
                                }}
                                className={`p-0.5 rounded disabled:opacity-20 ${
                                  isBlockSelected
                                    ? 'hover:bg-amber-700 text-amber-100'
                                    : 'hover:bg-stone-200 text-stone-400'
                                }`}
                                title="Mover para baixo"
                              >
                                <ChevronDown className="w-2.5 h-2.5" />
                              </button>

                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onDeleteBlock(section.id, block.id);
                                }}
                                className={`p-0.5 rounded ${
                                  isBlockSelected
                                    ? 'hover:bg-red-700 text-red-200'
                                    : 'hover:bg-red-100 text-red-400'
                                }`}
                                title="Excluir bloco"
                              >
                                <Trash2 className="w-2.5 h-2.5" />
                              </button>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Rodapé do Painel */}
      <div className="p-3 border-t border-stone-200 bg-stone-50/70 text-[11px] text-stone-500 flex items-center justify-between">
        <span>
          {page.sections.length} {page.sections.length === 1 ? 'seção' : 'seções'}
        </span>
        <button
          type="button"
          onClick={onOpenAddSectionModal}
          className="text-amber-700 font-semibold hover:underline flex items-center gap-1"
        >
          <Plus className="w-3 h-3" />
          Nova Seção
        </button>
      </div>
    </aside>
  );
};
