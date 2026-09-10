import React, { useState, useEffect } from 'react';
import {
  X,
  Image as ImageIcon,
  Video as VideoIcon,
  Music as AudioIcon,
  FileText as DocumentIcon,
  CheckCircle2,
  Calendar,
  HardDrive,
  Maximize2,
  Tag,
  Folder,
  ExternalLink,
  Save,
} from 'lucide-react';
import { MediaItem, MediaStatus } from '../../types';
import { formatFileSize, formatDimensions, getMediaTypeLabel } from './mediaUtils';

interface MediaDetailsModalProps {
  isOpen: boolean;
  media: MediaItem | null;
  onClose: () => void;
  onSave: (updatedMedia: MediaItem) => void;
}

export const MediaDetailsModal: React.FC<MediaDetailsModalProps> = ({
  isOpen,
  media,
  onClose,
  onSave,
}) => {
  const [title, setTitle] = useState('');
  const [altText, setAltText] = useState('');
  const [status, setStatus] = useState<MediaStatus>('active');

  useEffect(() => {
    if (media) {
      setTitle(media.title || '');
      setAltText(media.altText || '');
      setStatus(media.status || 'active');
    }
  }, [media]);

  if (!isOpen || !media) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: MediaItem = {
      ...media,
      title: title.trim(),
      altText: altText.trim(),
      status,
      updatedAt: new Date().toISOString(),
    };
    onSave(updated);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-stone-200 text-stone-800 animate-in zoom-in-95 duration-200 overflow-hidden my-auto">
        {/* Cabeçalho */}
        <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between bg-stone-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-100/70 border border-amber-200 flex items-center justify-center text-amber-800">
              {media.type === 'image' ? (
                <ImageIcon className="w-4 h-4" />
              ) : media.type === 'video' ? (
                <VideoIcon className="w-4 h-4" />
              ) : media.type === 'audio' ? (
                <AudioIcon className="w-4 h-4" />
              ) : (
                <DocumentIcon className="w-4 h-4" />
              )}
            </div>
            <div>
              <h3 className="text-sm font-bold text-stone-900 line-clamp-1">
                {media.title || media.filename}
              </h3>
              <span className="text-[11px] text-stone-500">
                {getMediaTypeLabel(media.type)} • {formatFileSize(media.sizeBytes)}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-stone-400 hover:text-stone-600 p-1 rounded-lg hover:bg-stone-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Conteúdo Principal com Preview e Formulário */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Lado Esquerdo: Área Visual de Preview */}
          <div className="md:col-span-7 flex flex-col gap-4">
            <div className="rounded-xl border border-stone-200 bg-stone-950/5 flex items-center justify-center overflow-hidden min-h-[260px] max-h-[380px] p-2 relative">
              {media.type === 'image' ? (
                <img
                  src={media.url}
                  alt={media.altText || media.title || 'Mídia da congregação'}
                  className="w-full h-full max-h-[360px] object-contain rounded-lg"
                />
              ) : media.type === 'video' ? (
                <div className="flex flex-col items-center justify-center text-center p-8">
                  <div className="w-16 h-16 rounded-2xl bg-amber-600 text-white flex items-center justify-center shadow-lg mb-3">
                    <VideoIcon className="w-8 h-8" />
                  </div>
                  <span className="text-xs font-bold text-stone-800">{media.filename}</span>
                  <span className="text-[11px] text-stone-500 mt-1">
                    Arquivo de vídeo pronto para transmissão ou reprodução
                  </span>
                </div>
              ) : media.type === 'audio' ? (
                <div className="flex flex-col items-center justify-center text-center p-8">
                  <div className="w-16 h-16 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-lg mb-3">
                    <AudioIcon className="w-8 h-8" />
                  </div>
                  <span className="text-xs font-bold text-stone-800">{media.filename}</span>
                  <span className="text-[11px] text-stone-500 mt-1">
                    Faixa de áudio eclesial (Sermão / Podcast / Louvor)
                  </span>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center text-center p-8">
                  <div className="w-16 h-16 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-lg mb-3">
                    <DocumentIcon className="w-8 h-8" />
                  </div>
                  <span className="text-xs font-bold text-stone-800">{media.filename}</span>
                  <span className="text-[11px] text-stone-500 mt-1">
                    Documento PDF / Publicação oficial
                  </span>
                </div>
              )}
            </div>

            {/* Metadados Técnicos Somente Leitura */}
            <div className="bg-stone-50 rounded-xl p-4 border border-stone-200/80 space-y-2.5 text-xs">
              <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">
                Metadados do Arquivo
              </span>

              <div className="grid grid-cols-2 gap-3 text-[11px]">
                <div>
                  <span className="text-stone-400 block">Nome do Arquivo</span>
                  <span className="font-mono text-stone-800 font-medium break-all">
                    {media.filename}
                  </span>
                </div>
                <div>
                  <span className="text-stone-400 block">Arquivo Original</span>
                  <span className="font-mono text-stone-800 font-medium break-all">
                    {media.originalName}
                  </span>
                </div>
                <div>
                  <span className="text-stone-400 block">Tipo MIME</span>
                  <span className="font-mono text-stone-800 font-medium">
                    {media.mimeType}
                  </span>
                </div>
                <div>
                  <span className="text-stone-400 block">Dimensões</span>
                  <span className="font-semibold text-stone-800">
                    {formatDimensions(media.dimensions)}
                  </span>
                </div>
                <div>
                  <span className="text-stone-400 block">Tamanho</span>
                  <span className="font-semibold text-stone-800">
                    {formatFileSize(media.sizeBytes)}
                  </span>
                </div>
                <div>
                  <span className="text-stone-400 block">Pasta</span>
                  <span className="font-medium text-stone-700">
                    {media.folder || 'Sem pasta'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Lado Direito: Edição Local de Metadados Canônicos */}
          <form onSubmit={handleSave} className="md:col-span-5 flex flex-col justify-between space-y-4">
            <div className="space-y-4">
              <div>
                <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider mb-1">
                  Detalhes Editáveis
                </h4>
                <p className="text-[11px] text-stone-500">
                  Atualize o título, o texto alternativo e a visibilidade desta mídia no site.
                </p>
              </div>

              {/* Título */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-stone-700 block">
                  Título da Mídia
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Título descritivo da imagem ou arquivo..."
                  className="w-full text-xs px-3 py-2 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500 text-stone-900"
                />
              </div>

              {/* Alt Text (somente mídias de imagem ou com relevância para leitores de tela) */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-stone-700 block">
                    Texto Alternativo (Alt Text)
                  </label>
                  {media.type === 'image' && (
                    <span className="text-[10px] text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded font-medium border border-amber-200">
                      Acessibilidade
                    </span>
                  )}
                </div>
                <textarea
                  value={altText}
                  onChange={(e) => setAltText(e.target.value)}
                  rows={3}
                  placeholder="Descreva visualmente o conteúdo para deficientes visuais e SEO..."
                  className="w-full text-xs px-3 py-2 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500 text-stone-900"
                />
              </div>

              {/* Status */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-stone-700 block">
                  Status no CMS
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as MediaStatus)}
                  className="w-full text-xs px-3 py-2 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white text-stone-800"
                >
                  <option value="active">Ativo (Disponível para seleção)</option>
                  <option value="archived">Arquivado</option>
                </select>
              </div>

              {/* URL Direta (somente leitura) */}
              <div className="space-y-1 pt-1">
                <label className="text-[10px] font-semibold text-stone-500 uppercase tracking-wider block">
                  URL da Mídia
                </label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="text"
                    readOnly
                    value={media.url}
                    className="w-full text-[11px] font-mono px-2.5 py-1.5 rounded-lg border border-stone-200 bg-stone-50 text-stone-600 select-all"
                  />
                  <a
                    href={media.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 text-stone-500 hover:text-amber-700 hover:bg-stone-100 rounded-lg border border-stone-200 shrink-0"
                    title="Abrir URL em nova aba"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>

            {/* Ações de Salvamento */}
            <div className="pt-4 border-t border-stone-100 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-stone-600 hover:text-stone-800 hover:bg-stone-100 rounded-xl transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-xl transition-colors shadow-xs"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Salvar Alterações</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
