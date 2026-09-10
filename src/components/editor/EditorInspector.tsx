import React from 'react';
import {
  SlidersHorizontal,
  FileText,
  Layers,
  Box,
  Eye,
  EyeOff,
  Trash2,
  Copy,
  ChevronUp,
  ChevronDown,
  Plus,
  Palette,
  Layout,
  AlignLeft,
  AlignCenter,
  AlignRight,
} from 'lucide-react';
import {
  Page,
  SectionInstance,
  BlockInstance,
  SectionId,
  BlockId,
  PageStatus,
  BlockConfig,
  SectionConfig,
} from '../../types';
import { BLOCK_CATALOG } from '../../constants';
import { getBlockIcon } from './blockIcons';
import { BlockContentInspector } from './inspector/BlockContentInspector';
import { SectionInspector } from './inspector/SectionInspector';

interface EditorInspectorProps {
  page: Page;
  selectedSection: SectionInstance | null;
  selectedBlock: BlockInstance | null;
  onUpdatePage: (updates: Partial<Page>) => void;
  onUpdateSection: (sectionId: SectionId, updates: Partial<SectionInstance>) => void;
  onUpdateBlock: (
    sectionId: SectionId,
    blockId: BlockId,
    updates: { config?: Partial<BlockConfig>; data?: Record<string, unknown>; isVisible?: boolean }
  ) => void;
  onDeleteSection: (sectionId: SectionId) => void;
  onDuplicateSection: (sectionId: SectionId) => void;
  onMoveSectionUp: () => void;
  onMoveSectionDown: () => void;
  onDeleteBlock: (sectionId: SectionId, blockId: BlockId) => void;
  onDuplicateBlock: (sectionId: SectionId, blockId: BlockId) => void;
  onMoveBlockUp: () => void;
  onMoveBlockDown: () => void;
  onAddBlockToSection: (sectionId: SectionId) => void;
}

