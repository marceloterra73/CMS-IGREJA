import React, { useState, useMemo } from 'react';
import {
  Page,
  SectionInstance,
  BlockInstance,
  SectionId,
  BlockId,
  BlockType,
  BlockConfig,
} from '../../types';
import { EditorViewport, EditorMobileTab } from './types';
import { EditorToolbar } from './EditorToolbar';
import { EditorStructurePanel } from './EditorStructurePanel';
import { EditorCanvas } from './EditorCanvas';
import { EditorInspector } from './EditorInspector';
import { AddSectionModal, SectionPresetType } from './AddSectionModal';
import { AddBlockModal } from './AddBlockModal';
import { BLOCK_CATALOG } from '../../constants';
import { getSafeInitialBlockData } from './library/initialBlockData';
import { DeleteSectionConfirmModal } from './DeleteSectionConfirmModal';
import { CheckCircle2, AlertCircle } from 'lucide-react';

interface PageEditorViewProps {
  page: Page;
  onBack: () => void;
  onSavePage: (updatedPage: Page) => void;
}

export const PageEditorView: React.FC<PageEditorViewProps> = ({
  page: initialPage,
  onBack,
  onSavePage,
}) => {
  // Cópia de trabalho local da página
  const [workingPage, setWorkingPage] = useState<Page>(() =>
    JSON.parse(JSON.stringify(initialPage))
  );

  // Rastreamento de alterações não salvas
  const [isDirty, setIsDirty] = useState(false);

  // Estados de Seleção Canônica
  const [selectedSectionId, setSelectedSectionId] = useState<SectionId | null>(null);
  const [selectedBlockId, setSelectedBlockId] = useState<BlockId | null>(null);

  // Visualização e Modos
  const [viewport, setViewport] = useState<EditorViewport>('desktop');
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [activeMobileTab, setActiveMobileTab] = useState<EditorMobileTab>('canvas');

  // Modais
  const [isAddSectionModalOpen, setIsAddSectionModalOpen] = useState(false);
  const [isAddBlockModalOpen, setIsAddBlockModalOpen] = useState(false);
  const [targetSectionForBlock, setTargetSectionForBlock] = useState<SectionId | null>(null);
  const [sectionPendingDelete, setSectionPendingDelete] = useState<SectionInstance | null>(null);

  // Toast de feedback
  const [feedbackToast, setFeedbackToast] = useState<string | null>(null);

  const showNotification = (message: string) => {
    setFeedbackToast(message);
    setTimeout(() => {
      setFeedbackToast(null);
    }, 3500);
  };

  // Seção e Bloco atualmente selecionados (derivados)
  const selectedSection = useMemo(() => {
    if (!selectedSectionId) return null;
    return workingPage.sections.find((s) => s.id === selectedSectionId) || null;
  }, [workingPage.sections, selectedSectionId]);

  const selectedBlock = useMemo(() => {
    if (!selectedSection || !selectedBlockId) return null;
    return selectedSection.blocks.find((b) => b.id === selectedBlockId) || null;
  }, [selectedSection, selectedBlockId]);

  // =========================================================================
  // OPERAÇÕES DE PÁGINA
  // =========================================================================
  const handleUpdatePage = (updates: Partial<Page>) => {
    setWorkingPage((prev) => ({
      ...prev,
      ...updates,
      updatedAt: 'Agora mesmo',
    }));
    setIsDirty(true);
  };

  // =========================================================================
  // OPERAÇÕES DE SEÇÃO
  // =========================================================================
  const handleSelectPage = () => {
    setSelectedSectionId(null);
    setSelectedBlockId(null);
  };

  const handleSelectSection = (sectionId: SectionId) => {
    setSelectedSectionId(sectionId);
    setSelectedBlockId(null);
    if (activeMobileTab === 'structure') {
      setActiveMobileTab('inspector');
    }
  };

  const handleSelectBlock = (sectionId: SectionId, blockId: BlockId) => {
    setSelectedSectionId(sectionId);
    setSelectedBlockId(blockId);
    if (activeMobileTab === 'structure') {
      setActiveMobileTab('inspector');
    }
  };

  const handleAddSection = ({
    title,
    preset,
    initialBlockTypes,
  }: {
    title: string;
    preset: SectionPresetType;
    initialBlockTypes?: BlockType[];
  }) => {
    const newSectionId = `sec_${Date.now()}`;
    const initialBlocks: BlockInstance[] = (initialBlockTypes || []).map((type, idx) => ({
      id: `blk_${Date.now()}_${idx}`,
      type,
      order: idx + 1,
      isVisible: true,
      config: {
        containerWidth: 'standard',
        paddingY: 'medium',
        themeVariant: 'light',
      },
      data: {},
    }));

    const newSection: SectionInstance = {
      id: newSectionId,
      title,
      order: workingPage.sections.length + 1,
      isVisible: true,
      backgroundColor: '#ffffff',
      config: {
        containerWidth: 'standard',
        paddingY: 'medium',
        themeVariant: 'light',
      },
      blocks: initialBlocks,
    };

    setWorkingPage((prev) => ({
      ...prev,
      sections: [...prev.sections, newSection],
    }));
    setSelectedSectionId(newSectionId);
    setSelectedBlockId(null);
    setIsDirty(true);
    showNotification(`Seção "${title}" adicionada com sucesso.`);
  };

  const handleRequestDeleteSection = (sectionId: SectionId) => {
    const sec = workingPage.sections.find((s) => s.id === sectionId);
    if (sec) {
      setSectionPendingDelete(sec);
    }
  };

  const handleDeleteSection = (sectionId: SectionId) => {
    const sectionToDelete = workingPage.sections.find((s) => s.id === sectionId);
    setWorkingPage((prev) => ({
      ...prev,
      sections: prev.sections
        .filter((s) => s.id !== sectionId)
        .map((s, idx) => ({ ...s, order: idx + 1 })),
    }));

    if (selectedSectionId === sectionId) {
      setSelectedSectionId(null);
      setSelectedBlockId(null);
    }
    setIsDirty(true);
    showNotification(`Seção "${sectionToDelete?.title || 'Sem título'}" excluída.`);
  };

  const handleDuplicateSection = (sectionId: SectionId) => {
    const sectionIndex = workingPage.sections.findIndex((s) => s.id === sectionId);
    if (sectionIndex === -1) return;

    const original = workingPage.sections[sectionIndex];
    const newSectionId = `sec_${Date.now()}`;

    const duplicatedBlocks: BlockInstance[] = original.blocks.map((b, idx) => ({
      ...JSON.parse(JSON.stringify(b)),
      id: `blk_${Date.now()}_${idx}`,
      order: idx + 1,
    }));

    const duplicatedSection: SectionInstance = {
      ...JSON.parse(JSON.stringify(original)),
      id: newSectionId,
      title: `${original.title || 'Seção'} (Cópia)`,
      order: sectionIndex + 2,
      blocks: duplicatedBlocks,
    };

    setWorkingPage((prev) => {
      const copy = [...prev.sections];
      copy.splice(sectionIndex + 1, 0, duplicatedSection);
      return {
        ...prev,
        sections: copy.map((s, idx) => ({ ...s, order: idx + 1 })),
      };
    });

    setSelectedSectionId(newSectionId);
    setSelectedBlockId(null);
    setIsDirty(true);
    showNotification('Seção duplicada com sucesso.');
  };

  const handleMoveSectionUp = (index: number) => {
    if (index <= 0) return;
    setWorkingPage((prev) => {
      const copy = [...prev.sections];
      const temp = copy[index - 1];
      copy[index - 1] = copy[index];
      copy[index] = temp;
      return {
        ...prev,
        sections: copy.map((s, idx) => ({ ...s, order: idx + 1 })),
      };
    });
    setIsDirty(true);
  };

  const handleMoveSectionDown = (index: number) => {
    if (index >= workingPage.sections.length - 1) return;
    setWorkingPage((prev) => {
      const copy = [...prev.sections];
      const temp = copy[index + 1];
      copy[index + 1] = copy[index];
      copy[index] = temp;
      return {
        ...prev,
        sections: copy.map((s, idx) => ({ ...s, order: idx + 1 })),
      };
    });
    setIsDirty(true);
  };

  const handleToggleSectionVisibility = (sectionId: SectionId) => {
    setWorkingPage((prev) => ({
      ...prev,
      sections: prev.sections.map((s) =>
        s.id === sectionId ? { ...s, isVisible: !s.isVisible } : s
      ),
    }));
    setIsDirty(true);
  };

  const handleUpdateSection = (sectionId: SectionId, updates: Partial<SectionInstance>) => {
    setWorkingPage((prev) => ({
      ...prev,
      sections: prev.sections.map((s) =>
        s.id === sectionId ? { ...s, ...updates } : s
      ),
    }));
    setIsDirty(true);
  };

  // =========================================================================
  // OPERAÇÕES DE BLOCO
  // =========================================================================
  const handleOpenAddBlockModal = (sectionId: SectionId) => {
    setTargetSectionForBlock(sectionId);
    setIsAddBlockModalOpen(true);
  };

  const handleAddBlockToSection = (blockType: BlockType, targetSecId?: SectionId) => {
    const destinationSectionId = targetSecId || targetSectionForBlock || workingPage.sections[0]?.id;
    if (!destinationSectionId) {
      showNotification('Crie ou selecione uma seção antes de adicionar um bloco.');
      return;
    }

    const newBlockId = `blk_${Date.now()}`;
    const initialData = getSafeInitialBlockData(blockType);
    const newBlock: BlockInstance = {
      id: newBlockId,
      type: blockType,
      order: 999, // ajustado logo abaixo
      isVisible: true,
      config: {
        containerWidth: 'standard',
        paddingY: 'medium',
        themeVariant: 'light',
        alignment: 'left',
      },
      data: initialData,
    };

    setWorkingPage((prev) => ({
      ...prev,
      sections: prev.sections.map((section) => {
        if (section.id !== destinationSectionId) return section;
        const newBlocks = [...section.blocks, newBlock].map((b, idx) => ({
          ...b,
          order: idx + 1,
        }));
        return { ...section, blocks: newBlocks };
      }),
    }));

    setSelectedSectionId(destinationSectionId);
    setSelectedBlockId(newBlockId);
    setIsDirty(true);

    const blockDef = BLOCK_CATALOG[blockType];
    const destinationTitle =
      workingPage.sections.find((s) => s.id === destinationSectionId)?.title || 'seção';
    showNotification(`✓ Bloco "${blockDef?.name || blockType}" adicionado à ${destinationTitle}.`);
  };

  const handleDeleteBlock = (sectionId: SectionId, blockId: BlockId) => {
    setWorkingPage((prev) => ({
      ...prev,
      sections: prev.sections.map((section) => {
        if (section.id !== sectionId) return section;
        return {
          ...section,
          blocks: section.blocks
            .filter((b) => b.id !== blockId)
            .map((b, idx) => ({ ...b, order: idx + 1 })),
        };
      }),
    }));

    if (selectedBlockId === blockId) {
      setSelectedBlockId(null);
    }
    setIsDirty(true);
    showNotification('Bloco excluído da seção.');
  };

  const handleDuplicateBlock = (sectionId: SectionId, blockId: BlockId) => {
    setWorkingPage((prev) => ({
      ...prev,
      sections: prev.sections.map((section) => {
        if (section.id !== sectionId) return section;
        const bIndex = section.blocks.findIndex((b) => b.id === blockId);
        if (bIndex === -1) return section;

        const original = section.blocks[bIndex];
        const newBlockId = `blk_${Date.now()}`;
        const duplicated: BlockInstance = {
          ...JSON.parse(JSON.stringify(original)),
          id: newBlockId,
        };

        const copy = [...section.blocks];
        copy.splice(bIndex + 1, 0, duplicated);

        return {
          ...section,
          blocks: copy.map((b, idx) => ({ ...b, order: idx + 1 })),
        };
      }),
    }));

    setIsDirty(true);
    showNotification('Bloco duplicado.');
  };

  const handleMoveBlockUp = (sectionId: SectionId, blockIndex: number) => {
    if (blockIndex <= 0) return;
    setWorkingPage((prev) => ({
      ...prev,
      sections: prev.sections.map((section) => {
        if (section.id !== sectionId) return section;
        const copy = [...section.blocks];
        const temp = copy[blockIndex - 1];
        copy[blockIndex - 1] = copy[blockIndex];
        copy[blockIndex] = temp;
        return {
          ...section,
          blocks: copy.map((b, idx) => ({ ...b, order: idx + 1 })),
        };
      }),
    }));
    setIsDirty(true);
  };

  const handleMoveBlockDown = (sectionId: SectionId, blockIndex: number) => {
    setWorkingPage((prev) => ({
      ...prev,
      sections: prev.sections.map((section) => {
        if (section.id !== sectionId) return section;
        if (blockIndex >= section.blocks.length - 1) return section;
        const copy = [...section.blocks];
        const temp = copy[blockIndex + 1];
        copy[blockIndex + 1] = copy[blockIndex];
        copy[blockIndex] = temp;
        return {
          ...section,
          blocks: copy.map((b, idx) => ({ ...b, order: idx + 1 })),
        };
      }),
    }));
    setIsDirty(true);
  };

  const handleToggleBlockVisibility = (sectionId: SectionId, blockId: BlockId) => {
    setWorkingPage((prev) => ({
      ...prev,
      sections: prev.sections.map((section) => {
        if (section.id !== sectionId) return section;
        return {
          ...section,
          blocks: section.blocks.map((b) =>
            b.id === blockId ? { ...b, isVisible: !b.isVisible } : b
          ),
        };
      }),
    }));
    setIsDirty(true);
  };

  const handleUpdateBlock = (
    sectionId: SectionId,
    blockId: BlockId,
    updates: {
      config?: Partial<BlockConfig>;
      data?: Record<string, unknown>;
      isVisible?: boolean;
    }
  ) => {
    setWorkingPage((prev) => ({
      ...prev,
      sections: prev.sections.map((section) => {
        if (section.id !== sectionId) return section;
        return {
          ...section,
          blocks: section.blocks.map((b) => {
            if (b.id !== blockId) return b;
            return {
              ...b,
              isVisible:
                updates.isVisible !== undefined ? updates.isVisible : b.isVisible,
              config: {
                ...b.config,
                ...(updates.config || {}),
              },
              data: {
                ...b.data,
                ...(updates.data || {}),
              },
            };
          }),
        };
      }),
    }));
    setIsDirty(true);
  };

  // =========================================================================
  // SALVAR SESSÃO LOCAL E VOLTAR
  // =========================================================================
  const handleSaveSession = () => {
    onSavePage(workingPage);
    setIsDirty(false);
    showNotification('Alterações da página salvas nesta sessão.');
  };

  const handleBackWithSafety = () => {
    if (isDirty) {
      // Salva automaticamente para conforto do usuário e retorna
      onSavePage(workingPage);
    }
    onBack();
  };

  return (
    <div
      id="page-visual-editor-shell"
      className="fixed inset-0 z-40 bg-stone-100 flex flex-col h-screen overflow-hidden animate-in fade-in duration-200"
    >
      {/* Toast de Notificação */}
      {feedbackToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-stone-900 text-white text-xs font-semibold px-4 py-3 rounded-xl shadow-xl flex items-center gap-2.5 border border-stone-800 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{feedbackToast}</span>
        </div>
      )}

      {/* 1. Barra Superior do Editor (Toolbar) */}
      <EditorToolbar
        page={workingPage}
        viewport={viewport}
        onViewportChange={setViewport}
        isPreviewMode={isPreviewMode}
        onTogglePreview={() => setIsPreviewMode((prev) => !prev)}
        isDirty={isDirty}
        onSaveSession={handleSaveSession}
        onBack={handleBackWithSafety}
        activeMobileTab={activeMobileTab}
        onMobileTabChange={setActiveMobileTab}
      />

      {/* 2. Área de Trabalho Principal do Editor */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Painel Esquerdo: Estrutura / Camadas */}
        {/* Em desktop é coluna fixa; em mobile aparece conforme aba ativa */}
        <div
          className={`w-72 shrink-0 h-full ${
            isPreviewMode
              ? 'hidden'
              : activeMobileTab === 'structure'
              ? 'flex w-full absolute inset-0 z-20 md:static md:w-72'
              : 'hidden md:flex'
          }`}
        >
          <EditorStructurePanel
            page={workingPage}
            selectedSectionId={selectedSectionId}
            selectedBlockId={selectedBlockId}
            onSelectPage={handleSelectPage}
            onSelectSection={handleSelectSection}
            onSelectBlock={handleSelectBlock}
            onMoveSectionUp={handleMoveSectionUp}
            onMoveSectionDown={handleMoveSectionDown}
            onDuplicateSection={handleDuplicateSection}
            onToggleSectionVisibility={handleToggleSectionVisibility}
            onDeleteSection={handleRequestDeleteSection}
            onMoveBlockUp={handleMoveBlockUp}
            onMoveBlockDown={handleMoveBlockDown}
            onDuplicateBlock={handleDuplicateBlock}
            onToggleBlockVisibility={handleToggleBlockVisibility}
            onDeleteBlock={handleDeleteBlock}
            onOpenAddSectionModal={() => setIsAddSectionModalOpen(true)}
            onOpenAddBlockModal={handleOpenAddBlockModal}
          />
        </div>

        {/* Centro: Canvas da Página */}
        <div
          className={`flex-1 flex flex-col h-full overflow-hidden ${
            !isPreviewMode && activeMobileTab !== 'canvas'
              ? 'hidden md:flex'
              : 'flex'
          }`}
        >
          <EditorCanvas
            page={workingPage}
            viewport={viewport}
            isPreviewMode={isPreviewMode}
            selectedSectionId={selectedSectionId}
            selectedBlockId={selectedBlockId}
            onSelectPage={handleSelectPage}
            onSelectSection={handleSelectSection}
            onSelectBlock={handleSelectBlock}
            onMoveSectionUp={handleMoveSectionUp}
            onMoveSectionDown={handleMoveSectionDown}
            onDuplicateSection={handleDuplicateSection}
            onToggleSectionVisibility={handleToggleSectionVisibility}
            onDeleteSection={handleRequestDeleteSection}
            onOpenAddSectionModal={() => setIsAddSectionModalOpen(true)}
            onOpenAddBlockModal={handleOpenAddBlockModal}
            onMoveBlockUp={handleMoveBlockUp}
            onMoveBlockDown={handleMoveBlockDown}
            onDuplicateBlock={handleDuplicateBlock}
            onToggleBlockVisibility={handleToggleBlockVisibility}
            onDeleteBlock={handleDeleteBlock}
          />
        </div>

        {/* Painel Direito: Inspetor de Propriedades */}
        {/* Em desktop é coluna fixa; em mobile aparece conforme aba ativa */}
        <div
          className={`w-80 shrink-0 h-full ${
            isPreviewMode
              ? 'hidden'
              : activeMobileTab === 'inspector'
              ? 'flex w-full absolute inset-0 z-20 md:static md:w-80'
              : 'hidden lg:flex'
          }`}
        >
          <EditorInspector
            page={workingPage}
            selectedSection={selectedSection}
            selectedBlock={selectedBlock}
            onUpdatePage={handleUpdatePage}
            onUpdateSection={handleUpdateSection}
            onUpdateBlock={handleUpdateBlock}
            onDeleteSection={handleRequestDeleteSection}
            onDuplicateSection={handleDuplicateSection}
            onMoveSectionUp={() => {
              if (!selectedSectionId) return;
              const idx = workingPage.sections.findIndex((s) => s.id === selectedSectionId);
              if (idx > 0) handleMoveSectionUp(idx);
            }}
            onMoveSectionDown={() => {
              if (!selectedSectionId) return;
              const idx = workingPage.sections.findIndex((s) => s.id === selectedSectionId);
              if (idx >= 0 && idx < workingPage.sections.length - 1) handleMoveSectionDown(idx);
            }}
            onDeleteBlock={handleDeleteBlock}
            onDuplicateBlock={handleDuplicateBlock}
            onMoveBlockUp={() => {
              if (!selectedSection || !selectedBlockId) return;
              const idx = selectedSection.blocks.findIndex((b) => b.id === selectedBlockId);
              if (idx > 0) handleMoveBlockUp(selectedSection.id, idx);
            }}
            onMoveBlockDown={() => {
              if (!selectedSection || !selectedBlockId) return;
              const idx = selectedSection.blocks.findIndex((b) => b.id === selectedBlockId);
              if (idx >= 0 && idx < selectedSection.blocks.length - 1) {
                handleMoveBlockDown(selectedSection.id, idx);
              }
            }}
            onAddBlockToSection={handleOpenAddBlockModal}
          />
        </div>
      </div>

      {/* Modais do Editor */}
      <AddSectionModal
        isOpen={isAddSectionModalOpen}
        onClose={() => setIsAddSectionModalOpen(false)}
        onAddSection={handleAddSection}
      />

      <AddBlockModal
        isOpen={isAddBlockModalOpen}
        sections={workingPage.sections}
        defaultSectionId={targetSectionForBlock || selectedSectionId}
        sectionTitle={
          targetSectionForBlock
            ? workingPage.sections.find((s) => s.id === targetSectionForBlock)?.title
            : selectedSectionId
            ? workingPage.sections.find((s) => s.id === selectedSectionId)?.title
            : undefined
        }
        onClose={() => {
          setIsAddBlockModalOpen(false);
          setTargetSectionForBlock(null);
        }}
        onSelectBlockType={handleAddBlockToSection}
      />

      <DeleteSectionConfirmModal
        isOpen={!!sectionPendingDelete}
        section={sectionPendingDelete}
        onClose={() => setSectionPendingDelete(null)}
        onConfirm={() => {
          if (sectionPendingDelete) {
            handleDeleteSection(sectionPendingDelete.id);
            setSectionPendingDelete(null);
          }
        }}
      />
    </div>
  );
};
