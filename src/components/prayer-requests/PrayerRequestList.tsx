import React, { useState, useRef, useEffect } from 'react';
import {
  Eye,
  Edit2,
  Trash2,
  MoreVertical,
  Lock,
  User,
  HeartHandshake,
  Calendar,
  Sparkles,
  Clock,
  CheckCircle2,
  Archive,
  Copy,
  SearchX,
} from 'lucide-react';
import { ChurchPrayerRequest, PrayerRequestStatus } from '../../types';
import { PrayerRequestStatusBadge } from './PrayerRequestStatusBadge';
import { PrayerRequestCard } from './PrayerRequestCard';
import { formatPrayerDate } from './prayerRequestsUtils';
import { PrayerViewMode } from './PrayerRequestsToolbar';

interface PrayerRequestListProps {
  requests: ChurchPrayerRequest[];
  viewMode: PrayerViewMode;
  onView: (req: ChurchPrayerRequest) => void;
  onEdit: (req: ChurchPrayerRequest) => void;
  onChangeStatus: (req: ChurchPrayerRequest, newStatus: PrayerRequestStatus) => void;
  onDuplicate: (req: ChurchPrayerRequest) => void;
  onDelete: (req: ChurchPrayerRequest) => void;
  onResetFilters: () => void;
  isFiltered: boolean;
  onNewRequest: () => void;
}

