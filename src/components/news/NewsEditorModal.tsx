import React, { useState, useEffect } from 'react';
import {
  X,
  Save,
  Newspaper,
  Calendar,
  User,
  Image as ImageIcon,
  AlertCircle,
  Clock,
} from 'lucide-react';
import { ChurchNews, NewsStatus, MediaItem } from '../../types';
import { generateNewsSlug, ensureUniqueNewsSlug, estimateReadingTime } from './newsUtils';
import { MediaPickerModal } from '../media/MediaPickerModal';
import { INITIAL_DEMO_MEDIA } from '../media/demoMediaData';

interface NewsEditorModalProps {
  news: ChurchNews | null; // null = nova notícia
  isOpen: boolean;
  onClose: () => void;
  onSave: (news: ChurchNews) => void;
  existingNews: ChurchNews[];
}

export const NewsEditorModal: React.FC<NewsEditorModalProps> = ({
  news,
  isOpen,
  onClose,
  onSave,
  existingNews,
}) => {
  const isEditing = Boolean(news);

  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [isSlugManual, setIsSlugManual] = useState(false);
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('');
  const [publishedAt, setPublishedAt] = useState('');
  const [status, setStatus] = useState<NewsStatus>('draft');
  const [imageMediaId, setImageMediaId] = useState<string | undefined>(undefined);

  // Controle do seletor de mídia
  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Inicialização do formulário
  useEffect(() => {
    if (isOpen) {
      if (news) {
        setTitle(news.title);
        setSlug(news.slug);
        setIsSlugManual(true);
        setSummary(news.summary || '');
        setContent(news.content);
        setAuthor(news.author || '');
        setPublishedAt(news.publishedAt ? news.publishedAt.split('T')[0] : '');
        setStatus(news.status);
        setImageMediaId(news.imageMediaId);
      } else {
        // Nova notícia
        setTitle('');
        setSlug('');
        setIsSlugManual(false);
        setSummary('');
        setContent('');
        setAuthor('Equipe Pastoral IBC');
        const todayStr = new Date().toISOString().split('T')[0];
        setPublishedAt(todayStr);
        setStatus('draft');
        setImageMediaId('med_02'); // capa padrão demonstrativa
      }
      setErrorMsg(null);
    }
  }, [isOpen, news]);

  if (!isOpen) return null;

  // Imagem selecionada para prévia
  const selectedMedia = imageMediaId
    ? INITIAL_DEMO_MEDIA.find((m) => m.id === imageMediaId)
    : null;

  const readingTime = estimateReadingTime(content);

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!isSlugManual) {
      const generated = generateNewsSlug(val);
      setSlug(generated);
    }
  };

  const handleSlugChange = (val: string) => {
    setIsSlugManual(true);
    setSlug(generateNewsSlug(val));
  };

  const handleSave = () => {
    if (!title.trim()) {
      setErrorMsg('Por favor, informe o título da notícia.');
      return;
    }

    if (!content.trim()) {
      setErrorMsg('Por favor, informe o conteúdo da notícia.');
      return;
    }

    const finalSlug = ensureUniqueNewsSlug(
      slug.trim() || generateNewsSlug(title),
      existingNews,
      news?.id
    );

    const savedNews: ChurchNews = {
      id: news?.id || `news_${Date.now()}`,
      tenantId: news?.tenantId || 'ib_central',
      title: title.trim(),
      slug: finalSlug,
      summary: summary.trim() || undefined,
      content: content.trim(),
      imageMediaId: imageMediaId || undefined,
      author: author.trim() || undefined,
      publishedAt: publishedAt ? `${publishedAt}T10:00:00Z` : undefined,
      status,
      createdAt: news?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onSave(savedNews);
    onClose();
  };

  return (
    <>
      <div
        id="modal-news-editor-backdrop"
        className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
        onClick={onClose}
      >
        <div
          id="modal-news-editor-content"
          className="bg-white rounded-2xl max-w-3xl w-full shadow-2xl border border-stone-200 my-6 overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-150"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Cabeçalho */}
          <div className="bg-stone-50 px-6 py-4 border-b border-stone-200 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-stone-900 text-white flex items-center justify-center">
                <Newspaper className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-stone-900">
                  {isEditing ? `Editar: ${news?.title}` : 'Nova Notícia'}
                </h3>
                <p className="text-xs text-stone-500">
                  {isEditing
                    ? 'Atualize o texto, autoria e informações do artigo.'
                    : 'Publique comunicados ou notícias oficiais da igreja.'}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="text-stone-400 hover:text-stone-600 p-1.5 rounded-lg hover:bg-stone-200/50 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Erro de Validação */}
          {errorMsg && (
            <div className="bg-rose-50 border-b border-rose-200 px-6 py-2.5 flex items-center gap-2 text-rose-700 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Formulário */}
          <div className="p-6 overflow-y-auto space-y-4 flex-1">
            {/* Título da Notícia */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Título da Notícia *
              </label>
              <input
                id="news-title-input"
                type="text"
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="Ex: Campanha do Quilo arrecada mais de 2 toneladas de alimentos"
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm text-stone-900 focus:bg-white focus:ring-2 focus:ring-stone-400 focus:outline-hidden"
              />
            </div>

            {/* Slug */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Slug (identificador amigável na URL) *
              </label>
              <div className="flex items-center">
                <span className="px-3 py-2.5 bg-stone-100 border border-r-0 border-stone-200 rounded-l-xl text-xs font-mono text-stone-500">
                  /noticias/
                </span>
                <input
                  id="news-slug-input"
                  type="text"
                  value={slug}
                  onChange={(e) => handleSlugChange(e.target.value)}
                  placeholder="campanha-do-quilo-arrecadacao"
                  className="flex-1 px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-r-xl text-sm font-mono text-stone-900 focus:bg-white focus:ring-2 focus:ring-stone-400 focus:outline-hidden"
                />
              </div>
              <span className="text-[11px] text-stone-400 mt-1 block">
                Normalizado automaticamente com validação de unicidade local.
              </span>
            </div>

            {/* Resumo */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Resumo / Subtítulo (opcional)
              </label>
              <textarea
                rows={2}
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                placeholder="Breve resumo informativo exibido nos cards e na chamada da notícia..."
                className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm text-stone-900 focus:bg-white focus:ring-2 focus:ring-stone-400 focus:outline-hidden resize-y"
              />
            </div>

            {/* Conteúdo da Notícia (Texto Seguro, sem HTML) */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-stone-700">
                  Conteúdo da Notícia *
                </label>
                <span className="text-[11px] text-stone-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {readingTime}
                </span>
              </div>
              <textarea
                id="news-content-input"
                rows={8}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Escreva o texto completo da notícia. Utilize quebras de linha para organizar parágrafos de forma clara e legível..."
                className="w-full px-3.5 py-3 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm text-stone-900 focus:bg-white focus:ring-2 focus:ring-stone-400 focus:outline-hidden font-sans leading-relaxed resize-y"
              />
              <span className="text-[11px] text-stone-400 mt-1 block">
                Texto puro e seguro: quebras de linha viram parágrafos naturais no preview sem interpretação de código HTML arbitrário.
              </span>
            </div>

            {/* Metadados: Autor, Data e Status */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Autor / Ministério
                </label>
                <div className="relative">
                  <User className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    placeholder="Ex: Pastor Paulo Roberto"
                    className="w-full pl-8 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm text-stone-900 focus:bg-white focus:ring-2 focus:ring-stone-400 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Data de Publicação
                </label>
                <div className="relative">
                  <Calendar className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="date"
                    value={publishedAt}
                    onChange={(e) => setPublishedAt(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:bg-white focus:ring-2 focus:ring-stone-400 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Status *
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as NewsStatus)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm text-stone-900 focus:bg-white focus:ring-2 focus:ring-stone-400 focus:outline-hidden cursor-pointer"
                >
                  <option value="draft">Rascunho (em elaboração)</option>
                  <option value="published">Publicada (visível no site)</option>
                  <option value="archived">Arquivada (histórico)</option>
                </select>
              </div>
            </div>

            {/* Imagem de Capa (integração com imageMediaId) */}
            <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-stone-900 block">
                    Imagem de Capa (imageMediaId)
                  </span>
                  <span className="text-[11px] text-stone-500">
                    Selecione um arquivo da biblioteca de mídia da igreja.
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setIsMediaPickerOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-stone-300 rounded-lg text-xs font-medium text-stone-700 hover:bg-stone-100 transition-colors shadow-2xs cursor-pointer"
                >
                  <ImageIcon className="w-3.5 h-3.5" />
                  <span>{imageMediaId ? 'Trocar imagem' : 'Selecionar imagem'}</span>
                </button>
              </div>

              {selectedMedia ? (
                <div className="flex items-center gap-3 bg-white p-2.5 rounded-xl border border-stone-200">
                  <img
                    src={selectedMedia.url}
                    alt={selectedMedia.title || 'Imagem da notícia'}
                    className="w-16 h-12 object-cover rounded-lg border border-stone-200 shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <span className="text-xs font-bold text-stone-900 block truncate">
                      {selectedMedia.title || selectedMedia.filename}
                    </span>
                    <span className="text-[11px] font-mono text-stone-400 block truncate">
                      ID: {selectedMedia.id}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setImageMediaId(undefined)}
                    className="text-xs text-rose-600 hover:text-rose-800 font-medium px-2 py-1 rounded hover:bg-rose-50 cursor-pointer"
                  >
                    Remover
                  </button>
                </div>
              ) : (
                <div className="p-3 text-center border border-dashed border-stone-200 rounded-lg text-stone-400 text-xs">
                  Nenhuma imagem selecionada. A notícia utilizará o visual textual padrão.
                </div>
              )}
            </div>
          </div>

          {/* Rodapé de Ações */}
          <div className="bg-stone-50 px-6 py-4 border-t border-stone-200 flex items-center justify-between shrink-0">
            <span className="text-xs text-stone-500 hidden sm:inline">
              Gerenciado em memória durante esta sessão
            </span>

            <div className="flex items-center gap-3 ml-auto">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs sm:text-sm font-medium text-stone-700 hover:bg-stone-200 rounded-xl transition-colors cursor-pointer"
              >
                Cancelar
              </button>

              <button
                id="btn-save-news"
                type="button"
                onClick={handleSave}
                className="inline-flex items-center gap-2 px-5 py-2 bg-stone-900 text-white rounded-xl text-xs sm:text-sm font-semibold hover:bg-stone-800 transition-colors shadow-xs cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>{isEditing ? 'Salvar Alterações' : 'Criar Notícia'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Seleção de Mídia existente */}
      <MediaPickerModal
        isOpen={isMediaPickerOpen}
        onClose={() => setIsMediaPickerOpen(false)}
        selectedMediaId={imageMediaId}
        onSelectImage={(media: MediaItem) => {
          setImageMediaId(media.id);
          setIsMediaPickerOpen(false);
        }}
      />
    </>
  );
};
