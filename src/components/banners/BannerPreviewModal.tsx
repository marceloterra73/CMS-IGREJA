import React from 'react';
import {
  X,
  Edit2,
  Image as ImageIcon,
  ArrowUpRight,
  Hash,
  Clock,
  Layers,
  Info,
} from 'lucide-react';
import { ChurchBanner } from '../../types';
import { BannerStatusBadge } from './BannerStatusBadge';
import {
  formatBannerDateTime,
  getBannerStatusDescription,
  getMediaItemById,
} from './bannersUtils';

interface BannerPreviewModalProps {
  banner: ChurchBanner | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (banner: ChurchBanner) => void;
}

export const BannerPreviewModal: React.FC<BannerPreviewModalProps> = ({
  banner,
  isOpen,
  onClose,
  onEdit,
}) => {
  if (!isOpen || !banner) return null;

  const media = getMediaItemById(banner.imageMediaId);
  const statusDesc = getBannerStatusDescription(banner.status);

  return (
    <div
      id="banner-preview-modal-backdrop"
      className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
    >
      <div
        id="banner-preview-modal-content"
        className="bg-white w-full max-w-2xl rounded-2xl shadow-xl border border-stone-200 overflow-hidden flex flex-col my-8 max-h-[90vh]"
      >
        {/* Cabeçalho */}
        <div className="px-5 py-4 border-b border-stone-200 flex items-center justify-between bg-stone-50/70">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-stone-900 text-white rounded-xl shadow-xs">
              <Layers className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-stone-900">
                  Pré-visualização do Banner
                </h2>
                <BannerStatusBadge status={banner.status} size="sm" />
              </div>
              <p className="text-xs text-stone-500">
                Visualização do destaque visual no formato exibido aos membros e visitantes.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 rounded-lg transition-colors cursor-pointer"
            title="Fechar pré-visualização"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Conteúdo com Simulação Visual do Hero / Banner */}
        <div className="p-5 overflow-y-auto space-y-5 flex-1">
          {/* Simulação Visual do Bloco Hero / Banner */}
          <div className="relative rounded-2xl overflow-hidden bg-gradient-to-b from-stone-900 via-stone-900 to-stone-950 text-white p-6 sm:p-8 shadow-inner border border-stone-800 flex flex-col justify-center min-h-[260px]">
            {media && (
              <div
                className="absolute inset-0 bg-cover bg-center opacity-30 pointer-events-none"
                style={{ backgroundImage: `url(${media.url})` }}
              />
            )}

            {/* Badges superiores na simulação */}
            <div className="relative z-10 flex items-center gap-2 mb-3">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[11px] font-bold border border-amber-500/30">
                <span>Destaque #{banner.order}</span>
              </span>
              <span className="text-stone-400 text-xs font-mono">
                Tenant: {banner.tenantId}
              </span>
            </div>

            {/* Título Principal */}
            <h1 className="relative z-10 text-xl sm:text-2xl lg:text-3xl font-black tracking-tight text-white max-w-xl leading-tight">
              {banner.title}
            </h1>

            {/* Subtítulo ou Mensagem de Apoio */}
            {banner.subtitle && (
              <p className="relative z-10 text-xs sm:text-sm text-stone-300 mt-2 max-w-lg leading-relaxed">
                {banner.subtitle}
              </p>
            )}

            {/* Botões de Ação na Simulação */}
            {(banner.primaryButtonLabel || banner.secondaryButtonLabel) && (
              <div className="relative z-10 flex flex-wrap items-center gap-2.5 mt-5">
                {banner.primaryButtonLabel && (
                  <div className="inline-flex items-center gap-1.5 px-4 py-2 bg-amber-500 text-stone-950 font-bold rounded-xl text-xs shadow-xs">
                    <span>{banner.primaryButtonLabel}</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </div>
                )}
                {banner.secondaryButtonLabel && (
                  <div className="inline-flex items-center gap-1.5 px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl text-xs border border-white/20">
                    <span>{banner.secondaryButtonLabel}</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Dados Técnicos e Estruturados */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Informações de Navegação / Botões */}
            <div className="p-3.5 bg-stone-50 border border-stone-200 rounded-xl space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-stone-700 uppercase tracking-wider">
                <ArrowUpRight className="w-3.5 h-3.5 text-stone-400" />
                <span>Links & Destinos</span>
              </div>
              <div className="space-y-1.5 text-xs">
                <div>
                  <span className="text-stone-500 font-medium">Ação Primária:</span>{' '}
                  <span className="font-semibold text-stone-900">
                    {banner.primaryButtonLabel || 'Não configurada'}
                  </span>
                  {banner.primaryButtonUrl && (
                    <span className="block font-mono text-[11px] text-stone-600 truncate">
                      {banner.primaryButtonUrl}
                    </span>
                  )}
                </div>
                <div>
                  <span className="text-stone-500 font-medium">Ação Secundária:</span>{' '}
                  <span className="font-semibold text-stone-900">
                    {banner.secondaryButtonLabel || 'Não configurada'}
                  </span>
                  {banner.secondaryButtonUrl && (
                    <span className="block font-mono text-[11px] text-stone-600 truncate">
                      {banner.secondaryButtonUrl}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Informações da Imagem de Mídia */}
            <div className="p-3.5 bg-stone-50 border border-stone-200 rounded-xl space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-stone-700 uppercase tracking-wider">
                <ImageIcon className="w-3.5 h-3.5 text-stone-400" />
                <span>Ativo de Mídia</span>
              </div>
              {media ? (
                <div className="space-y-1 text-xs">
                  <div className="font-semibold text-stone-900 truncate">
                    {media.title || media.filename}
                  </div>
                  <div className="text-[11px] font-mono text-stone-500">
                    ID: {media.id} • Dimensões:{' '}
                    {media.dimensions
                      ? `${media.dimensions.width}x${media.dimensions.height}px`
                      : 'N/D'}
                  </div>
                  <div className="text-[11px] text-stone-500 truncate">
                    Alt: {media.altText || 'Sem texto alternativo'}
                  </div>
                </div>
              ) : (
                <div className="text-xs text-stone-500 italic">
                  Nenhum arquivo de imagem vinculado a este banner.
                </div>
              )}
            </div>
          </div>

          {/* Status e Auditoria */}
          <div className="p-3.5 bg-stone-50 border border-stone-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4 text-stone-400 shrink-0" />
              <span className="text-stone-600">{statusDesc}</span>
            </div>
            <div className="text-stone-400 font-mono text-[11px] shrink-0">
              Criado: {formatBannerDateTime(banner.createdAt)}
            </div>
          </div>
        </div>

        {/* Rodapé com Ações */}
        <div className="px-5 py-4 border-t border-stone-200 bg-stone-50/70 flex items-center justify-between">
          <span className="text-xs font-mono text-stone-400">
            ID: {banner.id}
          </span>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-white border border-stone-200 text-stone-700 hover:bg-stone-100 rounded-xl text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
            >
              Fechar
            </button>

            <button
              type="button"
              onClick={() => onEdit(banner)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs sm:text-sm font-semibold transition-all shadow-xs cursor-pointer"
            >
              <Edit2 className="w-4 h-4" />
              <span>Editar Banner</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
