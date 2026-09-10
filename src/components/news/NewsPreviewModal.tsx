import React from 'react';
import {
  X,
  Calendar,
  User,
  Clock,
  Edit,
  Image as ImageIcon,
  Share2,
} from 'lucide-react';
import { ChurchNews } from '../../types';
import { NewsStatusBadge } from './NewsStatusBadge';
import { formatNewsDate, estimateReadingTime } from './newsUtils';
import { INITIAL_DEMO_MEDIA } from '../media/demoMediaData';

interface NewsPreviewModalProps {
  news: ChurchNews | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (news: ChurchNews) => void;
}

export const NewsPreviewModal: React.FC<NewsPreviewModalProps> = ({
  news,
  isOpen,
  onClose,
  onEdit,
}) => {
  if (!isOpen || !news) return null;

  const mediaItem = news.imageMediaId
    ? INITIAL_DEMO_MEDIA.find((m) => m.id === news.imageMediaId)
    : null;

  const dateFormatted = formatNewsDate(news.publishedAt || news.createdAt);
  const readingTime = estimateReadingTime(news.content);

  // Divide o conteúdo em parágrafos seguros sem interpretar HTML
  const paragraphs = news.content
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <div
      id="modal-news-preview-backdrop"
      className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        id="modal-news-preview-content"
        className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-stone-200 overflow-hidden my-6 flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Imagem de Capa */}
        <div className="relative h-64 sm:h-72 bg-stone-900 overflow-hidden shrink-0">
          {mediaItem ? (
            <img
              src={mediaItem.url}
              alt={mediaItem.altText || news.title}
              className="w-full h-full object-cover opacity-90"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-stone-500 bg-stone-100">
              <ImageIcon className="w-12 h-12 opacity-30 mb-2" />
              <span className="text-xs font-medium">Sem imagem de capa vinculada</span>
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-transparent" />

          {/* Botão Fechar no Topo Direito */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/50 hover:bg-black/80 backdrop-blur-xs text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Badge de Status no Canto Superior Esquerdo */}
          <div className="absolute top-4 left-4">
            <NewsStatusBadge status={news.status} size="md" />
          </div>

          {/* Metadados e Título sobrepostos na capa */}
          <div className="absolute bottom-4 left-4 right-4 text-white space-y-1.5">
            <div className="flex items-center gap-3 text-xs text-stone-300">
              <span className="font-mono text-[11px] opacity-80">/noticias/{news.slug}</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-stone-400" />
                {readingTime}
              </span>
            </div>
            <h2 className="text-lg sm:text-2xl font-extrabold text-white leading-tight">
              {news.title}
            </h2>
          </div>
        </div>

        {/* Corpo da Notícia */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 flex-1">
          {/* Barra de Autoria e Data */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-stone-100 text-xs text-stone-600">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-stone-100 border border-stone-200 flex items-center justify-center text-stone-600">
                <User className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-wider text-stone-400 font-semibold block">
                  Publicado por
                </span>
                <span className="font-bold text-stone-800">
                  {news.author || 'Equipe Editorial IBC'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-stone-500 bg-stone-50 px-3 py-1.5 rounded-xl border border-stone-200/70">
              <Calendar className="w-3.5 h-3.5 text-stone-400" />
              <span>Data de publicação: <strong>{dateFormatted}</strong></span>
            </div>
          </div>

          {/* Resumo em Destaque */}
          {news.summary && (
            <div className="bg-stone-50 p-4 rounded-2xl border-l-4 border-stone-900 text-xs sm:text-sm text-stone-700 italic leading-relaxed">
              "{news.summary}"
            </div>
          )}

          {/* Conteúdo Completo (Parágrafos Estruturados em Texto Seguro) */}
          <div className="space-y-4 text-xs sm:text-sm text-stone-800 leading-relaxed font-normal">
            {paragraphs.map((para, index) => (
              <p key={index} className="whitespace-pre-line text-justify">
                {para}
              </p>
            ))}
          </div>

          {/* Metadados Técnicos do Contrato */}
          <div className="pt-4 border-t border-stone-100 flex flex-wrap items-center justify-between text-[11px] text-stone-400 gap-2">
            <span>ID Canônico: {news.id}</span>
            <span>Tenant: {news.tenantId}</span>
          </div>
        </div>

        {/* Rodapé de Ações */}
        <div className="bg-stone-50 px-6 py-4 border-t border-stone-200 flex items-center justify-between shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs sm:text-sm font-medium text-stone-700 hover:bg-stone-200 rounded-xl transition-colors cursor-pointer"
          >
            Fechar
          </button>

          <button
            type="button"
            onClick={() => {
              onClose();
              onEdit(news);
            }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-stone-900 text-white rounded-xl text-xs sm:text-sm font-semibold hover:bg-stone-800 transition-colors shadow-xs cursor-pointer"
          >
            <Edit className="w-4 h-4" />
            <span>Editar esta notícia</span>
          </button>
        </div>
      </div>
    </div>
  );
};
