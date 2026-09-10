import React, { useState } from 'react';
import {
  Calendar,
  User,
  Eye,
  Edit,
  Copy,
  Trash2,
  Image as ImageIcon,
  MoreVertical,
  Clock,
} from 'lucide-react';
import { ChurchNews } from '../../types';
import { NewsStatusBadge } from './NewsStatusBadge';
import { formatNewsDate, estimateReadingTime } from './newsUtils';
import { INITIAL_DEMO_MEDIA } from '../media/demoMediaData';

interface NewsListProps {
  newsList: ChurchNews[];
  onPreview: (news: ChurchNews) => void;
  onEdit: (news: ChurchNews) => void;
  onDuplicate: (news: ChurchNews) => void;
  onDelete: (news: ChurchNews) => void;
  onStatusChange?: (news: ChurchNews, newStatus: ChurchNews['status']) => void;
}

export const NewsList: React.FC<NewsListProps> = ({
  newsList,
  onPreview,
  onEdit,
  onDuplicate,
  onDelete,
  onStatusChange,
}) => {
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  return (
    <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
      {/* Tabela para Desktop e Tablet */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-stone-50/80 border-b border-stone-200 text-stone-500 font-semibold uppercase tracking-wider text-[10px]">
              <th className="py-3 px-4">Notícia</th>
              <th className="py-3 px-4 w-48">Slug</th>
              <th className="py-3 px-4 w-40">Autor</th>
              <th className="py-3 px-4 w-36">Publicação</th>
              <th className="py-3 px-4 w-28">Status</th>
              <th className="py-3 px-4 w-36 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {newsList.map((item) => {
              const mediaItem = item.imageMediaId
                ? INITIAL_DEMO_MEDIA.find((m) => m.id === item.imageMediaId)
                : null;
              const dateFormatted = formatNewsDate(item.publishedAt || item.createdAt);
              const readingTime = estimateReadingTime(item.content);
              const isMenuOpen = activeMenuId === item.id;

              return (
                <tr
                  key={item.id}
                  id={`news-row-${item.id}`}
                  className="hover:bg-stone-50/70 transition-colors group"
                >
                  {/* Detalhes da Notícia com Imagem */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-start gap-3">
                      <div className="w-14 h-11 rounded-lg bg-stone-100 overflow-hidden shrink-0 border border-stone-200 mt-0.5">
                        {mediaItem ? (
                          <img
                            src={mediaItem.url}
                            alt={item.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-stone-400">
                            <ImageIcon className="w-4 h-4 opacity-40" />
                          </div>
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <button
                          type="button"
                          onClick={() => onPreview(item)}
                          className="text-stone-900 font-bold hover:text-stone-700 text-xs sm:text-sm text-left line-clamp-1 block cursor-pointer"
                        >
                          {item.title}
                        </button>
                        {item.summary && (
                          <p className="text-[11px] text-stone-500 line-clamp-1 mt-0.5">
                            {item.summary}
                          </p>
                        )}
                        <span className="text-[10px] text-stone-400 flex items-center gap-1 mt-1">
                          <Clock className="w-3 h-3 text-stone-300" />
                          {readingTime}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Slug */}
                  <td className="py-3.5 px-4">
                    <span className="text-[11px] font-mono text-stone-500 block truncate max-w-[170px]" title={item.slug}>
                      /{item.slug}
                    </span>
                  </td>

                  {/* Autor */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-1.5 text-stone-700 max-w-[140px] truncate">
                      <User className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                      <span className="truncate" title={item.author || 'Redação IBC'}>
                        {item.author || 'Redação IBC'}
                      </span>
                    </div>
                  </td>

                  {/* Data de Publicação */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-1.5 text-stone-600 whitespace-nowrap">
                      <Calendar className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                      <span>{dateFormatted}</span>
                    </div>
                  </td>

                  {/* Status */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <NewsStatusBadge status={item.status} />
                  </td>

                  {/* Ações */}
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <div className="relative inline-flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => onPreview(item)}
                        title="Visualizar notícia"
                        className="p-1.5 text-stone-500 hover:text-stone-900 hover:bg-stone-200/60 rounded-lg transition-colors cursor-pointer"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => onEdit(item)}
                        title="Editar conteúdo"
                        className="p-1.5 text-stone-500 hover:text-stone-900 hover:bg-stone-200/60 rounded-lg transition-colors cursor-pointer"
                      >
                        <Edit className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => onDuplicate(item)}
                        title="Duplicar notícia"
                        className="p-1.5 text-stone-500 hover:text-stone-900 hover:bg-stone-200/60 rounded-lg transition-colors cursor-pointer"
                      >
                        <Copy className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          setActiveMenuId(isMenuOpen ? null : item.id)
                        }
                        title="Mais opções"
                        className="p-1.5 text-stone-500 hover:text-stone-900 hover:bg-stone-200/60 rounded-lg transition-colors cursor-pointer"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>

                      {/* Dropdown Adicional para Linha */}
                      {isMenuOpen && (
                        <div
                          className="absolute right-0 top-8 z-30 w-44 bg-white rounded-xl shadow-xl border border-stone-200 py-1.5 text-xs text-stone-700 text-left animate-in fade-in zoom-in-95 duration-100"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {onStatusChange && (
                            <>
                              <div className="px-3 py-1 text-[10px] font-semibold text-stone-400 uppercase tracking-wider">
                                Mudar status
                              </div>
                              {item.status !== 'published' && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setActiveMenuId(null);
                                    onStatusChange(item, 'published');
                                  }}
                                  className="w-full px-3 py-1.5 hover:bg-emerald-50 text-emerald-700 flex items-center gap-2 cursor-pointer"
                                >
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                  <span>Publicar</span>
                                </button>
                              )}
                              {item.status !== 'draft' && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setActiveMenuId(null);
                                    onStatusChange(item, 'draft');
                                  }}
                                  className="w-full px-3 py-1.5 hover:bg-amber-50 text-amber-700 flex items-center gap-2 cursor-pointer"
                                >
                                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                                  <span>Rascunho</span>
                                </button>
                              )}
                              {item.status !== 'archived' && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setActiveMenuId(null);
                                    onStatusChange(item, 'archived');
                                  }}
                                  className="w-full px-3 py-1.5 hover:bg-stone-100 text-stone-700 flex items-center gap-2 cursor-pointer"
                                >
                                  <span className="w-1.5 h-1.5 rounded-full bg-stone-500" />
                                  <span>Arquivar</span>
                                </button>
                              )}
                              <div className="border-t border-stone-100 my-1" />
                            </>
                          )}

                          <button
                            type="button"
                            onClick={() => {
                              setActiveMenuId(null);
                              onDelete(item);
                            }}
                            className="w-full px-3 py-1.5 hover:bg-rose-50 text-rose-600 flex items-center gap-2 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                            <span>Excluir notícia</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Lista em Cartões para Mobile (< 768px) */}
      <div className="md:hidden divide-y divide-stone-100">
        {newsList.map((item) => {
          const mediaItem = item.imageMediaId
            ? INITIAL_DEMO_MEDIA.find((m) => m.id === item.imageMediaId)
            : null;
          const dateFormatted = formatNewsDate(item.publishedAt || item.createdAt);

          return (
            <div
              key={item.id}
              className="p-4 flex flex-col gap-3 hover:bg-stone-50/50 transition-colors"
            >
              <div className="flex items-start gap-3">
                <div className="w-14 h-14 rounded-xl bg-stone-100 border border-stone-200 overflow-hidden shrink-0">
                  {mediaItem ? (
                    <img
                      src={mediaItem.url}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-stone-400">
                      <ImageIcon className="w-5 h-5 opacity-40" />
                    </div>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <h4
                    className="text-sm font-bold text-stone-900 line-clamp-1 cursor-pointer"
                    onClick={() => onPreview(item)}
                  >
                    {item.title}
                  </h4>
                  <span className="text-[11px] font-mono text-stone-400 block truncate">
                    /{item.slug}
                  </span>
                  <div className="mt-1.5">
                    <NewsStatusBadge status={item.status} size="sm" />
                  </div>
                </div>
              </div>

              {/* Informações Complementares */}
              <div className="text-xs text-stone-600 space-y-1 bg-stone-50 p-2.5 rounded-xl border border-stone-100">
                <div className="flex items-center justify-between text-[11px]">
                  <div className="flex items-center gap-1 text-stone-500 truncate">
                    <User className="w-3 h-3 text-stone-400 shrink-0" />
                    <span className="truncate">{item.author || 'Redação IBC'}</span>
                  </div>
                  <div className="flex items-center gap-1 text-stone-500 shrink-0">
                    <Calendar className="w-3 h-3 text-stone-400" />
                    <span>{dateFormatted}</span>
                  </div>
                </div>
              </div>

              {/* Ações Mobile */}
              <div className="flex items-center justify-end gap-1.5 pt-1">
                <button
                  type="button"
                  onClick={() => onPreview(item)}
                  className="px-2.5 py-1.5 rounded-lg bg-stone-100 text-stone-700 text-xs font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Ver</span>
                </button>

                <button
                  type="button"
                  onClick={() => onEdit(item)}
                  className="px-2.5 py-1.5 rounded-lg bg-stone-900 text-white text-xs font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <Edit className="w-3.5 h-3.5" />
                  <span>Editar</span>
                </button>

                <button
                  type="button"
                  onClick={() => onDuplicate(item)}
                  title="Duplicar"
                  className="p-1.5 rounded-lg bg-stone-100 text-stone-600 cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>

                <button
                  type="button"
                  onClick={() => onDelete(item)}
                  title="Excluir"
                  className="p-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
