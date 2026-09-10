import React from 'react';
import { Clock, MapPin, Edit2, Trash2, Power, Calendar } from 'lucide-react';
import { ChurchSchedule } from '../../types';
import { ScheduleStatusBadge } from './ScheduleStatusBadge';

interface ScheduleTableProps {
  schedules: ChurchSchedule[];
  onEdit: (schedule: ChurchSchedule) => void;
  onDelete: (schedule: ChurchSchedule) => void;
  onToggleStatus: (schedule: ChurchSchedule) => void;
}

export const ScheduleTable: React.FC<ScheduleTableProps> = ({
  schedules,
  onEdit,
  onDelete,
  onToggleStatus,
}) => {
  return (
    <div
      id="schedules-table-container"
      className="bg-white rounded-xl border border-stone-200 shadow-2xs overflow-hidden"
    >
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="bg-stone-50/80 border-b border-stone-200 text-stone-500 font-semibold uppercase tracking-wider text-[11px]">
              <th className="py-3 px-4">Dia da Semana</th>
              <th className="py-3 px-4">Horário</th>
              <th className="py-3 px-4">Culto / Atividade</th>
              <th className="py-3 px-4">Local</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100 text-stone-800">
            {schedules.map((schedule) => {
              const isSunday = schedule.dayOfWeek?.toLowerCase() === 'domingo';

              return (
                <tr
                  key={schedule.id}
                  id={`schedule-row-${schedule.id}`}
                  className={`hover:bg-stone-50/60 transition-colors ${
                    schedule.status === 'inactive' ? 'opacity-70 bg-stone-50/30' : ''
                  }`}
                >
                  {/* Dia da Semana */}
                  <td className="py-3.5 px-4 font-semibold whitespace-nowrap">
                    {schedule.dayOfWeek ? (
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-xs ${
                          isSunday
                            ? 'bg-amber-50 text-amber-800 border-amber-200'
                            : 'bg-stone-100 text-stone-700 border-stone-200'
                        }`}
                      >
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{schedule.dayOfWeek}</span>
                      </span>
                    ) : (
                      <span className="text-stone-400 italic">Geral</span>
                    )}
                  </td>

                  {/* Horário */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span className="inline-flex items-center gap-1.5 font-mono font-bold text-stone-900 bg-stone-100 px-2 py-0.5 rounded-md border border-stone-200">
                      <Clock className="w-3 h-3 text-amber-600" />
                      <span>{schedule.time}</span>
                    </span>
                  </td>

                  {/* Culto / Atividade */}
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-stone-900 leading-tight">
                      {schedule.title}
                    </div>
                    {schedule.description && (
                      <p className="text-[11px] text-stone-500 line-clamp-1 mt-0.5 max-w-md">
                        {schedule.description}
                      </p>
                    )}
                  </td>

                  {/* Local */}
                  <td className="py-3.5 px-4 whitespace-nowrap text-stone-600">
                    {schedule.location ? (
                      <div className="flex items-center gap-1 text-xs">
                        <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                        <span>{schedule.location}</span>
                      </div>
                    ) : (
                      <span className="text-stone-400 italic">Não informado</span>
                    )}
                  </td>

                  {/* Status */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <ScheduleStatusBadge status={schedule.status} size="sm" />
                  </td>

                  {/* Ações */}
                  <td className="py-3.5 px-4 whitespace-nowrap text-right">
                    <div className="inline-flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => onToggleStatus(schedule)}
                        className={`p-1.5 rounded-lg border transition-colors ${
                          schedule.status === 'active'
                            ? 'text-stone-500 hover:text-stone-800 hover:bg-stone-100 border-stone-200'
                            : 'text-emerald-700 hover:bg-emerald-50 border-emerald-200'
                        }`}
                        title={
                          schedule.status === 'active'
                            ? 'Pausar exibição'
                            : 'Ativar exibição'
                        }
                      >
                        <Power className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => onEdit(schedule)}
                        className="p-1.5 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors"
                        title="Editar"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => onDelete(schedule)}
                        className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Excluir"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
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
