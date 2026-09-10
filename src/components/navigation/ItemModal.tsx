import React, { useState, useEffect } from 'react';
import { X, Plus, Check, ExternalLink, FileText, AlertCircle } from 'lucide-react';
import { NavigationItem, Page, NavigationTargetType } from '../../types';

interface ItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (itemData: {
    label: string;
    targetType: NavigationTargetType;
    pageId?: string;
    url?: string;
    openInNewTab?: boolean;
    parentId?: string;
    isVisible: boolean;
  }) => void;
  availablePages: Page[];
  parentCandidates: NavigationItem[];
  editingItem?: NavigationItem | null;
  defaultParentId?: string;
}

export const ItemModal: React.FC<ItemModalProps> = ({
  isOpen,
  onClose,
  onSave,
  availablePages,
  parentCandidates,
  editingItem,
  defaultParentId,
}) => {
  if (!isOpen) return null;

  const isEditing = !!editingItem;

  const [label, setLabel] = useState('');
  const [targetType, setTargetType] = useState<NavigationTargetType>('page');
  const [selectedPageId, setSelectedPageId] = useState<string>('');
  const [externalUrl, setExternalUrl] = useState('');
  const [openInNewTab, setOpenInNewTab] = useState(false);
  const [parentId, setParentId] = useState<string>('');
  const [isVisible, setIsVisible] = useState(true);
  const [urlError, setUrlError] = useState<string | null>(null);

  // Inicializa o formulário com dados de edição ou defaults
  useEffect(() => {
    if (editingItem) {
      setLabel(editingItem.label);
      setIsVisible(editingItem.isVisible);
      setParentId(editingItem.parentId || '');

      const tType = editingItem.target?.type || (editingItem.isExternal ? 'external' : 'page');
      setTargetType(tType);

      if (tType === 'page') {
        const pId = editingItem.target?.type === 'page' ? editingItem.target.pageId : '';
        setSelectedPageId(pId || availablePages[0]?.id || '');
        setOpenInNewTab(!!editingItem.target?.openInNewTab);
      } else {
        const u = editingItem.target?.type === 'external' ? editingItem.target.url : editingItem.url || '';
        setExternalUrl(u);
        setOpenInNewTab(!!(editingItem.target?.openInNewTab ?? editingItem.openInNewTab));
      }
    } else {
      setLabel('');
      setTargetType('page');
      setSelectedPageId(availablePages[0]?.id || '');
      setExternalUrl('https://');
      setOpenInNewTab(false);
      setParentId(defaultParentId || '');
      setIsVisible(true);
      setUrlError(null);
    }
  }, [editingItem, defaultParentId, availablePages]);

  // Se o usuário selecionar uma página e o label estiver vazio, preenche automaticamente
  const handlePageSelectChange = (pId: string) => {
    setSelectedPageId(pId);
    if (!label.trim()) {
      const pageFound = availablePages.find((p) => p.id === pId);
      if (pageFound) {
        setLabel(pageFound.title);
      }
    }
  };

  const validateUrl = (url: string): boolean => {
    const trimmed = url.trim().toLowerCase();
    if (!trimmed) {
      setUrlError('A URL é obrigatória para links externos.');
      return false;
    }

    // Proteção estrita contra protocolos maliciosos
    if (
      trimmed.startsWith('javascript:') ||
      trimmed.startsWith('data:') ||
      trimmed.startsWith('vbscript:') ||
      trimmed.startsWith('file:')
    ) {
      setUrlError('Protocolo de URL inseguro não permitido.');
      return false;
    }

    // Validação de formato seguro
    if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://') && !trimmed.startsWith('mailto:') && !trimmed.startsWith('tel:')) {
      setUrlError('Informe uma URL válida com https:// ou http://');
      return false;
    }

    setUrlError(null);
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!label.trim()) return;

    if (targetType === 'external') {
      if (!validateUrl(externalUrl)) {
        return;
      }
    }

    onSave({
      label: label.trim(),
      targetType,
      pageId: targetType === 'page' ? selectedPageId : undefined,
      url: targetType === 'external' ? externalUrl.trim() : undefined,
      openInNewTab,
      parentId: parentId || undefined,
      isVisible,
    });

    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl border border-stone-200 w-full max-w-lg overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header do Modal */}
        <div className="p-5 border-b border-stone-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700">
              {targetType === 'page' ? (
                <FileText className="w-4 h-4" />
              ) : (
                <ExternalLink className="w-4 h-4" />
              )}
            </div>
            <div>
              <h3 className="text-sm font-bold text-stone-900">
                {isEditing ? 'Editar Item de Navegação' : 'Adicionar Item de Navegação'}
              </h3>
              <p className="text-xs text-stone-500">
                {isEditing
                  ? 'Atualize as configurações e destino do item'
                  : 'Defina o texto, destino e nível hierárquico do item'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Tipo de Destino (Radio visual) */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1.5">
              Tipo de Destino
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  setTargetType('page');
                  setUrlError(null);
                }}
                className={`py-2 px-3 rounded-lg border text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                  targetType === 'page'
                    ? 'border-amber-500 bg-amber-50/50 text-amber-900 ring-2 ring-amber-500/20'
                    : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Página do Site</span>
              </button>

              <button
                type="button"
                onClick={() => setTargetType('external')}
                className={`py-2 px-3 rounded-lg border text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                  targetType === 'external'
                    ? 'border-amber-500 bg-amber-50/50 text-amber-900 ring-2 ring-amber-500/20'
                    : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                }`}
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Link Externo</span>
              </button>
            </div>
          </div>

          {/* Nome do Item (Label) */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Nome de Exibição (Label)
            </label>
            <input
              type="text"
              required
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="Ex: Início, Quem Somos, Cultos..."
              className="w-full text-xs px-3 py-2 rounded-lg border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500 text-stone-800"
              autoFocus={!isEditing}
            />
          </div>

          {/* Destino: Página Interna */}
          {targetType === 'page' && (
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Página Interna do CMS
              </label>
              <select
                value={selectedPageId}
                onChange={(e) => handlePageSelectChange(e.target.value)}
                className="w-full text-xs px-3 py-2 rounded-lg border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500 text-stone-800 bg-white"
              >
                {availablePages.map((page) => (
                  <option key={page.id} value={page.id}>
                    {page.title} ({page.slug}) {page.isHome ? '★ Início' : ''}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Destino: Link Externo */}
          {targetType === 'external' && (
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-stone-700">
                Endereço URL Externo
              </label>
              <input
                type="text"
                required
                value={externalUrl}
                onChange={(e) => {
                  setExternalUrl(e.target.value);
                  if (urlError) validateUrl(e.target.value);
                }}
                placeholder="https://exemplo.com.br"
                className={`w-full text-xs px-3 py-2 rounded-lg border text-stone-800 focus:outline-none focus:ring-2 ${
                  urlError
                    ? 'border-red-300 focus:ring-red-400 bg-red-50/20'
                    : 'border-stone-200 focus:ring-amber-500'
                }`}
              />
              {urlError && (
                <div className="flex items-center gap-1.5 text-[11px] text-red-600 font-medium">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{urlError}</span>
                </div>
              )}
            </div>
          )}

          {/* Hierarquia Pai/Filho */}
          {parentCandidates.length > 0 && (
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Hierarquia / Nível
              </label>
              <select
                value={parentId}
                onChange={(e) => setParentId(e.target.value)}
                className="w-full text-xs px-3 py-2 rounded-lg border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500 text-stone-800 bg-white"
              >
                <option value="">Item Principal (Nível 1)</option>
                {parentCandidates.map((candidate) => (
                  <option key={candidate.id} value={candidate.id}>
                    ↳ Sub-item de: {candidate.label}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Opções Adicionais: Nova Aba e Visibilidade */}
          <div className="pt-2 border-t border-stone-100 space-y-2">
            {targetType === 'external' && (
              <label className="flex items-center gap-2 text-xs text-stone-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={openInNewTab}
                  onChange={(e) => setOpenInNewTab(e.target.checked)}
                  className="rounded border-stone-300 text-amber-600 focus:ring-amber-500"
                />
                <span>Abrir link em nova aba (`_blank`)</span>
              </label>
            )}

            <label className="flex items-center gap-2 text-xs text-stone-700 cursor-pointer">
              <input
                type="checkbox"
                checked={isVisible}
                onChange={(e) => setIsVisible(e.target.checked)}
                className="rounded border-stone-300 text-amber-600 focus:ring-amber-500"
              />
              <span>Item visível no menu</span>
            </label>
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
              <Check className="w-3.5 h-3.5" />
              <span>{isEditing ? 'Salvar Alterações' : 'Adicionar Item'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
