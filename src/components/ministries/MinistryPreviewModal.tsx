import React from 'react';
import {
  X,
  User,
  Edit,
  Image as ImageIcon,
  Calendar,
} from 'lucide-react';
import { ChurchMinistry } from '../../types';
import { MinistryStatusBadge } from './MinistryStatusBadge';
import { formatMinistryDate } from './ministriesUtils';
import { INITIAL_DEMO_MEDIA } from '../media/demoMediaData';

interface MinistryPreviewModalProps {
  ministry: ChurchMinistry | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (ministry: ChurchMinistry) => void;
}

export const MinistryPreviewModal: React.FC<MinistryPreviewModalProps> = ({
  ministry,
  isOpen,
  onClose,
  onEdit,
}) => {
  if (!isOpen || !ministry) return null;

  const imageMedia = ministry.imageMediaId
    ? INITIAL_DEMO_MEDIA.find((m) => m.id === ministry.imageMediaId)
    : null;

  const dateFormatted = formatMinistryDate(ministry.createdAt || ministry.updatedAt);

  // Divide a descrição em parágrafos seguros sem interpretar HTML
  const paragraphs = ministry.description
    ? ministry.description
        .split(/\n\s*\n/)
        .map((p) => p.trim())
        .filter(Boolean)
    : [];

  return (
    <div
      id="modal-ministry-preview-backdrop"
      className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        id="modal-ministry-preview-content"
        className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-stone-200 overflow-hidden my-6 flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Imagem de Capa do Ministério */}
        <div className="relative h-60 sm:h-68 bg-stone-900 overflow-hidden shrink-0">
          {imageMedia ? (
            <img
              src={imageMedia.url}
              alt={imageMedia.altText || ministry.name}
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
            <MinistryStatusBadge status={ministry.status} size="md" />
          </div>

          {/* Metadados e Nome sobrepostos na capa */}
          <div className="absolute bottom-4 left-4 right-4 text-white space-y-1.5">
            <div className="flex items-center gap-3 text-xs text-stone-300">
              <span className="font-mono text-[11px] opacity-80">/ministerios/{ministry.slug}</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-stone-400" />
                {dateFormatted}
              </span>
            </div>
            <h2 className="text-lg sm:text-2xl font-extrabold text-white leading-tight">
              {ministry.name}
            </h2>
          </div>
        </div>

        {/* Corpo do Ministério com Scroll */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-stone-800">
          {/* Barra de Informações: Liderança Responsável */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 bg-stone-50 rounded-2xl border border-stone-200/80 text-xs sm:text-sm">
            <div className="flex items-center gap-2.5 font-medium text-stone-900">
              <div className="w-8 h-8 rounded-full bg-stone-200 flex items-center justify-center text-stone-600 font-bold">
                <User className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] text-stone-400 block font-normal">
                  Liderança Responsável
                </span>
                <span className="font-semibold text-stone-900">
                  {ministry.leaderName || 'Liderança não informada'}
                </span>
              </div>
            </div>

            <div className="text-xs text-stone-500 font-mono">
              Status:{' '}
              <strong className={ministry.status === 'active' ? 'text-emerald-700' : 'text-stone-600'}>
                {ministry.status === 'active' ? 'Ativo' : 'Inativo'}
              </strong>
            </div>
          </div>

          {/* Descrição e Apresentação do Ministério */}
          {paragraphs.length > 0 ? (
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400">
                Sobre o Ministério
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
              Nenhuma descrição textual adicionada para este ministério.
            </div>
          )}
        </div>

        {/* Rodapé do Modal */}
        <div className="p-4 border-t border-stone-200 bg-stone-50/70 flex items-center justify-between">
          <div className="text-xs text-stone-500">
            Cadastrado em {formatMinistryDate(ministry.createdAt)}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                onClose();
                onEdit(ministry);
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer"
            >
              <Edit className="w-3.5 h-3.5" />
              <span>Editar Ministério</span>
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
