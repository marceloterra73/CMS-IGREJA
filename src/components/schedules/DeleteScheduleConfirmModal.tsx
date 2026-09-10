import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';
import { ChurchSchedule } from '../../types';

interface DeleteScheduleConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  schedule: ChurchSchedule | null;
}

export const DeleteScheduleConfirmModal: React.FC<
  DeleteScheduleConfirmModalProps
> = ({ isOpen, onClose, onConfirm, schedule }) => {
  if (!isOpen || !schedule) return null;

  return (
    <div
      id="delete-schedule-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div
        id="delete-schedule-modal-container"
        className="bg-white rounded-2xl border border-stone-200 shadow-xl max-w-md w-full overflow-hidden"
      >
        <div className="p-5 border-b border-stone-200 flex items-center justify-between gap-3 bg-rose-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center border border-rose-200">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-stone-900">
                Confirmar Exclusão de Horário
              </h2>
              <span className="text-[11px] text-stone-500">
                Esta ação remove o registro da grade de cultos
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-3 text-xs text-stone-600">
          <p>
            Tem certeza de que deseja excluir o horário de culto abaixo?
          </p>

          <div className="p-3.5 rounded-xl border border-stone-200 bg-stone-50 space-y-1">
            <div className="font-bold text-stone-900 text-sm">
              {schedule.title}
            </div>
            <div className="text-stone-500 flex items-center gap-2">
              {schedule.dayOfWeek && <span>{schedule.dayOfWeek}</span>}
              <span>•</span>
              <span className="font-mono font-semibold text-stone-700">
                {schedule.time}
              </span>
              {schedule.location && (
                <>
                  <span>•</span>
                  <span>{schedule.location}</span>
                </>
              )}
            </div>
          </div>

          <p className="text-[11px] text-stone-400">
            O culto deixará de ser listado na página de cultos e blocos de horários do site.
          </p>
        </div>

        <div className="p-4 px-5 border-t border-stone-200 bg-stone-50/80 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900 hover:bg-stone-200/60 rounded-lg transition-colors"
          >
            Cancelar
          </button>

          <button
            type="button"
            onClick={onConfirm}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg transition-colors shadow-xs"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Confirmar Exclusão</span>
          </button>
        </div>
      </div>
    </div>
  );
};
