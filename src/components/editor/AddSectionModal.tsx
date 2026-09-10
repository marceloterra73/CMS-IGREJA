import React, { useState } from 'react';
import { X, Layers, Plus, Sparkles, LayoutGrid, Check } from 'lucide-react';
import { BlockType } from '../../types';

export type SectionPresetType = 'empty' | 'hero' | 'content_pair';

interface AddSectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddSection: (sectionData: {
    title: string;
    preset: SectionPresetType;
    initialBlockTypes?: BlockType[];
  }) => void;
}

export const AddSectionModal: React.FC<AddSectionModalProps> = ({
  isOpen,
  onClose,
  onAddSection,
}) => {
  if (!isOpen) return null;

  const [title, setTitle] = useState('');
  const [selectedPreset, setSelectedPreset] = useState<SectionPresetType>('empty');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalTitle = title.trim() || (
      selectedPreset === 'empty'
        ? 'Nova Seção'
        : selectedPreset === 'hero'
        ? 'Destaque Principal'
        : 'Sobre & Horários'
    );

    let initialBlockTypes: BlockType[] | undefined;
    if (selectedPreset === 'hero') {
      initialBlockTypes = ['hero'];
    } else if (selectedPreset === 'content_pair') {
      initialBlockTypes = ['about', 'schedule'];
    }

    onAddSection({
      title: finalTitle,
      preset: selectedPreset,
      initialBlockTypes,
    });
    setTitle('');
    setSelectedPreset('empty');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl border border-stone-200 w-full max-w-lg overflow-hidden flex flex-col">
        {/* Header do Modal */}
        <div className="px-6 py-4 border-b border-stone-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-stone-900">Adicionar Seção</h2>
              <p className="text-xs text-stone-500">
                Selecione o tipo de estrutura para a nova seção
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-stone-100 text-stone-400 hover:text-stone-700 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Título da Seção */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1.5">
              Título da Seção
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Nossos Cultos, Ministérios, Acolhimento..."
              className="w-full text-xs px-3 py-2 rounded-lg border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-stone-800"
              autoFocus
            />
          </div>

          {/* Opções de Composição Inicial */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-2">
              Composição Inicial
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Vazia */}
              <button
                type="button"
                onClick={() => setSelectedPreset('empty')}
                className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all ${
                  selectedPreset === 'empty'
                    ? 'border-amber-500 bg-amber-50/50 ring-2 ring-amber-500/20'
                    : 'border-stone-200 hover:border-stone-300 hover:bg-stone-50/60'
                }`}
              >
                <div>
                  <div className="w-6 h-6 rounded-md bg-stone-100 flex items-center justify-center text-stone-600 mb-2">
                    <Plus className="w-3.5 h-3.5" />
                  </div>
                  <h4 className="text-xs font-bold text-stone-800">Seção Vazia</h4>
                  <p className="text-[11px] text-stone-500 mt-0.5">
                    Começar sem blocos e adicionar depois.
                  </p>
                </div>
                {selectedPreset === 'empty' && (
                  <div className="mt-2 flex items-center gap-1 text-[11px] font-semibold text-amber-700">
                    <Check className="w-3 h-3" /> Selecionado
                  </div>
                )}
              </button>

              {/* 1 Bloco (Destaque) */}
              <button
                type="button"
                onClick={() => setSelectedPreset('hero')}
                className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all ${
                  selectedPreset === 'hero'
                    ? 'border-amber-500 bg-amber-50/50 ring-2 ring-amber-500/20'
                    : 'border-stone-200 hover:border-stone-300 hover:bg-stone-50/60'
                }`}
              >
                <div>
                  <div className="w-6 h-6 rounded-md bg-amber-100 flex items-center justify-center text-amber-700 mb-2">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                  <h4 className="text-xs font-bold text-stone-800">1 Bloco</h4>
                  <p className="text-[11px] text-stone-500 mt-0.5">
                    Inicializar com um bloco de Destaque (Hero).
                  </p>
                </div>
                {selectedPreset === 'hero' && (
                  <div className="mt-2 flex items-center gap-1 text-[11px] font-semibold text-amber-700">
                    <Check className="w-3 h-3" /> Selecionado
                  </div>
                )}
              </button>

              {/* 2 Blocos (Par) */}
              <button
                type="button"
                onClick={() => setSelectedPreset('content_pair')}
                className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all ${
                  selectedPreset === 'content_pair'
                    ? 'border-amber-500 bg-amber-50/50 ring-2 ring-amber-500/20'
                    : 'border-stone-200 hover:border-stone-300 hover:bg-stone-50/60'
                }`}
              >
                <div>
                  <div className="w-6 h-6 rounded-md bg-stone-100 flex items-center justify-center text-stone-700 mb-2">
                    <LayoutGrid className="w-3.5 h-3.5" />
                  </div>
                  <h4 className="text-xs font-bold text-stone-800">2 Blocos</h4>
                  <p className="text-[11px] text-stone-500 mt-0.5">
                    Inicializar com Sobre + Horários de Culto.
                  </p>
                </div>
                {selectedPreset === 'content_pair' && (
                  <div className="mt-2 flex items-center gap-1 text-[11px] font-semibold text-amber-700">
                    <Check className="w-3 h-3" /> Selecionado
                  </div>
                )}
              </button>
            </div>
          </div>

          {/* Ações */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-stone-100">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 text-xs font-semibold text-stone-600 hover:text-stone-800 hover:bg-stone-100 rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-lg transition-colors shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              Adicionar Seção
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
