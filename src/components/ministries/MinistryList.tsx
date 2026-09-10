import React, { useState } from 'react';
import {
  User,
  Eye,
  Edit,
  Copy,
  Trash2,
  Image as ImageIcon,
  MoreVertical,
  Calendar,
} from 'lucide-react';
import { ChurchMinistry, MinistryStatus } from '../../types';
import { MinistryStatusBadge } from './MinistryStatusBadge';
import { formatMinistryDate } from './ministriesUtils';
import { INITIAL_DEMO_MEDIA } from '../media/demoMediaData';

interface MinistryListProps {
  ministriesList: ChurchMinistry[];
  onPreview: (ministry: ChurchMinistry) => void;
  onEdit: (ministry: ChurchMinistry) => void;
  onDuplicate: (ministry: ChurchMinistry) => void;
  onDelete: (ministry: ChurchMinistry) => void;
  onStatusChange?: (ministry: ChurchMinistry, newStatus: MinistryStatus) => void;
}

export const MinistryList: React.FC<MinistryListProps> = ({
  ministriesList,
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
              <th className="py-3 px-4">Ministério</th>
              <th className="py-3 px-4 w-48">Slug</th>
              <th className="py-3 px-4 w-52">Liderança</th>
              <th className="py-3 px-4 w-32">Data</th>
              <th className="py-3 px-4 w-28">Status</th>
              <th className="py-3 px-4 w-36 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {ministriesList.map((item) => {
              const mediaItem = item.imageMediaId
                ? INITIAL_DEMO_MEDIA.find((m) => m.id === item.imageMediaId)
                : null;
              const dateFormatted = formatMinistryDate(item.updatedAt || item.createdAt);
              const isMenuOpen = activeMenuId === item.id;

              return (
                <tr
                  key={item.id}
                  id={`ministry-row-${item.id}`}
                  className="hover:bg-stone-50/70 transition-colors group"
                >
                  {/* Detalhes do Ministério com Thumbnail */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-start gap-3">
                      <div className="w-14 h-11 rounded-lg bg-stone-100 overflow-hidden shrink-0 border border-stone-200 mt-0.5">
                        {mediaItem ? (
                          <img
                            src={mediaItem.url}
                            alt={item.name}
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
                          className="font-bold text-stone-900 hover:text-stone-700 transition-colors line-clamp-1 cursor-pointer text-left text-xs sm:text-sm"
                        >
                          {item.name}
                        </button>
                        {item.description && (
                          <p className="text-[11px] text-stone-500 line-clamp-1 mt-0.5">
                            {item.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Slug */}
                  <td className="py-3.5 px-4 font-mono text-[11px] text-stone-500 truncate max-w-[190px]">
                    /{item.slug}
                  </td>

                  {/* Liderança */}
                  <td className="py-3.5 px-4 text-stone-700">
                    {item.leaderName ? (
                      <div className="flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                        <span className="truncate font-medium">{item.leaderName}</span>
                      </div>
                    ) : (
                      <span className="text-stone-400 italic text-[11px]">—</span>
                    )}
                  </td>

                  {/* Data */}
                  <td className="py-3.5 px-4 text-stone-600 whitespace-nowrap">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                      <span>{dateFormatted}</span>
                    </div>
                  </td>

                  {/* Status */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <MinistryStatusBadge status={item.status} />
                  </td>

                  {/* Ações */}
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1 relative">
                      <button
                        type="button"
                        onClick={() => onPreview(item)}
                        className="p-1.5 rounded-lg text-stone-500 hover:text-stone-900 hover:bg-stone-100 transition-colors cursor-pointer"
                        title="Pré-visualizar"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => onEdit(item)}
                        className="p-1.5 rounded-lg text-stone-500 hover:text-stone-900 hover:bg-stone-100 transition-colors cursor-pointer"
                        title="Editar"
                      >
                        <Edit className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => onDuplicate(item)}
                        className="p-1.5 rounded-lg text-stone-500 hover:text-stone-900 hover:bg-stone-100 transition-colors cursor-pointer"
                        title="Duplicar"
                      >
                        <Copy className="w-4 h-4" />
                      </button>

                      {/* Menu de Mais Ações */}
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => setActiveMenuId(isMenuOpen ? null : item.id)}
                          className="p-1.5 rounded-lg text-stone-500 hover:text-stone-900 hover:bg-stone-100 transition-colors cursor-pointer"
                          title="Mais opções"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>

                        {isMenuOpen && (
                          <>
                            <div
                              className="fixed inset-0 z-20"
                              onClick={() => setActiveMenuId(null)}
                            />
                            <div className="absolute right-0 top-8 w-44 bg-white rounded-xl shadow-lg border border-stone-200 py-1.5 z-30 text-xs text-left text-stone-700">
                              {onStatusChange && (
                                <>
                                  <div className="px-3 py-1 text-[10px] font-semibold text-stone-400 uppercase tracking-wider">
                                    Alterar Status
                                  </div>
                                  {item.status !== 'active' && (
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setActiveMenuId(null);
                                        onStatusChange(item, 'active');
                                      }}
                                      className="w-full px-3 py-1.5 text-left flex items-center gap-2 hover:bg-emerald-50 text-emerald-700 cursor-pointer"
                                    >
                                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                      <span>Marcar Ativo</span>
                                    </button>
                                  )}
                                  {item.status !== 'inactive' && (
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setActiveMenuId(null);
                                        onStatusChange(item, 'inactive');
                                      }}
                                      className="w-full px-3 py-1.5 text-left flex items-center gap-2 hover:bg-stone-50 text-stone-600 cursor-pointer"
                                    >
                                      <span className="w-1.5 h-1.5 rounded-full bg-stone-400" />
                                      <span>Marcar Inativo</span>
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
                                className="w-full px-3 py-1.5 text-left flex items-center gap-2 text-red-600 hover:bg-red-50 cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>Excluir</span>
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Lista Adaptada para Telas Pequenas (Mobile) */}
      <div className="md:hidden divide-y divide-stone-100">
        {ministriesList.map((item) => {
          const mediaItem = item.imageMediaId
            ? INITIAL_DEMO_MEDIA.find((m) => m.id === item.imageMediaId)
            : null;
          const dateFormatted = formatMinistryDate(item.updatedAt || item.createdAt);

          return (
            <div key={item.id} className="p-4 space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-16 h-12 rounded-lg bg-stone-100 overflow-hidden shrink-0 border border-stone-200">
                  {mediaItem ? (
                    <img
                      src={mediaItem.url}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-stone-400">
                      <ImageIcon className="w-4 h-4 opacity-40" />
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <MinistryStatusBadge status={item.status} size="sm" />
                    <span className="text-[11px] text-stone-400">{dateFormatted}</span>
                  </div>
                  <h4
                    onClick={() => onPreview(item)}
                    className="font-bold text-stone-900 text-sm mt-1 line-clamp-1 hover:text-stone-700 cursor-pointer"
                  >
                    {item.name}
                  </h4>
                  {item.leaderName && (
                    <div className="flex items-center gap-1.5 mt-0.5 text-xs text-stone-600">
                      <User className="w-3 h-3 text-stone-400 shrink-0" />
                      <span className="truncate">{item.leaderName}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Ações Mobile */}
              <div className="flex items-center justify-between pt-2 border-t border-stone-100">
                <span className="text-[11px] font-mono text-stone-400 truncate max-w-[160px]">
                  /{item.slug}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onPreview(item)}
                    className="p-2 rounded-lg text-stone-600 bg-stone-50 hover:bg-stone-100 cursor-pointer"
                    title="Pré-visualizar"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onEdit(item)}
                    className="p-2 rounded-lg text-stone-600 bg-stone-50 hover:bg-stone-100 cursor-pointer"
                    title="Editar"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onDuplicate(item)}
                    className="p-2 rounded-lg text-stone-600 bg-stone-50 hover:bg-stone-100 cursor-pointer"
                    title="Duplicar"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(item)}
                    className="p-2 rounded-lg text-red-600 bg-red-50 hover:bg-red-100 cursor-pointer"
                    title="Excluir"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