export const PrayerRequestList: React.FC<PrayerRequestListProps> = ({
  requests,
  viewMode,
  onView,
  onEdit,
  onChangeStatus,
  onDuplicate,
  onDelete,
  onResetFilters,
  isFiltered,
  onNewRequest,
}) => {
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const menuContainerRef = useRef<HTMLDivElement>(null);

  // Fecha o menu de ações da linha ao clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        menuContainerRef.current &&
        !menuContainerRef.current.contains(event.target as Node)
      ) {
        setOpenMenuId(null);
      }
    }
    if (openMenuId) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openMenuId]);

  // Caso não haja registros
  if (requests.length === 0) {
    return (
      <div
        id="prayer-requests-empty-state"
        className="bg-white rounded-3xl border border-stone-200 p-8 sm:p-12 text-center max-w-lg mx-auto my-8 shadow-xs"
      >
        <div className="w-14 h-14 bg-stone-100 text-stone-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
          {isFiltered ? <SearchX className="w-7 h-7" /> : <HeartHandshake className="w-7 h-7" />}
        </div>
        <h3 className="text-base sm:text-lg font-bold text-stone-900 mb-1">
          {isFiltered ? 'Nenhum pedido encontrado' : 'Nenhum pedido de oração registrado'}
        </h3>
        <p className="text-xs sm:text-sm text-stone-500 mb-6 leading-relaxed">
          {isFiltered
            ? 'Não encontramos nenhum pedido de oração com os critérios e filtros atuais. Tente ajustar os termos de busca.'
            : 'Os pedidos de oração e intercessão recebidos pela pastoral da igreja aparecerão nesta área com total sigilo.'}
        </p>
        <div className="flex items-center justify-center gap-3">
          {isFiltered ? (
            <button
              type="button"
              onClick={onResetFilters}
              className="px-4 py-2 bg-stone-900 text-white text-xs sm:text-sm font-semibold rounded-xl hover:bg-stone-800 transition-colors cursor-pointer"
            >
              Limpar todos os filtros
            </button>
          ) : (
            <button
              type="button"
              onClick={onNewRequest}
              className="px-4 py-2 bg-stone-900 text-white text-xs sm:text-sm font-semibold rounded-xl hover:bg-stone-800 transition-colors cursor-pointer"
            >
              Registrar primeiro pedido
            </button>
          )}
        </div>
      </div>
    );
  }

  // Visualização em Cartões (Cards)
  if (viewMode === 'cards') {
    return (
      <div
        id="prayer-requests-cards-grid"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        {requests.map((request) => (
          <PrayerRequestCard
            key={request.id}
            request={request}
            onView={onView}
            onEdit={onEdit}
            onChangeStatus={onChangeStatus}
            onDuplicate={onDuplicate}
            onDelete={onDelete}
          />
        ))}
      </div>
    );
  }

  // Visualização em Tabela (Desktop) + Cards adaptativos para mobile
  return (
    <div id="prayer-requests-table-container" className="space-y-4" ref={menuContainerRef}>
      {/* Tabela para Telas Médias e Grandes */}
      <div className="hidden md:block bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-stone-50/80 border-b border-stone-200 text-stone-500 font-semibold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4 w-60">Solicitante & Título</th>
                <th className="py-3 px-4">Motivo da Intercessão</th>
                <th className="py-3 px-4 w-32">Data</th>
                <th className="py-3 px-4 w-32">Status</th>
                <th className="py-3 px-4 w-28 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-stone-700">
              {requests.map((request) => {
                const isAnon = request.isAnonymous;
                const displayName = isAnon
                  ? 'Pedido Anônimo'
                  : request.requesterName?.trim() || 'Não identificado';

                return (
                  <tr
                    key={request.id}
                    id={`prayer-row-${request.id}`}
                    className="hover:bg-stone-50/80 transition-colors group"
                  >
                    {/* Solicitante & Título */}
                    <td className="py-3.5 px-4 align-top">
                      <div className="flex items-start gap-2.5">
                        <div
                          className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                            isAnon ? 'bg-stone-100 text-stone-500' : 'bg-stone-900 text-white'
                          }`}
                        >
                          {isAnon ? (
                            <Lock className="w-3.5 h-3.5" />
                          ) : (
                            <User className="w-3.5 h-3.5" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <span
                            className={`font-bold block truncate text-xs ${
                              isAnon ? 'text-stone-500 italic' : 'text-stone-900'
                            }`}
                          >
                            {displayName}
                          </span>
                          {request.title ? (
                            <span className="text-[11px] text-stone-600 block truncate font-medium mt-0.5">
                              {request.title}
                            </span>
                          ) : (
                            <span className="text-[10px] text-stone-400 block italic mt-0.5">
                              Sem título informado
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Motivo do Pedido */}
                    <td className="py-3.5 px-4 align-top">
                      <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed max-w-xl">
                        {request.requestText}
                      </p>
                    </td>

                    {/* Data */}
                    <td className="py-3.5 px-4 align-top whitespace-nowrap text-stone-500">
                      <div className="flex items-center gap-1.5 text-[11px]">
                        <Calendar className="w-3 h-3 text-stone-400" />
                        <span>{formatPrayerDate(request.createdAt)}</span>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4 align-top whitespace-nowrap">
                      <PrayerRequestStatusBadge status={request.status} size="sm" />
                    </td>

                    {/* Ações */}
                    <td className="py-3.5 px-4 align-top text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => onView(request)}
                          className="p-1.5 text-stone-400 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
                          title="Ver detalhes do pedido"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onEdit(request)}
                          className="p-1.5 text-stone-400 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
                          title="Editar pedido"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>

                        {/* Menu de Ações Secundárias */}
                        <div className="relative">
                          <button
                            type="button"
                            onClick={() =>
                              setOpenMenuId(openMenuId === request.id ? null : request.id)
                            }
                            className="p-1.5 text-stone-400 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
                            title="Opções"
                          >
                            <MoreVertical className="w-3.5 h-3.5" />
                          </button>

                          {openMenuId === request.id && (
                            <div className="absolute right-0 top-full mt-1 w-44 bg-white rounded-xl shadow-xl border border-stone-200 py-1.5 z-30 text-xs text-left text-stone-700 divide-y divide-stone-100">
                              <div className="py-1">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setOpenMenuId(null);
                                    onDuplicate(request);
                                  }}
                                  className="w-full px-3 py-1.5 flex items-center gap-2 hover:bg-stone-50 cursor-pointer"
                                >
                                  <Copy className="w-3.5 h-3.5 text-stone-400" />
                                  <span>Duplicar pedido</span>
                                </button>
                              </div>

                              <div className="py-1">
                                <div className="px-3 py-1 text-[10px] uppercase font-semibold text-stone-400">
                                  Alterar status
                                </div>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setOpenMenuId(null);
                                    onChangeStatus(request, 'pending');
                                  }}
                                  className={`w-full px-3 py-1 flex items-center gap-2 hover:bg-amber-50 cursor-pointer ${
                                    request.status === 'pending'
                                      ? 'font-bold text-amber-700'
                                      : 'text-stone-600'
                                  }`}
                                >
                                  <Clock className="w-3 h-3 text-amber-500" />
                                  <span>Pendente</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setOpenMenuId(null);
                                    onChangeStatus(request, 'praying');
                                  }}
                                  className={`w-full px-3 py-1 flex items-center gap-2 hover:bg-sky-50 cursor-pointer ${
                                    request.status === 'praying'
                                      ? 'font-bold text-sky-700'
                                      : 'text-stone-600'
                                  }`}
                                >
                                  <Sparkles className="w-3 h-3 text-sky-500" />
                                  <span>Em Oração</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setOpenMenuId(null);
                                    onChangeStatus(request, 'answered');
                                  }}
                                  className={`w-full px-3 py-1 flex items-center gap-2 hover:bg-emerald-50 cursor-pointer ${
                                    request.status === 'answered'
                                      ? 'font-bold text-emerald-700'
                                      : 'text-stone-600'
                                  }`}
                                >
                                  <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                                  <span>Respondido</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setOpenMenuId(null);
                                    onChangeStatus(request, 'archived');
                                  }}
                                  className={`w-full px-3 py-1 flex items-center gap-2 hover:bg-stone-50 cursor-pointer ${
                                    request.status === 'archived'
                                      ? 'font-bold text-stone-800'
                                      : 'text-stone-600'
                                  }`}
                                >
                                  <Archive className="w-3 h-3 text-stone-500" />
                                  <span>Arquivado</span>
                                </button>
                              </div>

                              <div className="py-1">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setOpenMenuId(null);
                                    onDelete(request);
                                  }}
                                  className="w-full px-3 py-1.5 flex items-center gap-2 hover:bg-rose-50 text-rose-600 cursor-pointer"
                                >
                                  <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                                  <span>Excluir</span>
                                </button>
                              </div>
                            </div>
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
      </div>

      {/* Fallback em cartões para visualização mobile no modo tabela */}
      <div className="md:hidden space-y-3">
        {requests.map((request) => (
          <PrayerRequestCard
            key={request.id}
            request={request}
            onView={onView}
            onEdit={onEdit}
            onChangeStatus={onChangeStatus}
            onDuplicate={onDuplicate}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  );
};
