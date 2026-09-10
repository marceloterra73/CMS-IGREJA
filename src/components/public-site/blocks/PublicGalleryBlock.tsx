import React from 'react';
import { Camera, Image as ImageIcon } from 'lucide-react';
import { BlockInstance } from '../../../types';

export interface PublicGalleryBlockProps {
  block: BlockInstance;
}

export const PublicGalleryBlock: React.FC<PublicGalleryBlockProps> = ({ block }) => {
  const data = (block.data || {}) as Record<string, unknown>;
  const title = (data.title as string) || 'Galeria da Vida Comunitária';
  const subtitle =
    (data.subtitle as string) ||
    'Momentos de batismos, celebrações, ação comunitária e vida em família.';

  const photos = [
    {
      url: 'https://images.unsplash.com/photo-1548625361-16a9a0dc1986?auto=format&fit=crop&w=600&q=80',
      caption: 'Celebração Batismal',
    },
    {
      url: 'https://images.unsplash.com/photo-1519491058846-2675c956160b?auto=format&fit=crop&w=600&q=80',
      caption: 'Louvor Congregacional',
    },
    {
      url: 'https://images.unsplash.com/photo-1543807535-eceef0bc6599?auto=format&fit=crop&w=600&q=80',
      caption: 'Encontro de Famílias',
    },
    {
      url: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=600&q=80',
      caption: 'Ação Social Urbana',
    },
    {
      url: 'https://images.unsplash.com/photo-1507692049790-de58290a4334?auto=format&fit=crop&w=600&q=80',
      caption: 'Juventude Viva',
    },
    {
      url: 'https://images.unsplash.com/photo-1438032005730-c779502df39b?auto=format&fit=crop&w=600&q=80',
      caption: 'Templo Histórico',
    },
  ];

  return (
    <div data-block-id={block.id} className="space-y-8">
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 uppercase tracking-wider">
          <Camera className="w-4 h-4" />
          <span>Registros Fotográficos</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight font-serif">
          {title}
        </h2>
        <p className="text-stone-600 text-sm leading-relaxed">{subtitle}</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {photos.map((photo, i) => (
          <div
            key={i}
            className="group relative rounded-2xl overflow-hidden aspect-4/3 bg-stone-100 border border-stone-200 shadow-2xs"
          >
            <img
              src={photo.url}
              alt={photo.caption}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-linear-to-t from-stone-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3.5">
              <span className="text-xs font-semibold text-white">
                {photo.caption}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
