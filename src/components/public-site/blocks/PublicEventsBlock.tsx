import React from 'react';
import { Calendar, MapPin, Clock, ArrowRight } from 'lucide-react';
import { BlockInstance } from '../../../types';

export interface PublicEventsBlockProps {
  block: BlockInstance;
}

export const PublicEventsBlock: React.FC<PublicEventsBlockProps> = ({ block }) => {
  const data = (block.data || {}) as Record<string, unknown>;
  const title = (data.title as string) || 'Próximos Eventos e Conferências';
  const subtitle =
    (data.subtitle as string) ||
    'Participe dos nossos encontros especiais, conferências e momentos de comunhão.';

  const demoEvents = [
    {
      id: 'evt_1',
      title: 'Conferência da Família 2026',
      date: '25 a 27 de Setembro',
      time: '19h30',
      location: 'Templo Sede',
      category: 'Família',
      description: 'Três dias de restauração, palestras e louvor para pais, filhos e casais.',
    },
    {
      id: 'evt_2',
      title: 'Acampamento de Jovens — Geração Viva',
      date: '10 a 12 de Outubro',
      time: 'Saída às 07h00',
      location: 'Sítio Vale da Bênção',
      category: 'Juventude',
      description: 'Comunhão radical, pregações dinâmicas e momentos marcantes com Deus.',
    },
    {
      id: 'evt_3',
      title: 'Congresso de Mulheres — Fé & Graça',
      date: '07 de Novembro',
      time: '14h00 às 21h00',
      location: 'Auditório Principal',
      category: 'Mulheres',
      description: 'Edificação espiritual, testemunhos e ministração com preletoras convidadas.',
    },
  ];

  return (
    <div data-block-id={block.id} className="space-y-8">
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 uppercase tracking-wider">
          <Calendar className="w-4 h-4" />
          <span>Agenda Eclesiástica</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight font-serif">
          {title}
        </h2>
        <p className="text-stone-600 text-sm leading-relaxed">{subtitle}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {demoEvents.map((evt) => (
          <div
            key={evt.id}
            className="p-6 rounded-2xl bg-white border border-stone-200 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
          >
            <div className="space-y-3">
              <span className="inline-block text-[11px] font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full uppercase">
                {evt.category}
              </span>
              <h3 className="text-base font-bold text-stone-900 leading-snug">
                {evt.title}
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                {evt.description}
              </p>
            </div>

            <div className="pt-4 mt-4 border-t border-stone-100 space-y-1.5 text-xs text-stone-500">
              <div className="flex items-center gap-1.5 text-stone-700 font-semibold">
                <Calendar className="w-3.5 h-3.5 text-amber-700" />
                <span>{evt.date}</span>
                <span className="text-stone-400">•</span>
                <span>{evt.time}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-stone-400" />
                <span>{evt.location}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
