import React from 'react';
import { Award, Mail, Phone, UserCheck } from 'lucide-react';
import { BlockInstance, InstitutionalContent } from '../../../types';

export interface PublicLeadershipBlockProps {
  block: BlockInstance;
  institutional?: InstitutionalContent;
}

export const PublicLeadershipBlock: React.FC<PublicLeadershipBlockProps> = ({
  block,
  institutional,
}) => {
  const data = (block.data || {}) as Record<string, unknown>;
  const title = (data.title as string) || 'Corpo Pastoral e Liderança';
  const subtitle =
    (data.subtitle as string) ||
    'Homens e mulheres vocacionados para o ensino, o pastoreio e o cuidado da congregação.';

  const leadPastor = institutional?.profile?.leadPastor || 'Pr. Alexandre Mendes';

  const leaders = [
    {
      name: leadPastor,
      role: 'Pastor Titular',
      bio: 'Bacharel em Teologia, dedicado há mais de 20 anos ao pastoreio e ensino expositivo das Escrituras.',
      photo:
        'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
    },
    {
      name: 'Pra. Marta Mendes',
      role: 'Pastora Auxiliar & Famílias',
      bio: 'Coordena os ministérios de aconselhamento conjugal, discipulado de mulheres e formação cristã.',
      photo:
        'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    },
    {
      name: 'Pr. Lucas Lima',
      role: 'Pastor de Jovens & Missões',
      bio: 'Responsável pelo engajamento da nova geração, viagens missionárias de curto prazo e evangelismo urbano.',
      photo:
        'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80',
    },
  ];

  return (
    <div data-block-id={block.id} className="space-y-8">
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 uppercase tracking-wider">
          <Award className="w-4 h-4" />
          <span>Equipe Pastoral</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight font-serif">
          {title}
        </h2>
        <p className="text-stone-600 text-sm leading-relaxed">{subtitle}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {leaders.map((leader, i) => (
          <div
            key={i}
            className="p-6 rounded-2xl bg-white border border-stone-200 shadow-xs flex flex-col items-center text-center space-y-4"
          >
            <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-amber-200 shadow-sm">
              <img
                src={leader.photo}
                alt={leader.name}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-stone-900">{leader.name}</h3>
              <p className="text-xs font-semibold text-amber-800 uppercase tracking-wide">
                {leader.role}
              </p>
            </div>
            <p className="text-xs text-stone-600 leading-relaxed max-w-xs">
              {leader.bio}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
