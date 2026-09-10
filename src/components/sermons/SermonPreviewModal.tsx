import React from 'react';
import {
  X,
  Calendar,
  User,
  Edit,
  Image as ImageIcon,
  BookOpen,
  Video,
  Headphones,
  ExternalLink,
} from 'lucide-react';
import { ChurchSermon } from '../../types';
import { SermonStatusBadge } from './SermonStatusBadge';
import { formatSermonDate } from './sermonsUtils';
import { INITIAL_DEMO_MEDIA } from '../media/demoMediaData';

interface SermonPreviewModalProps {
  sermon: ChurchSermon | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (sermon: ChurchSermon) => void;
}

export const SermonPreviewModal: React.FC<SermonPreviewModalProps> = ({
  sermon,
  isOpen,
  onClose,
  onEdit,
}) => {
  if (!isOpen || !sermon) return null;

  const thumbnailMedia = sermon.thumbnailMediaId
    ? INITIAL_DEMO_MEDIA.find((m) => m.id === sermon.thumbnailMediaId)
    : null;

  const audioMedia = sermon.audioMediaId
    ? INITIAL_DEMO_MEDIA.find((m) => m.id === sermon.audioMediaId)
    : null;

  const dateFormatted = formatSermonDate(sermon.date);

  // Divide a descrição em parágrafos seguros sem interpretar HTML
  const paragraphs = sermon.description
    ? sermon.description
        .split(/\n\s*\n/)
        .map((p) => p.trim())
        .filter(Boolean)
    : [];

  return (
    <div
      id="modal-sermon-preview-backdrop"
      className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        id="modal-sermon-preview-content"
        className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-stone-200 overflow-hidden my-6 flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Imagem de Capa do Sermão */}
        <div className="relative h-60 sm:h-68 bg-stone-900 overflow-hidden shrink-0">
          {thumbnailMedia ? (
            <img
              src={thumbnailMedia.url}
              alt={thumbnailMedia.altText || sermon.title}
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
            <SermonStatusBadge status={sermon.status} size="md" />
          </div>

          {/* Metadados e Título sobrepostos na capa */}
          <div className="absolute bottom-4 left-4 right-4 text-white space-y-1.5">
            <div className="flex items-center gap-3 text-xs text-stone-300">
              <span className="font-mono text-[11px] opacity-80">/sermoes/{sermon.slug}</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-stone-400" />
                {dateFormatted}
              </span>
            </div>
            <h2 className="text-lg sm:text-2xl font-extrabold text-white leading-tight">
              {sermon.title}
            </h2>
          </div>
        </div>

        {/* Corpo do Sermão com Scroll */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-stone-800">
          {/* Barra de Informações: Pregador e Passagem Bíblica */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 bg-stone-50 rounded-2xl border border-stone-200/80 text-xs sm:text-sm">
            <div className="flex items-center gap-2 font-medium text-stone-900">
              <div className="w-7 h-7 rounded-full bg-stone-200 flex items-center justify-center text-stone-600 font-bold">
                <User className="w-3.5 h-3.5" />
              </div>
              <div>
                <span className="text-[10px] text-stone-400 block font-normal">Ministrado por</span>
                <span>{sermon.preacher}</span>
              </div>
            </div>

            {sermon.scriptureReference && (
              <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-stone-200 text-stone-800 font-medium">
                <BookOpen className="w-4 h-4 text-stone-500" />
                <span>{sermon.scriptureReference}</span>
              </div>
            )}
          </div>

          {/* Mídia Disponível (Vídeo e/ou Áudio) */}
          {(sermon.videoUrl || sermon.audioMediaId) && (
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400">
                Mídias Associadas
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Vídeo */}
                {sermon.videoUrl && (
                  <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 flex flex-col justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                        <Video className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-stone-900">Gravação em Vídeo</div>
                        <div className="text-[11px] text-stone-500 truncate max-w-[200px]">
                          {sermon.videoUrl}
                        </div>
                      </div>
                    </div>

                    <a
                      href={sermon.videoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-1.5 w-full py-2 bg-white hover:bg-stone-100 border border-stone-200 rounded-xl text-xs font-semibold text-stone-800 transition-colors shadow-2xs"
                    >
                      <span>Assistir no reprodutor externo</span>
                      <ExternalLink className="w-3 h-3 text-stone-400" />
                    </a>
                  </div>
                )}

                {/* Áudio */}
                {sermon.audioMediaId && (
                  <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 flex flex-col justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
                        <Headphones className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-stone-900">Mensagem em Áudio</div>
                        <div className="text-[11px] text-stone-500 truncate max-w-[200px]">
                          {audioMedia ? audioMedia.title : 'Gravação de áudio'}
                        </div>
                      </div>
                    </div>

                    <div className="p-2 bg-white rounded-xl border border-stone-200 text-[11px] text-stone-600 flex items-center justify-between">
                      <span className="truncate">
                        {audioMedia ? audioMedia.filename : 'arquivo-audio.mp3'}
                      </span>
                      <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-medium shrink-0">
                        Disponível
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Descrição e Esboço */}
          {paragraphs.length > 0 ? (
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400">
                Resumo e Notas da Mensagem
              </h4>
              <div className="space-y-3 text-sm leading-relaxed text-stone-700">
                {paragraphs.map((para, idx) => (
                  <p key={idx} className="whitespace-pre-line">
                    {para}
                  </p>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-6 text-center text-stone-400 bg-stone-50 rounded-2xl border border-dashed border-stone-200 text-xs">
              Nenhuma descrição textual adicionada para este sermão.
            </div>
          )}
        </div>

        {/* Rodapé do Modal */}
        <div className="p-4 border-t border-stone-200 bg-stone-50/70 flex items-center justify-between">
          <div className="text-xs text-stone-500">
            Cadastrado em {formatSermonDate(sermon.createdAt)}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                onClose();
                onEdit(sermon);
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer"
            >
              <Edit className="w-3.5 h-3.5" />
              <span>Editar Sermão</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-white border border-stone-200 text-stone-700 hover:bg-stone-100 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
            >
              Fechar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
