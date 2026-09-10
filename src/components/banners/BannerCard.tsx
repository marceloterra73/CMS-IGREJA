import React from 'react';
import {
  Eye,
  Edit2,
  Copy,
  Trash2,
  ArrowUpRight,
  Hash,
  Image as ImageIcon,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import { ChurchBanner } from '../../types';
import { BannerStatusBadge } from './BannerStatusBadge';
import { formatBannerDate, getMediaItemById } from './bannersUtils';

interface BannerCardProps {
  banner: ChurchBanner;
  onPreview: (banner: ChurchBanner) => void;
  onEdit: (banner: ChurchBanner) => void;
  onDuplicate: (banner: ChurchBanner) => void;
  onToggleStatus: (banner: ChurchBanner) => void;
  onDelete: (banner: ChurchBanner) => void;
}

export const BannerCard: React.FC<BannerCardProps> = ({
  banner,
  onPreview,
  onEdit,
  onDuplicate,
  onToggleStatus,
  onDelete,
}) => {
  const media = getMediaItemById(banner.imageMediaId);
  const isActive = banner.status === 'active';

  return (
    <div
      id={`banner-card-${banner.id}`}
      className="bg-white rounded-2xl border border-stone-200 shadow-2xs hover:shadow-md transition-all overflow-hidden flex flex-col group"
    >
      {/* Imagem de Capa do Banner com Ordem e Status */}
      <div className="relative aspect-16/9 bg-stone-900 overflow-hidden flex items-center justify-center">
        {media ? (
          <img
            src={media.url}
            alt={media.altText || banner.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300 opacity-90"
          />
        ) : (
          <div className="flex flex-col items-center justify-center gap-1.5 text-stone-500 p-4 text-center">
            <ImageIcon className="w-8 h-8 text-stone-600" />
            <span className="text-[11px] font-medium text-stone-400">
              Sem imagem vinculada
            </span>
          </div>
        )}

        {/* Badge de Ordem e Status sobre a Imagem */}
        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
          <span
            className="px-2 py-0.5 bg-stone-950/80 backdrop-blur-xs text-white font-mono text-xs font-bold rounded-lg border border-white/20 shadow-xs"
            title="Ordem de exibição do banner"
          >
            #{banner.order}
          </span>
          <BannerStatusBadge status={banner.status} size="sm" />
        </div>

        {/* Overlay com Ação Rápida de Prévia */}
        <button
          type="button"
          onClick={() => onPreview(banner)}
          className="absolute inset-0 bg-stone-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 text-white text-xs font-semibold backdrop-blur-2xs cursor-pointer"
          title="Pré-visualizar Banner"
        >
          <Eye className="w-4 h-4" />
          <span>Visualizar Destaque</span>
        </button>
      </div>

      {/* Conteúdo Informativo */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <h3
            onClick={() => onPreview(banner)}
            className="font-bold text-sm sm:text-base text-stone-900 group-hover:text-stone-700 transition-colors line-clamp-1 cursor-pointer"
            title={banner.title}
          >
            {banner.title}
          </h3>

          {banner.subtitle && (
            <p
              className="text-xs text-stone-500 mt-1 line-clamp-2 leading-relaxed"
              title={banner.subtitle}
            >
              {banner.subtitle}
            </p>
          )}

          {/* Chamadas de Ação (Buttons) Cadastradas */}
          {(banner.primaryButtonLabel || banner.secondaryButtonLabel) && (
            <div className="flex flex-wrap items-center gap-1.5 mt-2.5 pt-2 border-t border-stone-100 text-[11px]">
              {banner.primaryButtonLabel && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 font-medium">
                  <ArrowUpRight className="w-3 h-3 text-stone-400" />
                  <span className="truncate max-w-[130px]">{banner.primaryButtonLabel}</span>
                </span>
              )}
              {banner.secondaryButtonLabel && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-stone-50 text-stone-600 font-medium border border-stone-200">
                  <ArrowUpRight className="w-3 h-3 text-stone-400" />
                  <span className="truncate max-w-[130px]">{banner.secondaryButtonLabel}</span>
                </span>
              )}
            </div>
          )}
        </div>

        {/* Metadados e Rodapé de Ações do Cartão */}
        <div className="pt-2 border-t border-stone-100 flex items-center justify-between gap-2">
          <span className="text-[11px] text-stone-400 font-mono">
            {formatBannerDate(banner.updatedAt || banner.createdAt)}
          </span>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => onToggleStatus(banner)}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                isActive
                  ? 'text-emerald-600 hover:bg-emerald-50'
                  : 'text-stone-400 hover:text-stone-700 hover:bg-stone-100'
              }`}
              title={isActive ? 'Desativar banner' : 'Ativar banner'}
            >
              {isActive ? (
                <CheckCircle className="w-4 h-4" />
              ) : (
                <XCircle className="w-4 h-4" />
              )}
            </button>

            <button
              type="button"
              onClick={() => onDuplicate(banner)}
              className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
              title="Duplicar banner"
            >
              <Copy className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => onEdit(banner)}
              className="p-1.5 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
              title="Editar banner"
            >
              <Edit2 className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => onDelete(banner)}
              className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
              title="Excluir banner"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
