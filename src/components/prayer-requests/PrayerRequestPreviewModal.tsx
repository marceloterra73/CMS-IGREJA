import React from 'react';
import {
  X,
  HeartHandshake,
  Lock,
  User,
  Calendar,
  Clock,
  Edit2,
  Copy,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Archive,
} from 'lucide-react';
import { ChurchPrayerRequest, PrayerRequestStatus } from '../../types';
import { PrayerRequestStatusBadge } from './PrayerRequestStatusBadge';
import { formatPrayerDateTime, getPrayerStatusDescription } from './prayerRequestsUtils';

interface PrayerRequestPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  request: ChurchPrayerRequest | null;
  onEdit: (req: ChurchPrayerRequest) => void;
  onChangeStatus: (req: ChurchPrayerRequest, newStatus: PrayerRequestStatus) => void;
  onDuplicate: (req: ChurchPrayerRequest) => void;
}

export const PrayerRequestPreviewModal: React.FC<PrayerRequestPreviewModalProps> = ({
  isOpen,
  onClose,
  request,
  onEdit,
  onChangeStatus,
  onDuplicate,
}) => {
  if (!isOpen || !request) return null;

  const isAnon = request.isAnonymous;
  const displayName = isAnon
    ? 'Pedido Anônimo'
    : request.requesterName?.trim() || 'Solicitante não identificado';

  return (
    <div
      id="prayer-preview-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div className="bg-white rounded-3xl border border-stone-200 shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Cabeçalho do Preview */}
        <div className="px-6 py-5 border-b border-stone-100 flex items-center justify-between bg-stone-50/70 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-stone-900 text-white flex items-center justify-center">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-stone-900">
                  Detalhes do Pedido de Oração
                </h2>
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-stone-500 bg-stone-200/70 px-2 py-0.5 rounded-full">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  Sigilo Pastoral
                </span>
              </div>
              <p className="text-xs text-stone-500">
                Visualização confidencial interna para intercessão e acompanhamento.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-xl transition-colors cursor-pointer"
            title="Fechar visualização"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Corpo com Scroll */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs sm:text-sm">
          {/* Card de Metadados e Solicitante */}
          <div className="bg-stone-50/80 rounded-2xl border border-stone-200 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div
                className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${
                  isAnon ? 'bg-stone-200 text-stone-600' : 'bg-stone-900 text-white shadow-xs'
                }`}
              >
                {isAnon ? <Lock className="w-5 h-5" /> : <User className="w-5 h-5" />}
              </div>
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-400 block">
                  Solicitante
                </span>
                <span
                  className={`text-sm sm:text-base font-bold ${
                    isAnon ? 'text-stone-600 italic' : 'text-stone-900'
                  }`}
                >
                  {displayName}
                </span>
                {isAnon && (
                  <p className="text-[11px] text-stone-500 mt-0.5">
                    O solicitante optou por não ter seu nome divulgado publicamente.
                  </p>
                )}
              </div>
            </div>

            <div className="flex flex-col sm:items-end gap-1 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-stone-200">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-400">
                Status Atual
              </span>
              <PrayerRequestStatusBadge status={request.status} />
              <span className="text-[10px] text-stone-500 max-w-[200px] text-left sm:text-right mt-0.5">
                {getPrayerStatusDescription(request.status)}
              </span>
            </div>
          </div>

          {/* Título do Pedido (se houver) */}
          {request.title && (
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-400 block mb-1">
                Motivo / Assunto
              </span>
              <h3 className="text-base sm:text-lg font-bold text-stone-900 leading-snug">
                {request.title}
              </h3>
            </div>
          )}

          {/* Conteúdo Completo do Pedido de Oração */}
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-400 block mb-2">
              Texto Integral da Oração
            </span>
            <div className="bg-stone-50 rounded-2xl border border-stone-200 p-4 sm:p-5 text-stone-800 leading-relaxed whitespace-pre-wrap font-sans text-xs sm:text-sm">
              {request.requestText}
            </div>
          </div>

          {/* Histórico de Datas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs text-stone-500">
            <div className="flex items-center gap-2 p-3 bg-stone-50/60 rounded-xl border border-stone-200">
              <Calendar className="w-4 h-4 text-stone-400 shrink-0" />
              <div>
                <span className="block font-medium text-stone-700">Data de Envio</span>
                <span>{formatPrayerDateTime(request.createdAt)}</span>
              </div>
            </div>

            {request.updatedAt && (
              <div className="flex items-center gap-2 p-3 bg-stone-50/60 rounded-xl border border-stone-200">
                <Clock className="w-4 h-4 text-stone-400 shrink-0" />
                <div>
                  <span className="block font-medium text-stone-700">Última Atualização</span>
                  <span>{formatPrayerDateTime(request.updatedAt)}</span>
                </div>
              </div>
            )}
          </div>

          {/* Ações de Transição Rápida de Status */}
          <div className="pt-2 border-t border-stone-100">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-400 block mb-2">
              Mudar Status do Pedido
            </span>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => onChangeStatus(request, 'pending')}
                disabled={request.status === 'pending'}
                className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                  request.status === 'pending'
                    ? 'bg-amber-100 text-amber-900 border-amber-300 opacity-60 cursor-default'
                    : 'bg-white text-stone-700 border-stone-200 hover:border-amber-400 hover:bg-amber-50'
                }`}
              >
                <Clock className="w-3.5 h-3.5 text-amber-600" />
                <span>Pendente</span>
              </button>

              <button
                type="button"
                onClick={() => onChangeStatus(request, 'praying')}
                disabled={request.status === 'praying'}
                className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                  request.status === 'praying'
                    ? 'bg-sky-100 text-sky-900 border-sky-300 opacity-60 cursor-default'
                    : 'bg-white text-stone-700 border-stone-200 hover:border-sky-400 hover:bg-sky-50'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-sky-600" />
                <span>Em Oração</span>
              </button>

              <button
                type="button"
                onClick={() => onChangeStatus(request, 'answered')}
                disabled={request.status === 'answered'}
                className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                  request.status === 'answered'
                    ? 'bg-emerald-100 text-emerald-900 border-emerald-300 opacity-60 cursor-default'
                    : 'bg-white text-stone-700 border-stone-200 hover:border-emerald-400 hover:bg-emerald-50'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Respondido</span>
              </button>

              <button
                type="button"
                onClick={() => onChangeStatus(request, 'archived')}
                disabled={request.status === 'archived'}
                className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                  request.status === 'archived'
                    ? 'bg-stone-200 text-stone-800 border-stone-300 opacity-60 cursor-default'
                    : 'bg-white text-stone-700 border-stone-200 hover:border-stone-400 hover:bg-stone-100'
                }`}
              >
                <Archive className="w-3.5 h-3.5 text-stone-500" />
                <span>Arquivado</span>
              </button>
            </div>
          </div>
        </div>

        {/* Rodapé com Ações Principais */}
        <div className="px-6 py-4 border-t border-stone-100 flex items-center justify-between gap-3 bg-stone-50/50 shrink-0">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onDuplicate(request)}
              className="px-3 py-1.5 bg-white border border-stone-200 text-stone-700 hover:bg-stone-100 rounded-xl text-xs font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Criar cópia deste pedido"
            >
              <Copy className="w-3.5 h-3.5 text-stone-500" />
              <span className="hidden sm:inline">Duplicar</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onEdit(request)}
              className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>Editar</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer shadow-xs"
            >
              Fechar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
