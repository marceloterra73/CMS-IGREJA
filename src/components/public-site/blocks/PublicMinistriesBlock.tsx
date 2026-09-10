import React from 'react';
import { Users, Heart, Sparkles, Compass, Shield, BookOpen } from 'lucide-react';
import { BlockInstance } from '../../../types';

export interface PublicMinistriesBlockProps {
  block: BlockInstance;
}

export const PublicMinistriesBlock: React.FC<PublicMinistriesBlockProps> = ({ block }) => {
  const data = (block.data || {}) as Record<string, unknown>;
  const title = (data.title as string) || 'Ministérios e Grupos de Conexão';
  const subtitle =
    (data.subtitle as string) ||
    'Descubra um lugar para servir, crescer e viver em comunidade com pessoas na mesma fase da vida.';

  const demoMinistries = [
    {
      id: 'min_kids',
      name: 'Ministério Infantil — Sementes da Fé',
      leader: 'Diac. Cláudia Mendes',
      description: 'Salas temáticas, ensino bíblico lúdico e segurança para crianças de 0 a 11 anos.',
      icon: Heart,
    },
    {
      id: 'min_youth',
      name: 'Juventude Viva',
      leader: 'Pastor de Jovens Lucas Lima',
      description: 'Células, acampamentos e louvor dinâmico focado em adolescentes e universitários.',
      icon: Sparkles,
    },
    {
      id: 'min_couples',
      name: 'Ministério de Casais & Famílias',
      leader: 'Pr. Alexandre & Pra. Marta',
      description: 'Jantares de casais, cursos pré-matrimoniais e mentoria para o fortalecimento do lar.',
      icon: Users,
    },
    {
      id: 'min_worship',
      name: 'Louvor & Artes Sacras',
      leader: 'Ministro Samuel Costa',
      description: 'Corais, banda congregacional e teatro a serviço da liturgia e adoração comunitária.',
      icon: Compass,
    },
    {
      id: 'min_social',
      name: 'Ação Social — Mãos que Acolhem',
      leader: 'Equipe de Diaconia',
      description: 'Distribuição mensal de cestas básicas, roupas e assistência comunitária às famílias.',
      icon: Shield,
    },
    {
      id: 'min_bible',
      name: 'Escola Bíblica & Discipulado',
      leader: 'Coordenação Teológica',
      description: 'Estudos bíblicos aprofundados, teologia prática e integração para novos membros.',
      icon: BookOpen,
    },
  ];

  return (
    <div data-block-id={block.id} className="space-y-8">
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 uppercase tracking-wider">
          <Users className="w-4 h-4" />
          <span>Vida em Comunidade</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight font-serif">
          {title}
        </h2>
        <p className="text-stone-600 text-sm leading-relaxed">{subtitle}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {demoMinistries.map((min) => {
          const Icon = min.icon;
          return (
            <div
              key={min.id}
              className="p-6 rounded-2xl bg-white border border-stone-200/90 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-800 border border-amber-200 flex items-center justify-center">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-stone-900 leading-snug">
                  {min.name}
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed">
                  {min.description}
                </p>
              </div>

              <div className="pt-3 mt-3 border-t border-stone-100 text-[11px] text-stone-500 font-medium">
                Liderança: <span className="text-stone-800 font-semibold">{min.leader}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
