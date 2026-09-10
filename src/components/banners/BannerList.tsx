import React from 'react';
import {
  Eye,
  Edit2,
  Copy,
  Trash2,
  ArrowUpRight,
  Hash,
  Image as ImageIcon,
  Layers,
  Plus,
} from 'lucide-react';
import { ChurchBanner } from '../../types';
import { BannerCard } from './BannerCard';
import { BannerStatusBadge } from './BannerStatusBadge';
import { formatBannerDate, getMediaItemById } from './bannersUtils';
import { BannerViewMode } from './BannersToolbar';

interface BannerListProps {
  banners: ChurchBanner[];
  viewMode: BannerViewMode;
  onPreview: (banner: ChurchBanner) => void;
  onEdit: (banner: ChurchBanner) => void;
  onDuplicate: (banner: ChurchBanner) => void;
  onToggleStatus: (banner: ChurchBanner) => void;
  onDelete: (banner: ChurchBanner) => void;
  onNewBanner: () => void;
  hasFiltersActive: boolean;
  onClearFilters: () => void;
}

export const BannerList: React.FC<BannerListProps> = ({
  banners,
  viewMode,
  onPreview,
  onEdit,
  onDuplicate,
  onToggleStatus,
  onDelete,
  onNewBanner,
  hasFiltersActive,
  onClearFilters,
}) => {
  // Estado Vazio
  if (banners.length === 0) {
    return (
      <div
        id="empty-banners-state"
        className="p-10 sm:p-14 bg-white rounded-2xl border border-stone-200 text-center flex flex-col items-center justify-center max-w-lg mx-auto my-6"
      >
        <div className="w-14 h-14 rounded-2xl bg-stone-100 text-stone-600 flex items-center justify-center mb-4">
          <Layers className="w-7 h-7 text-stone-500" />
        </div>

        <h3 className="text-base sm:text-lg font-bold text-stone-900">
          {hasFiltersActive
            ? 'Nenhum banner encontrado'
            : 'Nenhum banner cadastrado'}
        </h3>

        <p className="text-xs sm:text-sm text-stone-500 mt-1.5 max-w-sm leading-relaxed">
          {hasFiltersActive
            ? 'Tente ajustar ou limpar seus filtros de busca para visualizar outros banners da igreja.'
            : 'Cadastre os banners de destaque, avisos de cultos e campanhas que serão exibidos no site.'}
        </p>

        <div className="mt-5 flex items-center gap-3">
          {hasFiltersActive ? (
            <button
              type="button"
              onClick={onClearFilters}
              className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
            >
              Limpar Filtros
            </button>
          ) : (
            <button
              type="button"
              onClick={onNewBanner}
              className="inline-flex items-center gap-2 px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs sm:text-sm font-semibold transition-all shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>+ Novo banner</span>
            </button>
          )}
        </div>
      </div>
    );
  }

  // Visualização em Modo Grade (Cards)
  if (viewMode === 'cards') {
    return (
      <div
        id="banners-cards-grid"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5"
      >
        {banners.map((banner) => (
          <BannerCard
            key={banner.id}
            banner={banner}
            onPreview={onPreview}
            onEdit={onEdit}
            onDuplicate={onDuplicate}
            onToggleStatus={onToggleStatus}
            onDelete={onDelete}
          />
        ))}
      </div>
    );
  }

  // Visualização em Modo Tabela (Table)
  return (
    <div
      id="banners-table-wrapper"
      className="bg-white rounded-2xl border border-stone-200 shadow-2xs overflow-hidden"
    >
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-stone-50/80 border-b border-stone-200 text-[11px] font-bold text-stone-500 uppercase tracking-wider">
              <th className="py-3 px-4 w-14"># Ordem</th>
              <th className="py-3 px-4 w-28">Mídia</th>
              <th className="py-3 px-4">Título & Mensagem</th>
              <th className="py-3 px-4 w-48">Chamadas de Ação</th>
              <th className="py-3 px-4 w-28">Status</th>
              <th className="py-3 px-4 w-28">Atualização</th>
              <th className="py-3 px-4 w-32 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100 text-xs text-stone-700">
            {banners.map((banner) => {
              const media = getMediaItemById(banner.imageMediaId);

              return (
                <tr
                  key={banner.id}
                  className="hover:bg-stone-50/60 transition-colors group"
                >
                  {/* Ordem */}
                  <td className="py-3 px-4 font-mono font-bold text-stone-500">
                    #{banner.order}
                  </td>

                  {/* Mídia */}
                  <td className="py-3 px-4">
                    {media ? (
                      <img
                        src={media.url}
                        alt={media.altText || banner.title}
                        referrerPolicy="no-referrer"
                        className="w-16 h-10 object-cover rounded-lg border border-stone-200"
                      />
                    ) : (
                      <div className="w-16 h-10 rounded-lg bg-stone-100 border border-stone-200 flex items-center justify-center text-stone-400">
                        <ImageIcon className="w-4 h-4" />
                      </div>
                    )}
                  </td>

                  {/* Título & Subtítulo */}
                  <td className="py-3 px-4">
                    <div
                      onClick={() => onPreview(banner)}
                      className="font-bold text-stone-900 group-hover:text-stone-700 transition-colors line-clamp-1 cursor-pointer"
                    >
                      {banner.title}
                    </div>
                    {banner.subtitle && (
                      <div className="text-[11px] text-stone-500 line-clamp-1 mt-0.5">
                        {banner.subtitle}
                      </div>
                    )}
                  </td>

                  {/* Chamadas de Ação (Buttons) */}
                  <td className="py-3 px-4">
                    <div className="space-y-1">
                      {banner.primaryButtonLabel && (
                        <div className="flex items-center gap-1 text-[11px] text-stone-800 truncate font-medium">
                          <ArrowUpRight className="w-3 h-3 text-stone-400 shrink-0" />
                          <span className="truncate">{banner.primaryButtonLabel}</span>
                        </div>
                      )}
                      {banner.secondaryButtonLabel && (
                        <div className="flex items-center gap-1 text-[11px] text-stone-500 truncate">
                          <ArrowUpRight className="w-3 h-3 text-stone-400 shrink-0" />
                          <span className="truncate">{banner.secondaryButtonLabel}</span>
                        </div>
                      )}
                      {!banner.primaryButtonLabel && !banner.secondaryButtonLabel && (
                        <span className="text-stone-400 italic text-[11px]">Sem botões</span>
                      )}
                    </div>
                  </td>

                  {/* Status */}
                  <td className="py-3 px-4">
                    <BannerStatusBadge status={banner.status} size="sm" />
                  </td>

                  {/* Data */}
                  <td className="py-3 px-4 font-mono text-[11px] text-stone-400">
                    {formatBannerDate(banner.updatedAt || banner.createdAt)}
                  </td>

                  {/* Ações */}
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        type="button"
                        onClick={() => onPreview(banner)}
                        className="p-1.5 text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
                        title="Visualizar"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => onEdit(banner)}
                        className="p-1.5 text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
                        title="Editar"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => onDuplicate(banner)}
                        className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
                        title="Duplicar"
                      >
                        <Copy className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => onDelete(banner)}
                        className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                        title="Excluir"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
