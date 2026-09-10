import React from 'react';
import { Clock, MapPin, Calendar, CheckCircle2 } from 'lucide-react';
import { BlockInstance, ChurchSchedule } from '../../../types';
import { INITIAL_DEMO_SCHEDULES } from '../../schedules/demoSchedulesData';

export interface PublicScheduleBlockProps {
  block: BlockInstance;
  schedules?: ChurchSchedule[];
}

export const PublicScheduleBlock: React.FC<PublicScheduleBlockProps> = ({
  block,
  schedules = INITIAL_DEMO_SCHEDULES,
}) => {
  const data = (block.data || {}) as Record<string, unknown>;
  const title = (data.title as string) || 'Programação e Horários dos Cultos';
  const subtitle =
    (data.subtitle as string) ||
    'Venha celebrar a Deus conosco. Nossas portas e corações estão abertos para você e sua família.';

  // Filtrar apenas cultos com status ativo
  const activeSchedules = (schedules || []).filter(
    (s) => s.status === 'active'
  );

  return (
    <div data-block-id={block.id} className="space-y-8">
      {/* Cabeçalho da Seção */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 uppercase tracking-wider">
          <Calendar className="w-4 h-4" />
          <span>Celebrações Semanais</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight font-serif">
          {title}
        </h2>
        <p className="text-stone-600 text-sm leading-relaxed">{subtitle}</p>
      </div>

      {/* Grade de Cultos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {activeSchedules.map((schedule) => (
          <div
            key={schedule.id}
            className="p-6 rounded-2xl bg-white border border-stone-200/90 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
          >
            <div className="space-y-3">
              {/* Badge Dia e Hora */}
              <div className="flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-md bg-amber-50 text-amber-900 border border-amber-200">
                  <Calendar className="w-3.5 h-3.5 text-amber-700" />
                  <span>{schedule.dayOfWeek || 'Domingo'}</span>
                </span>

                <span className="inline-flex items-center gap-1 text-sm font-bold text-stone-900">
                  <Clock className="w-3.5 h-3.5 text-stone-500" />
                  <span>{schedule.time}</span>
                </span>
              </div>

              {/* Título do Culto */}
              <h3 className="text-base font-bold text-stone-900 leading-snug">
                {schedule.title}
              </h3>

              {/* Descrição */}
              {schedule.description && (
                <p className="text-xs text-stone-600 leading-relaxed line-clamp-3">
                  {schedule.description}
                </p>
              )}
            </div>

            {/* Localização */}
            {schedule.location && (
              <div className="pt-4 mt-4 border-t border-stone-100 flex items-center gap-1.5 text-xs text-stone-500">
                <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span className="truncate">{schedule.location}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
