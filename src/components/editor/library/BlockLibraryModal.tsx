import React, { useState, useMemo } from 'react';
import {
  X,
  Search,
  Box,
  Layers,
  Sparkles,
  Filter,
  CheckCircle2,
  SlidersHorizontal,
} from 'lucide-react';
import {
  BlockType,
  BlockDefinition,
  SectionInstance,
  SectionId,
} from '../../../types';
import { BLOCK_CATALOG } from '../../../constants';
import { BlockCard } from './BlockCard';
import { BlockDetailInspector } from './BlockDetailInspector';

export interface BlockLibraryModalProps {
  isOpen: boolean;
  sections?: SectionInstance[];
  defaultSectionId?: SectionId | null;
  sectionTitle?: string;
  onClose: () => void;
  onSelectBlockType: (type: BlockType, targetSectionId?: SectionId) => void;
}

interface CategoryFilterTab {
  key: string;
  label: string;
}

const CATEGORY_TABS: CategoryFilterTab[] = [
  { key: 'all', label: 'Todos os Blocos' },
  { key: 'church_specific', label: 'Igreja' },
  { key: 'content', label: 'Conteúdo' },
  { key: 'hero', label: 'Destaque' },
  { key: 'navigation', label: 'Navegação' },
  { key: 'footer', label: 'Rodapé' },
];

