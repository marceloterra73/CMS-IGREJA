import React, { useState, useEffect } from 'react';
import {
  X,
  Camera,
  Image as ImageIcon,
  Plus,
  Trash2,
  Check,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import { ChurchGalleryAlbum, GalleryStatus, MediaItem } from '../../types';
import { MediaPickerModal } from '../media/MediaPickerModal';
import { generateGallerySlug, getMediaItemById, getMediaItemsByIds } from './galleryUtils';

interface GalleryEditorModalProps {
  isOpen: boolean;
  album: ChurchGalleryAlbum | null; // null = novo álbum
  onClose: () => void;
  onSave: (album: ChurchGalleryAlbum) => void;
}

export const GalleryEditorModal: React.FC<GalleryEditorModalProps> = ({
  isOpen,
  album,
  onClose,
  onSave,
}) => {
  const isEditing = Boolean(album);

  // Campos canônicos do contrato
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [coverMediaId, setCoverMediaId] = useState<string | undefined>(undefined);
  const [mediaIds, setMediaIds] = useState<string[]>([]);
  const [status, setStatus] = useState<GalleryStatus>('active');

  // Estado de validação
  const [errors, setErrors] = useState<{ title?: string }>({});

  // Controle do seletor de mídia existente
  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);
  const [pickerTarget, setPickerTarget] = useState<'cover' | 'album'>('cover');

  // Inicializa o formulário ao abrir ou alterar o álbum
  useEffect(() => {
    if (album) {
      setTitle(album.title || '');
      setSlug(album.slug || '');
      setDescription(album.description || '');
      setCoverMediaId(album.coverMediaId);
      setMediaIds(album.mediaIds || []);
      setStatus(album.status || 'active');
    } else {
      setTitle('');
      setSlug('');
      setDescription('');
      setCoverMediaId(undefined);
      setMediaIds([]);
      setStatus('active');
    }
    setErrors({});
  }, [album, isOpen]);

  if (!isOpen) return null;

  // Gerar slug automaticamente com base no título
  const handleAutoSlug = () => {
    if (title.trim()) {
      setSlug(generateGallerySlug(title));
    }
  };

  // Abre seletor de mídia para definir a capa
  const handleOpenCoverPicker = () => {
    setPickerTarget('cover');
    setIsMediaPickerOpen(true);
  };

  // Abre seletor de mídia para adicionar uma foto ao álbum
  const handleOpenAlbumPhotoPicker = () => {
    setPickerTarget('album');
    setIsMediaPickerOpen(true);
  };

  // Callback de seleção da mídia
  const handleMediaSelected = (media: MediaItem) => {
    if (pickerTarget === 'cover') {
      setCoverMediaId(media.id);
      // Se o álbum ainda não tem fotos, podemos adicionar a capa também na lista se desejar
      if (!mediaIds.includes(media.id)) {
        setMediaIds((prev) => [...prev, media.id]);
      }
    } else {
      if (!mediaIds.includes(media.id)) {
        setMediaIds((prev) => [...prev, media.id]);
      }
      // Se ainda não houver capa definida, a primeira foto adicionada vira a capa
      if (!coverMediaId) {
        setCoverMediaId(media.id);
      }
    }
    setIsMediaPickerOpen(false);
  };

  // Remove foto do álbum
  const handleRemovePhoto = (idToRemove: string) => {
    setMediaIds((prev) => prev.filter((id) => id !== idToRemove));
    if (coverMediaId === idToRemove) {
      setCoverMediaId(undefined);
    }
  };

  // Define uma foto existente da lista como capa
  const handleSetAsCover = (id: string) => {
    setCoverMediaId(id);
  };

  // Submissão e validação
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: { title?: string } = {};
    if (!title.trim()) {
      newErrors.title = 'O título do álbum é obrigatório.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const now = new Date().toISOString();
    const finalSlug = slug.trim() ? slug.trim() : generateGallerySlug(title);

    const savedAlbum: ChurchGalleryAlbum = {
      id: album?.id || `alb_${Date.now()}`,
      tenantId: album?.tenantId || 'ib_central',
      title: title.trim(),
      slug: finalSlug,
      description: description.trim() || undefined,
      coverMediaId: coverMediaId || undefined,
      mediaIds: mediaIds,
      status: status,
      createdAt: album?.createdAt || now,
      updatedAt: now,
    };

    onSave(savedAlbum);
  };

  // Recupera as mídias selecionadas para exibição visual
  const coverMedia = getMediaItemById(coverMediaId);
  const albumMediaItems = getMediaItemsByIds(mediaIds);

  return (
    <>
      <div
        id="gallery-editor-modal"
        className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6"
      >
        <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-stone-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
          {/* Cabeçalho do Modal */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-stone-100 flex items-center justify-center text-stone-800">
                <Camera className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-stone-900">
                  {isEditing ? 'Editar Álbum de Fotos' : 'Novo Álbum de Fotos'}
                </h2>
                <p className="text-xs text-stone-500">
                  {isEditing
                    ? 'Atualize as informações e fotos vinculadas ao álbum.'
                    : 'Preencha os campos canônicos para cadastrar um novo álbum.'}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Formulário com Scroll Interno */}
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5 text-sm">
            {/* Título (Obrigatório) */}
            <div>
              <label
                htmlFor="album-title"
                className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5"
              >
                Título do Álbum <span className="text-red-500">*</span>
              </label>
              <input
                id="album-title"
                type="text"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (errors.title) setErrors((prev) => ({ ...prev, title: undefined }));
                }}
                onBlur={() => {
                  if (!slug && title.trim()) {
                    setSlug(generateGallerySlug(title));
                  }
                }}
                placeholder="Ex: Batismo nas Águas - Celebração de Primavera"
                className={`w-full px-3.5 py-2.5 rounded-lg border bg-stone-50 text-stone-900 placeholder:text-stone-400 focus:outline-hidden focus:ring-2 focus:bg-white transition-all ${
                  errors.title
                    ? 'border-red-300 focus:ring-red-400 bg-red-50/20'
                    : 'border-stone-200 focus:ring-stone-400'
                }`}
              />
              {errors.title && (
                <div className="flex items-center gap-1 mt-1 text-xs text-red-600">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{errors.title}</span>
                </div>
              )}
            </div>

            {/* Slug (Opcional) */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="album-slug"
                  className="block text-xs font-semibold text-stone-700 uppercase tracking-wider"
                >
                  Slug (Identificador URL)
                </label>
                {title.trim() && (
                  <button
                    type="button"
                    onClick={handleAutoSlug}
                    className="inline-flex items-center gap-1 text-xs text-stone-500 hover:text-stone-900"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>Gerar do título</span>
                  </button>
                )}
              </div>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 font-mono text-xs">
                  /
                </span>
                <input
                  id="album-slug"
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="batismo-aguas-primavera-2026"
                  className="w-full pl-6 pr-3.5 py-2.5 rounded-lg border border-stone-200 bg-stone-50 font-mono text-xs text-stone-900 placeholder:text-stone-400 focus:outline-hidden focus:ring-2 focus:ring-stone-400 focus:bg-white transition-all"
                />
              </div>
              <p className="text-xs text-stone-400 mt-1">
                Identificador semântico para a página ou referência do álbum.
              </p>
            </div>

            {/* Descrição (Opcional) */}
            <div>
              <label
                htmlFor="album-description"
                className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5"
              >
                Descrição do Álbum
              </label>
              <textarea
                id="album-description"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Breve resumo contextual do evento, culto ou comemoração registrada..."
                className="w-full px-3.5 py-2.5 rounded-lg border border-stone-200 bg-stone-50 text-stone-900 placeholder:text-stone-400 focus:outline-hidden focus:ring-2 focus:ring-stone-400 focus:bg-white transition-all resize-none"
              />
            </div>

            {/* Status (GalleryStatus: 'active' | 'archived') */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-2">
                Status de Publicação
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label
                  className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                    status === 'active'
                      ? 'bg-emerald-50/70 border-emerald-300 text-emerald-900'
                      : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100/70'
                  }`}
                >
                  <input
                    type="radio"
                    name="album-status"
                    checked={status === 'active'}
                    onChange={() => setStatus('active')}
                    className="text-stone-900 focus:ring-stone-400"
                  />
                  <div>
                    <div className="font-medium text-xs sm:text-sm">Ativo</div>
                    <div className="text-xs text-stone-500">Publicado no catálogo</div>
                  </div>
                </label>

                <label
                  className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                    status === 'archived'
                      ? 'bg-stone-200/70 border-stone-400 text-stone-900'
                      : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100/70'
                  }`}
                >
                  <input
                    type="radio"
                    name="album-status"
                    checked={status === 'archived'}
                    onChange={() => setStatus('archived')}
                    className="text-stone-900 focus:ring-stone-400"
                  />
                  <div>
                    <div className="font-medium text-xs sm:text-sm">Arquivado</div>
                    <div className="text-xs text-stone-500">Guardado no histórico</div>
                  </div>
                </label>
              </div>
            </div>

            {/* Foto de Capa (coverMediaId) */}
            <div className="pt-2 border-t border-stone-100">
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-2">
                Foto de Capa do Álbum
              </label>
              <div className="flex flex-col sm:flex-row items-start gap-4">
                {coverMedia ? (
                  <div className="relative aspect-16/10 w-full sm:w-48 bg-stone-100 rounded-xl overflow-hidden border border-stone-200 shadow-xs group">
                    <img
                      src={coverMedia.url}
                      alt={coverMedia.altText || 'Capa do álbum'}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={handleOpenCoverPicker}
                        className="p-1.5 bg-white text-stone-900 rounded-md text-xs font-medium shadow-xs"
                        title="Alterar capa"
                      >
                        Trocar
                      </button>
                      <button
                        type="button"
                        onClick={() => setCoverMediaId(undefined)}
                        className="p-1.5 bg-red-600 text-white rounded-md text-xs font-medium shadow-xs"
                        title="Remover capa"
                      >
                        Remover
                      </button>
                    </div>
                  </div>
                ) : (
                  <div
                    onClick={handleOpenCoverPicker}
                    className="aspect-16/10 w-full sm:w-48 rounded-xl border-2 border-dashed border-stone-200 bg-stone-50 hover:bg-stone-100 hover:border-stone-300 transition-all flex flex-col items-center justify-center cursor-pointer text-stone-400 p-4 text-center"
                  >
                    <ImageIcon className="w-8 h-8 text-stone-300 mb-1" />
                    <span className="text-xs font-medium text-stone-600">
                      Selecionar Capa
                    </span>
                    <span className="text-[10px] text-stone-400">
                      da Biblioteca de Mídia
                    </span>
                  </div>
                )}

                <div className="flex-1 space-y-1.5">
                  <button
                    type="button"
                    onClick={handleOpenCoverPicker}
                    className="inline-flex items-center gap-2 px-3.5 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-medium rounded-lg transition-colors"
                  >
                    <ImageIcon className="w-4 h-4 text-stone-500" />
                    <span>{coverMedia ? 'Trocar foto de capa' : 'Escolher foto de capa'}</span>
                  </button>
                  <p className="text-xs text-stone-400">
                    A capa será o cartão de visita do álbum na listagem e na página principal.
                  </p>
                </div>
              </div>
            </div>

            {/* Gerenciamento de Fotos do Álbum (mediaIds) */}
            <div className="pt-2 border-t border-stone-100">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider">
                    Fotos do Álbum ({mediaIds.length})
                  </label>
                  <p className="text-xs text-stone-400">
                    Selecione as fotografias existentes na biblioteca que pertencem a este álbum.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleOpenAlbumPhotoPicker}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-stone-900 hover:bg-stone-800 text-white text-xs font-medium rounded-lg transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Adicionar Foto</span>
                </button>
              </div>

              {/* Grid de Fotos Selecionadas */}
              {mediaIds.length === 0 ? (
                <div className="p-6 rounded-xl border border-dashed border-stone-200 bg-stone-50/50 text-center">
                  <Camera className="w-8 h-8 text-stone-300 mx-auto mb-1.5" />
                  <p className="text-xs text-stone-500 font-medium">
                    Nenhuma foto adicionada ainda a este álbum.
                  </p>
                  <p className="text-[11px] text-stone-400 mt-0.5">
                    Clique em "Adicionar Foto" para selecionar da biblioteca de mídia existente.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5 mt-3">
                  {albumMediaItems.map((item) => {
                    const isCover = item.id === coverMediaId;
                    return (
                      <div
                        key={item.id}
                        className={`group relative aspect-square rounded-lg overflow-hidden border bg-stone-100 shadow-2xs ${
                          isCover ? 'border-emerald-500 ring-2 ring-emerald-400/50' : 'border-stone-200'
                        }`}
                      >
                        <img
                          src={item.url}
                          alt={item.title || item.filename}
                          className="w-full h-full object-cover"
                        />

                        {/* Tag de Capa */}
                        {isCover && (
                          <div className="absolute top-1 left-1 px-1.5 py-0.5 rounded-sm bg-emerald-600 text-white text-[9px] font-bold uppercase tracking-wider">
                            Capa
                          </div>
                        )}

                        {/* Overlay de Ações Rápidas */}
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1 p-1">
                          {!isCover && (
                            <button
                              type="button"
                              onClick={() => handleSetAsCover(item.id)}
                              className="w-full py-1 text-[10px] bg-white/90 hover:bg-white text-stone-800 font-medium rounded-sm text-center transition-colors"
                            >
                              Definir Capa
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => handleRemovePhoto(item.id)}
                            className="w-full py-1 text-[10px] bg-red-600/90 hover:bg-red-600 text-white font-medium rounded-sm text-center transition-colors flex items-center justify-center gap-1"
                          >
                            <Trash2 className="w-3 h-3" />
                            Remover
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </form>

          {/* Rodapé do Modal com Ações */}
          <div className="flex items-center justify-end gap-2.5 px-6 py-4 bg-stone-50 border-t border-stone-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-stone-700 hover:bg-stone-200 rounded-lg text-sm font-medium transition-colors"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="inline-flex items-center gap-2 px-5 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-sm font-medium shadow-xs transition-colors"
            >
              <Check className="w-4 h-4" />
              <span>{isEditing ? 'Salvar Alterações' : 'Criar Álbum'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Seletor de Mídia Integrado */}
      <MediaPickerModal
        isOpen={isMediaPickerOpen}
        onClose={() => setIsMediaPickerOpen(false)}
        onSelectImage={handleMediaSelected}
        selectedMediaId={pickerTarget === 'cover' ? coverMediaId : undefined}
      />
    </>
  );
};
