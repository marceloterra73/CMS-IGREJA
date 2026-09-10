import React, { useState, useRef, useEffect } from 'react';
import {
  MoreVertical,
  Eye,
  Edit2,
  Copy,
  Trash2,
  Lock,
  User,
  Calendar,
  Sparkles,
  Clock,
  CheckCircle2,
  Archive,
} from 'lucide-react';
import { ChurchPrayerRequest, PrayerRequestStatus } from '../../types';
import { PrayerRequestStatusBadge } from './PrayerRequestStatusBadge';
import { formatPrayerDate } from './prayerRequestsUtils';

interface PrayerRequestCardProps {
  request: ChurchPrayerRequest;
  onView: (req: ChurchPrayerRequest) => void;
  onEdit: (req: ChurchPrayerRequest) => void;
  onChangeStatus: (req: ChurchPrayerRequest, newStatus: PrayerRequestStatus) => void;
  onDuplicate: (req: ChurchPrayerRequest) => void;
  onDelete: (req: ChurchPrayerRequest) => void;
}

export const PrayerRequestCard: React.FC<PrayerRequestCardProps> = ({
  request,
  onView,
  onEdit,
  onChangeStatus,
  onDuplicate,
  onDelete,
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const [showStatusSubmenu, setShowStatusSubmenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Fecha o menu suspenso ao clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
        setShowStatusSubmenu(false);
      }
    }
    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMenu]);

  const displayName = request.isAnonymous
    ? 'Pedido Anônimo'
    : request.requesterName?.trim() || 'Solicitante não identificado';

  return (
    <div
      id={`prayer-card-${request.id}`}
      className="bg-white rounded-2xl border border-stone-200 hover:border-stone-300 hover:shadow-md transition-all flex flex-col justify-between p-4 sm:p-5 relative group"
    >
      {/* Topo do Card: Solicitante e Badge de Status */}
      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2 min-w-0">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                request.isAnonymous
                  ? 'bg-stone-100 text-stone-500'
                  : 'bg-stone-900 text-white'
              }`}
            >
              {request.isAnonymous ? (
                <Lock className="w-3.5 h-3.5" />
              ) : (
                <User className="w-3.5 h-3.5" />
              )}
            </div>
            <div className="min-w-0">
              <span
                className={`text-xs sm:text-sm font-bold truncate block ${
                  request.isAnonymous ? 'text-stone-500 italic' : 'text-stone-900'
                }`}
              >
                {displayName}
              </span>
              <div className="flex items-center gap-1.5 text-[11px] text-stone-400 mt-0.5">
                <Calendar className="w-3 h-3" />
                <span>{formatPrayerDate(request.createdAt)}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <PrayerRequestStatusBadge status={request.status} size="sm" />

            {/* Botão de Menu de Ações */}
            <div className="relative" ref={menuRef}>
              <button
                type="button"
                onClick={() => {
                  setShowMenu((prev) => !prev);
                  setShowStatusSubmenu(false);
                }}
                className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
                title="Mais ações"
              >
                <MoreVertical className="w-4 h-4" />
              </button>

              {/* Menu Flutuante */}
              {showMenu && (
                <div className="absolute right-0 top-full mt-1.5 w-48 bg-white rounded-xl shadow-xl border border-stone-200 py-1.5 z-30 text-xs text-stone-700 divide-y divide-stone-100 animate-in fade-in zoom-in-95 duration-100">
                  <div className="py-1">
                    <button
                      type="button"
                      onClick={() => {
                        setShowMenu(false);
                        onView(request);
                      }}
                      className="w-full px-3 py-1.5 flex items-center gap-2 hover:bg-stone-50 text-left cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5 text-stone-500" />
                      <span>Ver detalhes</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowMenu(false);
                        onEdit(request);
                      }}
                      className="w-full px-3 py-1.5 flex items-center gap-2 hover:bg-stone-50 text-left cursor-pointer"
                    >
                      <Edit2 className="w-3.5 h-3.5 text-stone-500" />
                      <span>Editar pedido</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowMenu(false);
                        onDuplicate(request);
                      }}
                      className="w-full px-3 py-1.5 flex items-center gap-2 hover:bg-stone-50 text-left cursor-pointer"
                    >
                      <Copy className="w-3.5 h-3.5 text-stone-500" />
                      <span>Duplicar</span>
                    </button>
                  </div>

                  {/* Submenu de Alterar Status */}
                  <div className="py-1">
                    <div className="px-3 py-1 text-[10px] uppercase font-semibold text-stone-400">
                      Alterar status
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setShowMenu(false);
                        onChangeStatus(request, 'pending');
                      }}
                      className={`w-full px-3 py-1 flex items-center gap-2 hover:bg-amber-50 text-left cursor-pointer ${
                        request.status === 'pending' ? 'font-bold text-amber-700' : 'text-stone-600'
                      }`}
                    >
                      <Clock className="w-3 h-3 text-amber-500" />
                      <span>Pendente</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowMenu(false);
                        onChangeStatus(request, 'praying');
                      }}
                      className={`w-full px-3 py-1 flex items-center gap-2 hover:bg-sky-50 text-left cursor-pointer ${
                        request.status === 'praying' ? 'font-bold text-sky-700' : 'text-stone-600'
                      }`}
                    >
                      <Sparkles className="w-3 h-3 text-sky-500" />
                      <span>Em Oração</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowMenu(false);
                        onChangeStatus(request, 'answered');
                      }}
                      className={`w-full px-3 py-1 flex items-center gap-2 hover:bg-emerald-50 text-left cursor-pointer ${
                        request.status === 'answered' ? 'font-bold text-emerald-700' : 'text-stone-600'
                      }`}
                    >
                      <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                      <span>Respondido</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowMenu(false);
                        onChangeStatus(request, 'archived');
                      }}
                      className={`w-full px-3 py-1 flex items-center gap-2 hover:bg-stone-50 text-left cursor-pointer ${
                        request.status === 'archived' ? 'font-bold text-stone-800' : 'text-stone-600'
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
                        setShowMenu(false);
                        onDelete(request);
                      }}
                      className="w-full px-3 py-1.5 flex items-center gap-2 hover:bg-rose-50 text-rose-600 text-left cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                      <span>Excluir</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Título (se houver) */}
        {request.title && (
          <h3 className="font-semibold text-stone-800 text-xs sm:text-sm mb-1.5 line-clamp-1">
            {request.title}
          </h3>
        )}

        {/* Texto do Pedido (Truncado para privacidade e estética) */}
        <p className="text-xs text-stone-600 line-clamp-3 leading-relaxed mb-4">
          {request.requestText}
        </p>
      </div>

      {/* Rodapé do Card */}
      <div className="pt-3 border-t border-stone-100 flex items-center justify-between gap-2 mt-auto">
        <button
          type="button"
          onClick={() => onView(request)}
          className="text-xs font-semibold text-stone-800 hover:text-stone-900 inline-flex items-center gap-1.5 p-1 rounded-md hover:bg-stone-100 transition-colors cursor-pointer"
        >
          <Eye className="w-3.5 h-3.5 text-stone-500" />
          <span>Ver na íntegra</span>
        </button>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onEdit(request)}
            className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
            title="Editar pedido"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onDelete(request)}
            className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
            title="Excluir pedido"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
