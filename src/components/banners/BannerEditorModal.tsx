import React, { useState, useEffect } from 'react';
import {
  X,
  Save,
  Image as ImageIcon,
  AlertCircle,
  CheckCircle,
  XCircle,
  Hash,
  Trash2,
  Layers,
  ArrowUpRight,
} from 'lucide-react';
import { ChurchBanner, BannerStatus, MediaItem } from '../../types';
import { MediaPickerModal } from '../media/MediaPickerModal';
import { getMediaItemById, isValidBannerUrl } from './bannersUtils';

interface BannerEditorModalProps {
  banner: ChurchBanner | null; // null = novo banner
  isOpen: boolean;
  onClose: () => void;
  onSave: (banner: ChurchBanner) => void;
  existingBanners: ChurchBanner[];
}

export const BannerEditorModal: React.FC<BannerEditorModalProps> = ({
  banner,
  isOpen,
  onClose,
  onSave,
  existingBanners,
}) => {
  const isEditing = Boolean(banner);

  // Estados dos campos do contrato canônico ChurchBanner
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [imageMediaId, setImageMediaId] = useState<string | undefined>(undefined);
  const [primaryButtonLabel, setPrimaryButtonLabel] = useState('');
  const [primaryButtonUrl, setPrimaryButtonUrl] = useState('');
  const [secondaryButtonLabel, setSecondaryButtonLabel] = useState('');
  const [secondaryButtonUrl, setSecondaryButtonUrl] = useState('');
  const [order, setOrder] = useState<number>(1);
  const [status, setStatus] = useState<BannerStatus>('active');

  // Controle de modal de mídia e erros
  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Inicialização do formulário ao abrir
  useEffect(() => {
    if (isOpen) {
      if (banner) {
        setTitle(banner.title);
        setSubtitle(banner.subtitle || '');
        setImageMediaId(banner.imageMediaId);
        setPrimaryButtonLabel(banner.primaryButtonLabel || '');
        setPrimaryButtonUrl(banner.primaryButtonUrl || '');
        setSecondaryButtonLabel(banner.secondaryButtonLabel || '');
        setSecondaryButtonUrl(banner.secondaryButtonUrl || '');
        setOrder(banner.order ?? 1);
        setStatus(banner.status);
      } else {
        // Novo banner: calcula próxima ordem sugerida
        const maxOrder = existingBanners.reduce(
          (max, b) => Math.max(max, b.order || 0),
          0
        );
        setTitle('');
        setSubtitle('');
        setImageMediaId(undefined);
        setPrimaryButtonLabel('');
        setPrimaryButtonUrl('');
        setSecondaryButtonLabel('');
        setSecondaryButtonUrl('');
        setOrder(maxOrder + 1);
        setStatus('active');
      }
      setErrorMsg(null);
    }
  }, [isOpen, banner, existingBanners]);

  if (!isOpen) return null;

  // Imagem de destaque selecionada
  const selectedImage = getMediaItemById(imageMediaId);

  // Handler de salvamento com validação estrita dos campos canônicos
  const handleSave = () => {
    setErrorMsg(null);

    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      setErrorMsg('O título principal do banner é obrigatório.');
      return;
    }

    const parsedOrder = Number(order);
    if (isNaN(parsedOrder) || parsedOrder < 1) {
      setErrorMsg('A ordem de exibição deve ser um número maior ou igual a 1.');
      return;
    }

    // Validação de protocolos seguros de URL (sem javascript:, data:, etc.)
    if (primaryButtonUrl && !isValidBannerUrl(primaryButtonUrl)) {
      setErrorMsg('A URL da ação primária deve iniciar com https://, http:// ou caminho relativo (ex: /sobre).');
      return;
    }

    if (secondaryButtonUrl && !isValidBannerUrl(secondaryButtonUrl)) {
      setErrorMsg('A URL da ação secundária deve iniciar com https://, http:// ou caminho relativo (ex: /sermoes).');
      return;
    }

    const now = new Date().toISOString();

    const bannerData: ChurchBanner = {
      id: banner?.id || `ban_${Date.now()}`,
      tenantId: banner?.tenantId || 'ib_central',
      title: trimmedTitle,
      subtitle: subtitle.trim() || undefined,
      imageMediaId: imageMediaId || undefined,
      primaryButtonLabel: primaryButtonLabel.trim() || undefined,
      primaryButtonUrl: primaryButtonUrl.trim() || undefined,
      secondaryButtonLabel: secondaryButtonLabel.trim() || undefined,
      secondaryButtonUrl: secondaryButtonUrl.trim() || undefined,
      order: Math.floor(parsedOrder),
      status,
      createdAt: banner?.createdAt || now,
      updatedAt: now,
    };

    onSave(bannerData);
    onClose();
  };

  return (
    <>
      <div
        id="banner-editor-modal-backdrop"
        className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
      >
        <div
          id="banner-editor-modal-content"
          className="bg-white w-full max-w-xl rounded-2xl shadow-xl border border-stone-200 overflow-hidden flex flex-col my-8 max-h-[90vh]"
        >
          {/* Cabeçalho do Modal */}
          <div className="px-5 py-4 border-b border-stone-200 flex items-center justify-between bg-stone-50/70">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-stone-900 text-white rounded-xl shadow-xs">
                <Layers className="w-4 h-4 text-amber-400" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-bold text-stone-900">
                  {isEditing ? 'Editar Banner' : 'Novo Banner'}
                </h2>
                <p className="text-xs text-stone-500">
                  {isEditing
                    ? 'Atualize os textos, imagem e chamadas de ação do destaque.'
                    : 'Cadastre um novo banner de boas-vindas, evento ou aviso principal.'}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 rounded-lg transition-colors cursor-pointer"
              title="Fechar formulário"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Corpo com Campos do Contrato ChurchBanner */}
          <div className="p-5 overflow-y-auto space-y-4 flex-1">
            {/* Alerta de Validação */}
            {errorMsg && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2.5 text-xs text-rose-700">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Linha 1: Título do Banner (title) */}
            <div>
              <label
                htmlFor="input-banner-title"
                className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1"
              >
                Título Principal <span className="text-rose-500">*</span>
              </label>
              <input
                id="input-banner-title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex: Uma Igreja Acolhedora, Viva e Relevante"
                className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm text-stone-900 placeholder-stone-400 focus:outline-hidden focus:ring-2 focus:ring-stone-900 focus:bg-white transition-all font-medium"
              />
            </div>

            {/* Linha 2: Subtítulo / Mensagem (subtitle) */}
            <div>
              <label
                htmlFor="textarea-banner-subtitle"
                className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1"
              >
                Subtítulo ou Mensagem de Apoio
              </label>
              <textarea
                id="textarea-banner-subtitle"
                rows={2}
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                placeholder="Ex: Construindo vidas através da Palavra, do Amor Fraternal e da Comunhão Cristã. Cultos aos domingos às 10h e 18h."
                className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm text-stone-900 placeholder-stone-400 focus:outline-hidden focus:ring-2 focus:ring-stone-900 focus:bg-white transition-all leading-relaxed"
              />
            </div>

            {/* Linha 3: Imagem de Destaque (imageMediaId) com Reutilização de MediaPickerModal */}
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                Imagem de Fundo / Destaque Visual
              </label>

              {selectedImage ? (
                <div className="p-3 bg-stone-50 border border-stone-200 rounded-xl flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={selectedImage.url}
                      alt={selectedImage.altText || 'Imagem do banner'}
                      referrerPolicy="no-referrer"
                      className="w-16 h-12 rounded-xl object-cover border border-stone-200 shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="text-xs font-semibold text-stone-900 truncate">
                        {selectedImage.title}
                      </div>
                      <div className="text-[11px] text-stone-500 truncate">
                        {selectedImage.filename} • ID: {selectedImage.id}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => setIsMediaPickerOpen(true)}
                      className="px-2.5 py-1.5 bg-white border border-stone-200 hover:bg-stone-100 text-stone-700 rounded-lg text-xs font-medium transition-colors cursor-pointer"
                    >
                      Trocar
                    </button>
                    <button
                      type="button"
                      onClick={() => setImageMediaId(undefined)}
                      className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                      title="Remover imagem"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-stone-50 border border-dashed border-stone-300 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-center sm:text-left">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-stone-200/80 text-stone-500 flex items-center justify-center shrink-0 mx-auto sm:mx-0">
                      <ImageIcon className="w-5 h-5 text-stone-400" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-stone-800">
                        Nenhuma imagem vinculada
                      </div>
                      <div className="text-[11px] text-stone-500">
                        Selecione uma foto da biblioteca de mídia para o fundo do banner.
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsMediaPickerOpen(true)}
                    className="inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-white border border-stone-300 hover:bg-stone-100 text-stone-700 rounded-xl text-xs font-semibold transition-colors cursor-pointer shadow-2xs shrink-0"
                  >
                    <ImageIcon className="w-3.5 h-3.5 text-stone-500" />
                    <span>Selecionar da Mídia</span>
                  </button>
                </div>
              )}
            </div>

            {/* Linha 4: Botão Primário (primaryButtonLabel & primaryButtonUrl) */}
            <div className="p-3.5 bg-stone-50/70 border border-stone-200 rounded-xl space-y-2.5">
              <span className="text-xs font-bold text-stone-700 uppercase tracking-wider block">
                Botão de Ação Primário
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label
                    htmlFor="input-banner-pbtn-label"
                    className="block text-[11px] font-semibold text-stone-600 mb-1"
                  >
                    Texto do Botão
                  </label>
                  <input
                    id="input-banner-pbtn-label"
                    type="text"
                    value={primaryButtonLabel}
                    onChange={(e) => setPrimaryButtonLabel(e.target.value)}
                    placeholder="Ex: Planeje Sua Visita"
                    className="w-full px-3 py-1.5 bg-white border border-stone-200 rounded-lg text-xs text-stone-900 placeholder-stone-400 focus:outline-hidden focus:ring-1 focus:ring-stone-900"
                  />
                </div>
                <div>
                  <label
                    htmlFor="input-banner-pbtn-url"
                    className="block text-[11px] font-semibold text-stone-600 mb-1"
                  >
                    URL ou Destino
                  </label>
                  <input
                    id="input-banner-pbtn-url"
                    type="text"
                    value={primaryButtonUrl}
                    onChange={(e) => setPrimaryButtonUrl(e.target.value)}
                    placeholder="Ex: /sobre ou https://..."
                    className="w-full px-3 py-1.5 bg-white border border-stone-200 rounded-lg text-xs text-stone-900 placeholder-stone-400 focus:outline-hidden focus:ring-1 focus:ring-stone-900 font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Linha 5: Botão Secundário (secondaryButtonLabel & secondaryButtonUrl) */}
            <div className="p-3.5 bg-stone-50/70 border border-stone-200 rounded-xl space-y-2.5">
              <span className="text-xs font-bold text-stone-700 uppercase tracking-wider block">
                Botão de Ação Secundário
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label
                    htmlFor="input-banner-sbtn-label"
                    className="block text-[11px] font-semibold text-stone-600 mb-1"
                  >
                    Texto do Botão
                  </label>
                  <input
                    id="input-banner-sbtn-label"
                    type="text"
                    value={secondaryButtonLabel}
                    onChange={(e) => setSecondaryButtonLabel(e.target.value)}
                    placeholder="Ex: Assistir Online"
                    className="w-full px-3 py-1.5 bg-white border border-stone-200 rounded-lg text-xs text-stone-900 placeholder-stone-400 focus:outline-hidden focus:ring-1 focus:ring-stone-900"
                  />
                </div>
                <div>
                  <label
                    htmlFor="input-banner-sbtn-url"
                    className="block text-[11px] font-semibold text-stone-600 mb-1"
                  >
                    URL ou Destino
                  </label>
                  <input
                    id="input-banner-sbtn-url"
                    type="text"
                    value={secondaryButtonUrl}
                    onChange={(e) => setSecondaryButtonUrl(e.target.value)}
                    placeholder="Ex: /sermoes ou https://..."
                    className="w-full px-3 py-1.5 bg-white border border-stone-200 rounded-lg text-xs text-stone-900 placeholder-stone-400 focus:outline-hidden focus:ring-1 focus:ring-stone-900 font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Linha 6: Ordem (order) e Status (status) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <div>
                <label
                  htmlFor="input-banner-order"
                  className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1"
                  title="Número para definir a ordem na sequência de banners"
                >
                  Ordem de Exibição (#) <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Hash className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    id="input-banner-order"
                    type="number"
                    min="1"
                    step="1"
                    value={order}
                    onChange={(e) => setOrder(parseInt(e.target.value, 10) || 1)}
                    className="w-full pl-8 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm text-stone-900 focus:outline-hidden focus:ring-2 focus:ring-stone-900 focus:bg-white font-mono transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Status de Exibição <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setStatus('active')}
                    className={`flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                      status === 'active'
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-800'
                        : 'border-stone-200 bg-stone-50 text-stone-600 hover:bg-stone-100'
                    }`}
                  >
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Ativo</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setStatus('inactive')}
                    className={`flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                      status === 'inactive'
                        ? 'border-stone-700 bg-stone-100 text-stone-900'
                        : 'border-stone-200 bg-stone-50 text-stone-600 hover:bg-stone-100'
                    }`}
                  >
                    <XCircle className="w-3.5 h-3.5 text-stone-500" />
                    <span>Inativo</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Rodapé com Botões de Ação */}
          <div className="px-5 py-4 border-t border-stone-200 bg-stone-50/70 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-white border border-stone-200 text-stone-700 hover:bg-stone-100 rounded-xl text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
            >
              Cancelar
            </button>

            <button
              id="btn-save-banner"
              type="button"
              onClick={handleSave}
              className="inline-flex items-center gap-2 px-5 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs sm:text-sm font-semibold transition-all shadow-xs hover:shadow-md cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{isEditing ? 'Salvar Alterações' : 'Cadastrar Banner'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Modal Reutilizável de Seleção de Mídia da Biblioteca */}
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