export const EditorInspector: React.FC<EditorInspectorProps> = ({
  page,
  selectedSection,
  selectedBlock,
  onUpdatePage,
  onUpdateSection,
  onUpdateBlock,
  onDeleteSection,
  onDuplicateSection,
  onMoveSectionUp,
  onMoveSectionDown,
  onDeleteBlock,
  onDuplicateBlock,
  onMoveBlockUp,
  onMoveBlockDown,
  onAddBlockToSection,
}) => {
  // Determina o tipo de item selecionado
  const inspectorType: 'page' | 'section' | 'block' = selectedBlock
    ? 'block'
    : selectedSection
    ? 'section'
    : 'page';

  const sectionIndex = selectedSection
    ? page.sections.findIndex((s) => s.id === selectedSection.id)
    : -1;

  return (
    <aside
      id="editor-inspector-panel"
      className="w-full h-full bg-white border-l border-stone-200 flex flex-col select-none overflow-hidden"
    >
      {/* Header do Inspector */}
      <div className="p-3.5 border-b border-stone-200 flex items-center justify-between bg-stone-50/50">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-amber-600" />
          <h2 className="text-xs font-bold text-stone-900 uppercase tracking-wider">
            Propriedades
          </h2>
        </div>

        <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-stone-100 text-stone-600 border border-stone-200">
          {inspectorType === 'block'
            ? 'Bloco'
            : inspectorType === 'section'
            ? 'Seção'
            : 'Página'}
        </span>
      </div>

      {/* Conteúdo do Inspector com Scroll */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5 scrollbar-thin">
        {/* ========================================================= */}
        {/* CASO 1: BLOCO SELECIONADO                                 */}
        {/* ========================================================= */}
        {inspectorType === 'block' && selectedBlock && selectedSection && (
          <div className="space-y-5">
            {/* Identificação do Bloco */}
            <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                {getBlockIcon(selectedBlock.type, 'w-4 h-4')}
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-xs font-bold text-stone-900 truncate">
                  {BLOCK_CATALOG[selectedBlock.type]?.name || selectedBlock.type}
                </h3>
                <p className="text-[11px] text-stone-500 line-clamp-2 mt-0.5">
                  {BLOCK_CATALOG[selectedBlock.type]?.description}
                </p>
              </div>
            </div>

            {/* Visibilidade do Bloco */}
            <div className="flex items-center justify-between p-2.5 rounded-lg border border-stone-200">
              <span className="text-xs font-medium text-stone-700">
                Visibilidade do Bloco
              </span>
              <button
                type="button"
                onClick={() =>
                  onUpdateBlock(selectedSection.id, selectedBlock.id, {
                    isVisible: !selectedBlock.isVisible,
                  })
                }
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold transition-colors ${
                  selectedBlock.isVisible
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-stone-100 text-stone-500 border border-stone-200'
                }`}
              >
                {selectedBlock.isVisible ? (
                  <>
                    <Eye className="w-3.5 h-3.5" />
                    <span>Visível</span>
                  </>
                ) : (
                  <>
                    <EyeOff className="w-3.5 h-3.5" />
                    <span>Oculto</span>
                  </>
                )}
              </button>
            </div>

            {/* Configurações de Layout do Bloco */}
            <div className="space-y-3 pt-1">
              <h4 className="text-xs font-bold text-stone-800 uppercase tracking-wider flex items-center gap-1.5">
                <Layout className="w-3.5 h-3.5 text-stone-500" />
                <span>Layout & Estilo</span>
              </h4>

              {/* Alinhamento */}
              <div>
                <label className="block text-[11px] font-semibold text-stone-600 mb-1.5">
                  Alinhamento de Conteúdo
                </label>
                <div className="grid grid-cols-3 gap-1.5 bg-stone-100 p-1 rounded-lg">
                  {(['left', 'center', 'right'] as const).map((align) => (
                    <button
                      key={align}
                      type="button"
                      onClick={() =>
                        onUpdateBlock(selectedSection.id, selectedBlock.id, {
                          config: { ...selectedBlock.config, alignment: align },
                        })
                      }
                      className={`flex items-center justify-center gap-1 py-1 rounded-md text-xs font-medium transition-colors ${
                        (selectedBlock.config?.alignment || 'left') === align
                          ? 'bg-white text-stone-900 shadow-xs font-bold'
                          : 'text-stone-500 hover:text-stone-800'
                      }`}
                    >
                      {align === 'left' && <AlignLeft className="w-3.5 h-3.5" />}
                      {align === 'center' && <AlignCenter className="w-3.5 h-3.5" />}
                      {align === 'right' && <AlignRight className="w-3.5 h-3.5" />}
                      <span className="capitalize">{align === 'left' ? 'Esq' : align === 'center' ? 'Centro' : 'Dir'}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Padding Vertical */}
              <div>
                <label className="block text-[11px] font-semibold text-stone-600 mb-1.5">
                  Espaçamento Vertical (Padding)
                </label>
                <select
                  value={selectedBlock.config?.paddingY || 'medium'}
                  onChange={(e) =>
                    onUpdateBlock(selectedSection.id, selectedBlock.id, {
                      config: {
                        ...selectedBlock.config,
                        paddingY: e.target.value as 'none' | 'small' | 'medium' | 'large',
                      },
                    })
                  }
                  className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-stone-200 bg-white text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value="none">Nenhum (0px)</option>
                  <option value="small">Compacto (Pequeno)</option>
                  <option value="medium">Padrão (Médio)</option>
                  <option value="large">Espaçoso (Grande)</option>
                </select>
              </div>

              {/* Variante de Tema */}
              <div>
                <label className="block text-[11px] font-semibold text-stone-600 mb-1.5">
                  Tema Visual do Bloco
                </label>
                <select
                  value={selectedBlock.config?.themeVariant || 'light'}
                  onChange={(e) =>
                    onUpdateBlock(selectedSection.id, selectedBlock.id, {
                      config: {
                        ...selectedBlock.config,
                        themeVariant: e.target.value as 'light' | 'dark' | 'accent' | 'neutral',
                      },
                    })
                  }
                  className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-stone-200 bg-white text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value="light">Claro Padrão (White)</option>
                  <option value="neutral">Neutro Suave (Stone)</option>
                  <option value="accent">Destaque Eclesiástico (Âmbar)</option>
                  <option value="dark">Noturno / Dark</option>
                </select>
              </div>
            </div>

            {/* Dados Editáveis Estruturados Orientados por Schema */}
            <div className="pt-2 border-t border-stone-100">
              <BlockContentInspector
                block={selectedBlock}
                onUpdateData={(newData) =>
                  onUpdateBlock(selectedSection.id, selectedBlock.id, {
                    data: newData,
                  })
                }
              />
            </div>

            {/* Ações Rápidas do Bloco */}
            <div className="pt-3 border-t border-stone-100 space-y-2">
              <h4 className="text-xs font-bold text-stone-800 uppercase tracking-wider">
                Ações do Bloco
              </h4>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={onMoveBlockUp}
                  className="flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg border border-stone-200 hover:bg-stone-50 text-xs font-medium text-stone-700"
                >
                  <ChevronUp className="w-3.5 h-3.5" />
                  <span>Mover Acima</span>
                </button>
                <button
                  type="button"
                  onClick={onMoveBlockDown}
                  className="flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg border border-stone-200 hover:bg-stone-50 text-xs font-medium text-stone-700"
                >
                  <ChevronDown className="w-3.5 h-3.5" />
                  <span>Mover Abaixo</span>
                </button>
                <button
                  type="button"
                  onClick={() =>
                    onDuplicateBlock(selectedSection.id, selectedBlock.id)
                  }
                  className="flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg border border-stone-200 hover:bg-stone-50 text-xs font-medium text-stone-700"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Duplicar Bloco</span>
                </button>
                <button
                  type="button"
                  onClick={() =>
                    onDeleteBlock(selectedSection.id, selectedBlock.id)
                  }
                  className="flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg border border-red-200 hover:bg-red-50 text-xs font-medium text-red-700"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Excluir Bloco</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* CASO 2: SEÇÃO SELECIONADA                                 */}
        {/* ========================================================= */}
        {inspectorType === 'section' && selectedSection && (
          <SectionInspector
            section={selectedSection}
            isFirst={sectionIndex <= 0}
            isLast={sectionIndex >= page.sections.length - 1}
            onUpdateSection={onUpdateSection}
            onAddBlockToSection={onAddBlockToSection}
            onMoveSectionUp={onMoveSectionUp}
            onMoveSectionDown={onMoveSectionDown}
            onDuplicateSection={onDuplicateSection}
            onRequestDeleteSection={onDeleteSection}
          />
        )}

        {/* ========================================================= */}
        {/* CASO 3: PÁGINA SELECIONADA                                */}
        {/* ========================================================= */}
        {inspectorType === 'page' && (
          <div className="space-y-5">
            {/* Identificação da Página */}
            <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                <FileText className="w-4 h-4" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-xs font-bold text-stone-900 truncate">
                  {page.title}
                </h3>
                <p className="text-[11px] text-stone-500 mt-0.5 font-mono">
                  Slug: {page.slug}
                </p>
              </div>
            </div>

            {/* Título da Página */}
            <div>
              <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                Título da Página
              </label>
              <input
                type="text"
                value={page.title}
                onChange={(e) => onUpdatePage({ title: e.target.value })}
                className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-stone-200 bg-white text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            {/* Slug */}
            <div>
              <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                Caminho da URL (Slug)
              </label>
              <input
                type="text"
                value={page.slug}
                disabled={page.isHome}
                onChange={(e) => onUpdatePage({ slug: e.target.value })}
                className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-stone-200 bg-white text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-500 disabled:bg-stone-50 disabled:text-stone-400 font-mono"
              />
              {page.isHome && (
                <span className="text-[10px] text-stone-600 mt-1 block">
                  A página inicial possui rota raiz fixa (/).
                </span>
              )}
            </div>

            {/* Status de Publicação */}
            <div>
              <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                Status de Publicação
              </label>
              <select
                value={page.status}
                onChange={(e) =>
                  onUpdatePage({ status: e.target.value as PageStatus })
                }
                className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-stone-200 bg-white text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value="published">Publicada</option>
                <option value="draft">Rascunho</option>
                <option value="archived">Arquivada</option>
              </select>
            </div>

            {/* SEO Básico da Página */}
            <div className="space-y-3 pt-2 border-t border-stone-100">
              <h4 className="text-xs font-bold text-stone-800 uppercase tracking-wider">
                Otimização & SEO
              </h4>

              <div>
                <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                  Título SEO (Meta Title)
                </label>
                <input
                  type="text"
                  value={page.seo?.metaTitle || ''}
                  onChange={(e) =>
                    onUpdatePage({
                      seo: {
                        ...page.seo,
                        metaTitle: e.target.value,
                        metaDescription: page.seo?.metaDescription || '',
                      },
                    })
                  }
                  placeholder="Ex: Cultos e Horários — Igreja Batista Central"
                  className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-stone-200 bg-white text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                  Descrição SEO (Meta Description)
                </label>
                <textarea
                  rows={3}
                  value={page.seo?.metaDescription || ''}
                  onChange={(e) =>
                    onUpdatePage({
                      seo: {
                        ...page.seo,
                        metaTitle: page.seo?.metaTitle || page.title,
                        metaDescription: e.target.value,
                      },
                    })
                  }
                  placeholder="Descrição breve para motores de busca..."
                  className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-stone-200 bg-white text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            {/* Informações da Página */}
            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-[11px] text-stone-500 space-y-1">
              <div>
                Total de Seções:{' '}
                <span className="font-bold text-stone-800">
                  {page.sections.length}
                </span>
              </div>
              <div>
                Total de Blocos:{' '}
                <span className="font-bold text-stone-800">
                  {page.sections.reduce((acc, s) => acc + s.blocks.length, 0)}
                </span>
              </div>
              <div>
                Última Atualização:{' '}
                <span className="font-semibold text-stone-700">
                  {page.updatedAt || 'Hoje'}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
