import React from 'react';
import { Video, Play, Calendar, UserCheck, ArrowRight } from 'lucide-react';
import { BlockInstance } from '../../../types';

export interface PublicSermonsBlockProps {
  block: BlockInstance;
}

export const PublicSermonsBlock: React.FC<PublicSermonsBlockProps> = ({ block }) => {
  const data = (block.data || {}) as Record<string, unknown>;
  const title = (data.title as string) || 'Últimos Sermões e Mensagens';
  const subtitle =
    (data.subtitle as string) ||
    'Ouça a Palavra de Deus ministrada em nossos cultos e seja edificado durante a sua semana.';

  const demoSermons = [
    {
      id: 'sermon_1',
      title: 'A Graça que Transforma e Restaura',
      preacher: 'Pr. Alexandre Mendes',
      series: 'Série Romanos 8',
      date: '06 de Setembro de 2026',
      duration: '48 min',
      thumbnail:
        'https://images.unsplash.com/photo-1519491058846-2675c956160b?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 'sermon_2',
      title: 'Construindo um Lar sobre a Rocha',
      preacher: 'Pr. Marcos Silveira',
      series: 'Famílias Fortes',
      date: '30 de Agosto de 2026',
      duration: '52 min',
      thumbnail:
        'https://images.unsplash.com/photo-1548625361-16a9a0dc1986?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 'sermon_3',
      title: 'O Poder da Oração Persistente',
      preacher: 'Pra. Helena Rocha',
      series: 'Vida de Clamor',
      date: '23 de Agosto de 2026',
      duration: '42 min',
      thumbnail:
        'https://images.unsplash.com/photo-1507692049790-de58290a4334?auto=format&fit=crop&w=600&q=80',
    },
  ];

  return (
    <div data-block-id={block.id} className="space-y-8">
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 uppercase tracking-wider">
          <Video className="w-4 h-4" />
          <span>Acervo de Pregações</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight font-serif">
          {title}
        </h2>
        <p className="text-stone-600 text-sm leading-relaxed">{subtitle}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {demoSermons.map((sermon) => (
          <div
            key={sermon.id}
            className="rounded-2xl bg-white border border-stone-200 overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col group"
          >
            <div className="relative h-44 overflow-hidden bg-stone-900">
              <img
                src={sermon.thumbnail}
                alt={sermon.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-stone-950/40 group-hover:bg-stone-950/20 transition-colors flex items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-white/90 text-stone-900 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <Play className="w-5 h-5 fill-stone-900 translate-x-0.5" />
                </div>
              </div>
              <span className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded bg-stone-950/80 text-white text-[10px] font-mono">
                {sermon.duration}
              </span>
            </div>

            <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700">
                  {sermon.series}
                </span>
                <h3 className="text-sm font-bold text-stone-900 leading-snug">
                  {sermon.title}
                </h3>
              </div>

              <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-500">
                <div className="flex items-center gap-1 text-stone-700 font-medium">
                  <UserCheck className="w-3.5 h-3.5 text-amber-700" />
                  <span>{sermon.preacher}</span>
                </div>
                <span>{sermon.date}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
