import React from 'react';
import { Newspaper, Calendar, ArrowRight } from 'lucide-react';
import { BlockInstance } from '../../../types';

export interface PublicNewsBlockProps {
  block: BlockInstance;
}

export const PublicNewsBlock: React.FC<PublicNewsBlockProps> = ({ block }) => {
  const data = (block.data || {}) as Record<string, unknown>;
  const title = (data.title as string) || 'Notícias e Comunicados';
  const subtitle =
    (data.subtitle as string) ||
    'Acompanhe as novidades, avisos importantes e cartas pastorais da congregação.';

  const news = [
    {
      id: 'news_1',
      title: 'Início das Inscrições para o Batismo nas Águas',
      date: '05 de Setembro de 2026',
      category: 'Vida da Igreja',
      excerpt:
        'Aulas preparatórias acontecerão aos domingos antes do culto matutino. Inscreva-se na secretaria.',
    },
    {
      id: 'news_2',
      title: 'Campanha do Agasalho e Arrecadação de Alimentos',
      date: '01 de Setembro de 2026',
      category: 'Ação Social',
      excerpt:
        'Mais de 200 cestas básicas foram entregues às famílias cadastradas na nossa comunidade assistida.',
    },
    {
      id: 'news_3',
      title: 'Carta Pastoral: Vivendo o Amor Fraterno',
      date: '28 de Agosto de 2026',
      category: 'Pastoral',
      excerpt:
        'Reflexão semanal do Pr. Alexandre sobre paciência, perdão e edificação mútua no corpo de Cristo.',
    },
  ];

  return (
    <div data-block-id={block.id} className="space-y-8">
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 uppercase tracking-wider">
          <Newspaper className="w-4 h-4" />
          <span>Informativo</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight font-serif">
          {title}
        </h2>
        <p className="text-stone-600 text-sm leading-relaxed">{subtitle}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {news.map((item) => (
          <article
            key={item.id}
            className="p-6 rounded-2xl bg-white border border-stone-200 shadow-xs flex flex-col justify-between"
          >
            <div className="space-y-2.5">
              <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 uppercase">
                {item.category}
              </span>
              <h3 className="text-base font-bold text-stone-900 leading-snug">
                {item.title}
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                {item.excerpt}
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-stone-100 flex items-center justify-between text-xs text-stone-400">
              <span>{item.date}</span>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};
