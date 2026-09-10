import React, { useState } from 'react';
import { X, FileText, Globe, Home, Sparkles, AlertCircle, Layers } from 'lucide-react';
import { Page, PageStatus } from '../../types';

interface NewPageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreatePage: (newPageData: {
    title: string;
    slug: string;
    isHome: boolean;
    templateType: string;
    metaDescription: string;
  }) => void;
  existingSlugs: string[];
}

export const NewPageModal: React.FC<NewPageModalProps> = ({
  isOpen,
  onClose,
  onCreatePage,
  existingSlugs,
}) => {
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('/');
  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(false);
  const [isHome, setIsHome] = useState(false);
  const [templateType, setTemplateType] = useState('standard');
  const [metaDescription, setMetaDescription] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  // Gerador automático de slug a partir do título
  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle);
    if (!isSlugManuallyEdited && !isHome) {
      const generatedSlug =
        '/' +
        newTitle
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-+|-+$/g, '');
      setSlug(generatedSlug === '/' ? '/' : generatedSlug);
    }
  };

  const handleSlugChange = (newSlug: string) => {
    setIsSlugManuallyEdited(true);
    // Assegura barra inicial
    const formatted = newSlug.startsWith('/') ? newSlug : '/' + newSlug;
    setSlug(formatted.toLowerCase().replace(/\s+/g, '-'));
  };

  const handleToggleHome = (checked: boolean) => {
    setIsHome(checked);
    if (checked) {
      setSlug('/');
    } else if (slug === '/') {
      setIsSlugManuallyEdited(false);
      handleTitleChange(title);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      setError('Por favor, informe o título da página.');
      return;
    }

    const trimmedSlug = slug.trim();
    if (!trimmedSlug || trimmedSlug === '') {
      setError('Por favor, defina o caminho/slug da página.');
      return;
    }

    if (!isHome && trimmedSlug === '/') {
      setError('O caminho "/" é reservado para a Página Inicial. Marque a opção "Definir como Página Inicial".');
      return;
    }

    // Verifica duplicação de slug caso não seja home
    if (!isHome && existingSlugs.includes(trimmedSlug)) {
      setError(`O caminho "${trimmedSlug}" já está em uso por outra página. Escolha um slug diferente.`);
      return;
    }

    onCreatePage({
      title: trimmedTitle,
      slug: isHome ? '/' : trimmedSlug,
      isHome,
      templateType,
      metaDescription: metaDescription.trim() || `Página ${trimmedTitle} da Igreja Batista Central.`,
    });

    // Reset local
    setTitle('');
    setSlug('/');
    setIsHome(false);
    setTemplateType('standard');
    setMetaDescription('');
    onClose();
  };

  return (
    <div
      id="new-page-modal-backdrop"
      className="fixed inset-0 bg-stone-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4 transition-all"
    >
      <div
        id="new-page-modal-card"
        className="bg-white w-full max-w-lg rounded-2xl shadow-xl border border-stone-200 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150"
      >
        {/* Header do Modal */}
        <div className="p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500 text-stone-950 flex items-center justify-center font-bold">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-stone-900">
                Criar Nova Página
              </h3>
              <p className="text-xs text-stone-500">
                Estruture uma nova rota pública para a sua congregação
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4.5 text-xs overflow-y-auto max-h-[75vh]">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2 text-red-700 text-xs">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Título da Página */}
          <div className="space-y-1.5">
            <label htmlFor="input-new-page-title" className="block font-semibold text-stone-900">
              Título da Página <span className="text-amber-700">*</span>
            </label>
            <input
              id="input-new-page-title"
              type="text"
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="Ex: Ministério Infantil, Galeria de Fotos, Nossa Visão..."
              className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-xs sm:text-sm"
              autoFocus
            />
          </div>

          {/* Slug / Rota Pública */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label htmlFor="input-new-page-slug" className="block font-semibold text-stone-900">
                Endereço / Slug (URL) <span className="text-amber-700">*</span>
              </label>
              <span className="text-[10px] text-stone-400">Exibido na barra de navegação</span>
            </div>
            <div className="relative flex items-center">
              <span className="absolute left-3 text-stone-400 text-xs font-mono select-none">
                ibcentral.com.br
              </span>
              <input
                id="input-new-page-slug"
                type="text"
                value={slug}
                disabled={isHome}
                onChange={(e) => handleSlugChange(e.target.value)}
                placeholder="/nova-pagina"
                className="w-full pl-36 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-stone-900 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 disabled:bg-stone-100 disabled:text-stone-500"
              />
            </div>
          </div>

          {/* Checkbox: Definir como Página Inicial */}
          <div className="p-3 bg-stone-50 rounded-lg border border-stone-200 flex items-start gap-3">
            <input
              id="check-set-home"
              type="checkbox"
              checked={isHome}
              onChange={(e) => handleToggleHome(e.target.checked)}
              className="mt-0.5 w-4 h-4 rounded border-stone-300 text-amber-600 focus:ring-amber-500/20 cursor-pointer"
            />
            <label htmlFor="check-set-home" className="cursor-pointer">
              <div className="font-semibold text-stone-900 flex items-center gap-1.5">
                <Home className="w-3.5 h-3.5 text-amber-600" />
                <span>Definir como Página Inicial (Home)</span>
              </div>
              <p className="text-[11px] text-stone-500 mt-0.5 leading-relaxed">
                Esta página se tornará a rota raiz principal do site ('/'). A página inicial atual deixará de ser a raiz.
              </p>
            </label>
          </div>

          {/* Template de Seções Iniciais */}
          <div className="space-y-1.5">
            <label className="block font-semibold text-stone-900">
              Estrutura de Seções Inicial
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setTemplateType('standard')}
                className={`p-2.5 rounded-lg border text-left transition-all ${
                  templateType === 'standard'
                    ? 'bg-amber-50 border-amber-300 text-amber-950 font-semibold'
                    : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50'
                }`}
              >
                <div className="text-xs font-semibold">Padrão</div>
                <div className="text-[10px] text-stone-500 mt-0.5">3 seções estruturadas</div>
              </button>

              <button
                type="button"
                onClick={() => setTemplateType('ministry')}
                className={`p-2.5 rounded-lg border text-left transition-all ${
                  templateType === 'ministry'
                    ? 'bg-amber-50 border-amber-300 text-amber-950 font-semibold'
                    : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50'
                }`}
              >
                <div className="text-xs font-semibold">Institucional</div>
                <div className="text-[10px] text-stone-500 mt-0.5">4 seções completas</div>
              </button>

              <button
                type="button"
                onClick={() => setTemplateType('blank')}
                className={`p-2.5 rounded-lg border text-left transition-all ${
                  templateType === 'blank'
                    ? 'bg-amber-50 border-amber-300 text-amber-950 font-semibold'
                    : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50'
                }`}
              >
                <div className="text-xs font-semibold">Em branco</div>
                <div className="text-[10px] text-stone-500 mt-0.5">1 seção inicial</div>
              </button>
            </div>
          </div>

          {/* Descrição SEO Básica */}
          <div className="space-y-1.5">
            <label htmlFor="input-new-page-seo" className="block font-semibold text-stone-900">
              Descrição para Motores de Busca (SEO Opcional)
            </label>
            <textarea
              id="input-new-page-seo"
              rows={2}
              value={metaDescription}
              onChange={(e) => setMetaDescription(e.target.value)}
              placeholder="Resumo que aparecerá no Google e nas redes sociais ao compartilhar o link..."
              className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-xs resize-none"
            />
          </div>

          {/* Botões do Rodapé */}
          <div className="pt-3 border-t border-stone-200 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg font-medium text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg font-semibold text-stone-950 bg-amber-500 hover:bg-amber-600 shadow-xs transition-colors"
            >
              Criar Página
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
