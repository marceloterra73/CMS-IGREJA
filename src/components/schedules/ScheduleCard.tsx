import React from 'react';
import { Clock, MapPin, Edit2, Trash2, Calendar, Power } from 'lucide-react';
import { ChurchSchedule } from '../../types';
import { ScheduleStatusBadge } from './ScheduleStatusBadge';

interface ScheduleCardProps {
  schedule: ChurchSchedule;
  onEdit: (schedule: ChurchSchedule) => void;
  onDelete: (schedule: ChurchSchedule) => void;
  onToggleStatus: (schedule: ChurchSchedule) => void;
}

export const ScheduleCard: React.FC<ScheduleCardProps> = ({
  schedule,
  onEdit,
  onDelete,
  onToggleStatus,
}) => {
  const isSunday = schedule.dayOfWeek?.toLowerCase() === 'domingo';

  return (
    <div
      id={`schedule-card-${schedule.id}`}
      className={`bg-white rounded-xl border transition-all duration-200 shadow-2xs hover:shadow-md flex flex-col justify-between overflow-hidden ${
        schedule.status === 'active'
          ? 'border-stone-200 hover:border-stone-300'
          : 'border-stone-200/70 opacity-75 bg-stone-50/50'
      }`}
    >
      {/* Top Banner / Dia e Horário */}
      <div className="p-5 pb-4 space-y-3.5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            {schedule.dayOfWeek && (
              <span
                className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-lg border ${
                  isSunday
                    ? 'bg-amber-50 text-amber-800 border-amber-200'
                    : 'bg-stone-100 text-stone-700 border-stone-200'
                }`}
              >
                <Calendar className="w-3.5 h-3.5 shrink-0" />
                <span>{schedule.dayOfWeek}</span>
              </span>
            )}

            <span className="inline-flex items-center gap-1.5 text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-stone-900 text-white shadow-2xs">
              <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>{schedule.time}</span>
            </span>
          </div>

          <ScheduleStatusBadge status={schedule.status} size="sm" />
        </div>

        {/* Título & Descrição */}
        <div className="space-y-1.5">
          <h3 className="text-base font-bold text-stone-900 leading-snug">
            {schedule.title}
          </h3>

          {schedule.location && (
            <div className="flex items-center gap-1.5 text-xs text-stone-600 font-medium">
              <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" />
              <span>{schedule.location}</span>
            </div>
          )}

          {schedule.description && (
            <p className="text-xs text-stone-500 leading-relaxed line-clamp-3 mt-1">
              {schedule.description}
            </p>
          )}
        </div>
      </div>

      {/* Rodapé do Card com Ações */}
      <div className="px-5 py-3 bg-stone-50/80 border-t border-stone-100 flex items-center justify-between gap-2 mt-auto">
        <button
          type="button"
          onClick={() => onToggleStatus(schedule)}
          className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-lg border transition-colors ${
            schedule.status === 'active'
              ? 'text-stone-600 hover:text-stone-900 bg-white hover:bg-stone-50 border-stone-200'
              : 'text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border-emerald-200'
          }`}
          title={
            schedule.status === 'active'
              ? 'Desativar este horário'
              : 'Ativar este horário'
          }
        >
          <Power className="w-3.5 h-3.5" />
          <span>{schedule.status === 'active' ? 'Pausar' : 'Ativar'}</span>
        </button>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onEdit(schedule)}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-stone-700 hover:text-stone-900 hover:bg-stone-200/70 rounded-lg transition-colors"
            title="Editar Horário"
          >
            <Edit2 className="w-3.5 h-3.5" />
            <span>Editar</span>
          </button>

          <button
            type="button"
            onClick={() => onDelete(schedule)}
            className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
            title="Excluir Horário"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
