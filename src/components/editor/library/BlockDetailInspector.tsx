import React from 'react';
import { BlockDefinition, SectionInstance, SectionId } from '../../../types';
import { getBlockIcon } from '../blockIcons';
import { BlockPreviewWireframe } from './BlockPreviewWireframe';
import { Plus, Check, Layers, FileText, ArrowLeft } from 'lucide-react';

interface BlockDetailInspectorProps {
  block: BlockDefinition | null;
  sections: SectionInstance[];
  selectedSectionId: SectionId | null;
  onSelectSectionId: (id: SectionId) => void;
  onAddBlock: (block: BlockDefinition, sectionId: SectionId) => void;
  onCloseDetail?: () => void;
}

const CATEGORY_LABELS: Record<string, string> = {
  church_specific: 'Igreja / Eclesiástico',
  content: 'Conteúdo Institucional',
  hero: 'Destaque Principal',
  navigation: 'Navegação e Menus',
  footer: 'Rodapé Oficial',
};

export const BlockDetailInspector: React.FC<BlockDetailInspectorProps> = ({
  block,
  sections,
  selectedSectionId,
  onSelectSectionId,
  onAddBlock,
  onCloseDetail,
}) => {
  if (!block) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-6 text-center text-stone-400 bg-stone-50/50">
        <div className="w-12 h-12 rounded-xl bg-stone-100 flex items-center justify-center text-stone-300 mb-3">
          <Layers className="w-6 h-6" />
        </div>
        <h4 className="text-xs font-bold text-stone-700 mb-1">
          Nenhum bloco selecionado
        </h4>
        <p className="text-[11px] text-stone-500 max-w-xs leading-relaxed">
          Selecione qualquer card de bloco à esquerda para inspecionar a prévia visual, campos estruturados e opções de inserção.
        </p>
      </div>
    );
  }

  const activeSection = sections.find((s) => s.id === selectedSectionId) || sections[0] || null;

  return (
    <div
      id={`block-detail-inspector-${block.type}`}
      className="h-full flex flex-col justify-between bg-white border-l border-stone-200 overflow-y-auto p-4 sm:p-5 select-none scrollbar-thin"
    >
      <div className="space-y-4">
        {/* Topo / Voltar no Mobile */}
        {onCloseDetail && (
          <button
            type="button"
            onClick={onCloseDetail}
            className="sm:hidden inline-flex items-center gap-1.5 text-xs font-semibold text-stone-600 hover:text-stone-900 mb-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Voltar para a biblioteca</span>
          </button>
        )}

        {/* Cabeçalho do Bloco */}
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-2xs">
            {getBlockIcon(block.type, 'w-5 h-5')}
          </div>
          <div className="min-w-0 flex-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 inline-block mb-1">
              {CATEGORY_LABELS[block.category] || block.category}
            </span>
            <h3 className="text-sm font-bold text-stone-900 leading-tight">
              {block.name}
            </h3>
            <p className="text-[11px] text-stone-500 font-mono mt-0.5">
              Tipo canônico: <span className="text-stone-700">{block.type}</span>
            </p>
          </div>
        </div>

        {/* Prévia Conceitual do Layout */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-stone-700 uppercase tracking-wider">
            Representação Visual do Bloco
          </label>
          <div className="rounded-xl border border-stone-200 overflow-hidden shadow-2xs bg-stone-50">
            <BlockPreviewWireframe type={block.type} className="w-full h-32" />
          </div>
        </div>

        {/* Descrição Detalhada */}
        <div className="space-y-1 bg-stone-50 p-3 rounded-xl border border-stone-200/80">
          <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">
            Finalidade Pastoral & Eclesiástica
          </span>
          <p className="text-xs text-stone-700 leading-relaxed">
            {block.description}
          </p>
        </div>

        {/* Campos Editáveis Estruturados do Schema */}
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 text-stone-800">
            <FileText className="w-3.5 h-3.5 text-amber-600" />
            <h4 className="text-xs font-bold uppercase tracking-wider">
              Campos Editáveis do Bloco
            </h4>
          </div>

          {block.dataSchema?.fields && block.dataSchema.fields.length > 0 ? (
            <div className="space-y-1.5 max-h-40 overflow-y-auto scrollbar-thin pr-1">
              {block.dataSchema.fields.map((field) => (
                <div
                  key={field.id}
                  className="flex items-center justify-between text-xs p-2 rounded-lg bg-stone-50 border border-stone-200"
                >
                  <span className="font-semibold text-stone-800 truncate max-w-[160px]">
                    {field.label}
                  </span>
                  <span className="text-[10px] font-mono text-stone-500 bg-white px-1.5 py-0.5 rounded border border-stone-200 uppercase">
                    {field.type}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-3 bg-stone-50 rounded-lg border border-stone-200 text-stone-600 text-[11px] leading-relaxed">
              Módulo com estrutura temática inteligente. Todos os dados como títulos, textos, links e horários podem ser editados pelo painel de propriedades.
            </div>
          )}
        </div>

        {/* Destino da Inserção (Seção de Destino) */}
        <div className="space-y-1.5 pt-2 border-t border-stone-100">
          <label className="text-[11px] font-bold text-stone-700 uppercase tracking-wider flex items-center justify-between">
            <span>Seção de Destino</span>
            <span className="text-stone-500 font-normal text-[10px]">
              {sections.length} seções na página
            </span>
          </label>

          {sections.length > 0 ? (
            <select
              value={activeSection?.id || ''}
              onChange={(e) => onSelectSectionId(e.target.value)}
              className="w-full text-xs px-3 py-2 rounded-xl border border-stone-200 bg-white font-medium text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              {sections.map((s, idx) => (
                <option key={s.id} value={s.id}>
                  {idx + 1}. {s.title || `Seção ${idx + 1}`} ({s.blocks.length} blocos)
                </option>
              ))}
            </select>
          ) : (
            <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-lg text-[11px] text-amber-800">
              A página não possui seções. Uma nova seção será criada automaticamente ao inserir este bloco.
            </div>
          )}
        </div>
      </div>

      {/* Ação Primária no Rodapé */}
      <div className="pt-4 border-t border-stone-200 space-y-2">
        <button
          type="button"
          id={`btn-confirm-add-block-${block.type}`}
          onClick={() => {
            if (activeSection) {
              onAddBlock(block, activeSection.id);
            }
          }}
          disabled={!activeSection && sections.length > 0}
          className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 disabled:bg-stone-300 text-white font-bold text-xs shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Adicionar Este Bloco à Seção</span>
        </button>

        <p className="text-[10px] text-stone-400 text-center">
          O bloco será posicionado ao final da seção e selecionado automaticamente.
        </p>
      </div>
    </div>
  );
};