export const BlockLibraryModal: React.FC<BlockLibraryModalProps> = ({
  isOpen,
  sections = [],
  defaultSectionId = null,
  sectionTitle,
  onClose,
  onSelectBlockType,
}) => {
  if (!isOpen) return null;

  // Estados locais da Biblioteca
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedBlockType, setSelectedBlockType] = useState<BlockType | null>('hero');
  const [targetSectionId, setTargetSectionId] = useState<SectionId | null>(
    defaultSectionId || (sections[0]?.id ?? null)
  );

  // Visibilidade do painel de detalhes no mobile
  const [isMobileDetailOpen, setIsMobileDetailOpen] = useState(false);

  // Fonte única da verdade: BLOCK_CATALOG
  const allBlocks = useMemo(() => {
    return Object.values(BLOCK_CATALOG);
  }, []);

  // Contadores dinâmicos por categoria baseados diretamente em BLOCK_CATALOG
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: allBlocks.length };
    for (const b of allBlocks) {
      counts[b.category] = (counts[b.category] || 0) + 1;
    }
    return counts;
  }, [allBlocks]);

  // Filtragem combinada por categoria e pesquisa
  const filteredBlocks = useMemo(() => {
    const term = search.trim().toLowerCase();
    return allBlocks.filter((block) => {
      const matchesCategory =
        activeCategory === 'all' || block.category === activeCategory;
      const matchesSearch =
        term === '' ||
        block.name.toLowerCase().includes(term) ||
        block.description.toLowerCase().includes(term) ||
        block.type.toLowerCase().includes(term);
      return matchesCategory && matchesSearch;
    });
  }, [allBlocks, activeCategory, search]);

  // Bloco selecionado para inspeção
  const currentInspectBlock = useMemo(() => {
    if (!selectedBlockType) return allBlocks[0] || null;
    return BLOCK_CATALOG[selectedBlockType] || allBlocks[0] || null;
  }, [selectedBlockType, allBlocks]);

  // Inserção do bloco
  const handleAddBlock = (block: BlockDefinition, destinationSectionId?: SectionId) => {
    const finalSectionId =
      destinationSectionId || targetSectionId || defaultSectionId || sections[0]?.id;
    onSelectBlockType(block.type, finalSectionId);
    onClose();
  };

  const handleClearFilters = () => {
    setSearch('');
    setActiveCategory('all');
  };

  // Nome da seção de destino
  const resolvedSectionTitle =
    sectionTitle ||
    sections.find((s) => s.id === targetSectionId)?.title ||
    (sections.length > 0 ? sections[0]?.title : 'Seção Principal');

  return (
    <div
      id="block-library-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-150"
    >
      <div
        id="block-library-modal-container"
        className="bg-white rounded-2xl shadow-2xl border border-stone-200 w-full max-w-5xl h-[92vh] max-h-[820px] flex flex-col overflow-hidden select-none"
      >
        {/* 1. Header da Biblioteca */}
        <div className="px-5 py-3.5 border-b border-stone-200 flex items-center justify-between bg-stone-50/70 shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 shrink-0">
              <Box className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-stone-900 truncate">
                  Biblioteca Visual de Blocos
                </h2>
                <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-1.5 py-0.2 rounded uppercase">
                  15 Blocos Canônicos
                </span>
              </div>
              <p className="text-[11px] text-stone-500 truncate">
                Destino atual:{' '}
                <span className="font-semibold text-stone-800">
                  {resolvedSectionTitle}
                </span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-stone-200/70 text-stone-400 hover:text-stone-700 transition-colors"
              title="Fechar biblioteca"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 2. Barra de Busca e Filtros de Categoria */}
        <div className="p-4 border-b border-stone-100 space-y-3 bg-stone-50/40 shrink-0">
          {/* Campo de Busca em tempo real */}
          <div className="relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Pesquisar blocos por nome, finalidade pastoral ou tipo (ex: hero, cultos, eventos)..."
              className="w-full text-xs pl-9 pr-9 py-2.5 rounded-xl border border-stone-200 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-stone-900 placeholder:text-stone-400"
              autoFocus
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 p-0.5 rounded"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Filtros em Abas de Categoria */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 scrollbar-thin">
            {CATEGORY_TABS.map((tab) => {
              const count = categoryCounts[tab.key] || 0;
              const isActive = activeCategory === tab.key;
              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setActiveCategory(tab.key)}
                  className={`text-xs px-3 py-1.5 rounded-full whitespace-nowrap font-medium transition-all flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-amber-600 text-white shadow-xs'
                      : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                      isActive
                        ? 'bg-amber-700/80 text-white'
                        : 'bg-stone-100 text-stone-500'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. Corpo Principal: Grade de Blocos + Painel de Inspeção */}
        <div className="flex-1 flex overflow-hidden relative">
          {/* Coluna Esquerda: Grade de Cards */}
          <div
            className={`flex-1 overflow-y-auto p-4 sm:p-5 scrollbar-thin ${
              isMobileDetailOpen ? 'hidden md:block' : 'block'
            }`}
          >
            {filteredBlocks.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center py-16 text-center text-stone-400 px-4">
                <div className="w-12 h-12 rounded-2xl bg-stone-100 flex items-center justify-center text-stone-400 mb-3 border border-stone-200">
                  <Search className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-stone-700 mb-1">
                  Nenhum bloco encontrado
                </h3>
                <p className="text-xs text-stone-500 max-w-sm mb-4 leading-relaxed">
                  Não encontramos blocos correspondentes à sua busca ou filtro. Tente pesquisar por outro termo ou limpe os filtros.
                </p>
                <button
                  type="button"
                  onClick={handleClearFilters}
                  className="px-3.5 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg text-xs font-semibold transition-colors"
                >
                  Limpar filtros
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-3.5">
                {filteredBlocks.map((block) => {
                  const isSelected = selectedBlockType === block.type;
                  return (
                    <BlockCard
                      key={block.type}
                      block={block}
                      isSelected={isSelected}
                      onSelect={() => {
                        setSelectedBlockType(block.type);
                        setIsMobileDetailOpen(true);
                      }}
                      onAdd={() => handleAddBlock(block)}
                    />
                  );
                })}
              </div>
            )}
          </div>

          {/* Coluna Direita: Inspetor de Detalhes & Prévia */}
          <div
            className={`w-full md:w-84 lg:w-96 shrink-0 h-full ${
              isMobileDetailOpen
                ? 'flex absolute inset-0 z-20 md:static md:flex'
                : 'hidden md:flex'
            }`}
          >
            <BlockDetailInspector
              block={currentInspectBlock}
              sections={sections}
              selectedSectionId={targetSectionId}
              onSelectSectionId={setTargetSectionId}
              onAddBlock={handleAddBlock}
              onCloseDetail={() => setIsMobileDetailOpen(false)}
            />
          </div>
        </div>

        {/* 4. Rodapé Informativo */}
        <div className="px-5 py-2.5 border-t border-stone-200 bg-stone-50 text-[11px] text-stone-500 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-stone-700">
              {filteredBlocks.length} de {allBlocks.length} blocos canônicos
            </span>
            <span>•</span>
            <span className="hidden sm:inline">
              Clique em "Adicionar" para inserir na seção ativa
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-stone-600 hover:text-stone-900 font-semibold px-2 py-1 rounded hover:bg-stone-200/60 transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
