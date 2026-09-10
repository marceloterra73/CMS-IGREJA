import React from 'react';
import { Church, Heart, Shield, Award, UserCheck } from 'lucide-react';
import {
  BlockInstance,
  ImageFieldData,
  InstitutionalContent,
  RichTextFieldData,
} from '../../../types';

export interface PublicBlockProps {
  block: BlockInstance;
  institutional?: InstitutionalContent;
  onNavigatePage?: (pageIdOrSlug: string) => void;
}

export const PublicAboutBlock: React.FC<PublicBlockProps> = ({
  block,
  institutional,
}) => {
  const data = (block.data || {}) as Record<string, unknown>;

  const title = (data.title as string) || 'Nossa História e Visão';

  // Conteúdo textual
  let contentText = '';
  if (typeof data.content === 'string') {
    contentText = data.content;
  } else if (data.content && typeof data.content === 'object') {
    contentText = (data.content as RichTextFieldData).rawText || '';
  }

  if (!contentText) {
    contentText =
      institutional?.profile?.description ||
      'Somos uma comunidade de fé comprometida com o Evangelho, o discipulado bíblico e o serviço ao próximo. Nossa missão é glorificar a Deus através de relacionamentos profundos, proclamação da verdade e transformação social.';
  }

  const featuredImage = data.featuredImage as ImageFieldData | string | undefined;
  const imageUrl =
    typeof featuredImage === 'string'
      ? featuredImage
      : featuredImage?.url ||
        'https://images.unsplash.com/photo-1543807535-eceef0bc6599?auto=format&fit=crop&w=1000&q=80';

  return (
    <div
      data-block-id={block.id}
      className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center"
    >
      {/* Coluna Visual / Imagem */}
      <div className="lg:col-span-5">
        <div className="relative rounded-2xl overflow-hidden shadow-lg border border-stone-200 group">
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-80 sm:h-96 object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-linear-to-t from-stone-900/60 via-transparent to-transparent" />

          {institutional?.profile?.leadPastor && (
            <div className="absolute bottom-4 left-4 right-4 p-3 rounded-xl bg-white/95 backdrop-blur-xs border border-stone-200/80 text-stone-900 text-xs shadow-md">
              <div className="flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-amber-600" />
                <span className="font-semibold text-stone-800">
                  Liderança Pastoral:
                </span>
                <span className="text-stone-600 font-medium">
                  {institutional.profile.leadPastor}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Coluna Textual */}
      <div className="lg:col-span-7 space-y-5">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 uppercase tracking-wider">
            <Church className="w-4 h-4" />
            <span>Identidade Eclesiástica</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-bold text-stone-900 tracking-tight font-serif">
            {title}
          </h2>
        </div>

        <div className="prose prose-stone text-stone-600 text-sm sm:text-base leading-relaxed space-y-3">
          <p>{contentText}</p>
        </div>

        {/* Pilares Institucionais */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200">
            <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center mb-2">
              <Heart className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-bold text-stone-900">Comunhão</h4>
            <p className="text-[11px] text-stone-500 mt-0.5">
              Cuidado pastoral e acolhimento familiar.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200">
            <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center mb-2">
              <Shield className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-bold text-stone-900">Doutrina</h4>
            <p className="text-[11px] text-stone-500 mt-0.5">
              {institutional?.profile?.denomination || 'Fidelidade bíblica e expositiva.'}
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200">
            <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center mb-2">
              <Award className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-bold text-stone-900">Missão</h4>
            <p className="text-[11px] text-stone-500 mt-0.5">
              {institutional?.profile?.foundingYear
                ? `Servindo desde ${institutional.profile.foundingYear}`
                : 'Impactando vidas e nossa cidade.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
