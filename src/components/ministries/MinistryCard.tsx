import React, { useState } from 'react';
import {
  User,
  MoreVertical,
  Eye,
  Edit,
  Copy,
  Trash2,
  Image as ImageIcon,
  Check,
  Calendar,
} from 'lucide-react';
import { ChurchMinistry, MinistryStatus } from '../../types';
import { MinistryStatusBadge } from './MinistryStatusBadge';
import { formatMinistryDate } from './ministriesUtils';
import { INITIAL_DEMO_MEDIA } from '../media/demoMediaData';

interface MinistryCardProps {
  ministry: ChurchMinistry;
  onPreview: (ministry: ChurchMinistry) => void;
  onEdit: (ministry: ChurchMinistry) => void;
  onDuplicate: (ministry: ChurchMinistry) => void;
  onDelete: (ministry: ChurchMinistry) => void;
  onStatusChange?: (ministry: ChurchMinistry, newStatus: MinistryStatus) => void;
}

export const MinistryCard: React.FC<MinistryCardProps> = ({
  ministry,
  onPreview,
  onEdit,
  onDuplicate,
  onDelete,
  onStatusChange,
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const [copiedSlug, setCopiedSlug] = useState(false);

  // Busca da imagem de capa por imageMediaId na biblioteca demonstrativa
  const mediaItem = React.useMemo(() => {
    if (!ministry.imageMediaId) return null;
    return INITIAL_DEMO_MEDIA.find((m) => m.id === ministry.imageMediaId) || null;
  }, [ministry.imageMediaId]);

  const handleCopySlug = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(ministry.slug);
    setCopiedSlug(true);
    setTimeout(() => setCopiedSlug(false), 2000);
  };

  return (
    <div
      id={`ministry-card-${ministry.id}`}
      className="bg-white rounded-2xl border border-stone-200 shadow-xs hover:shadow-md transition-all flex flex-col overflow-hidden group"
    >
      {/* Imagem de Capa */}
      <div className="relative h-44 bg-stone-100 overflow-hidden">
        {mediaItem ? (
          <img
            src={mediaItem.url}
            alt={mediaItem.altText || ministry.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-stone-400 bg-stone-100 p-4 text-center">
            <ImageIcon className="w-8 h-8 opacity-40 mb-1" />
            <span className="text-[11px] text-stone-400 font-medium">Sem imagem vinculada</span>
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-stone-900/60 via-transparent to-black/20" />

        {/* Status no Canto Superior Direito */}
        <div className="absolute top-3 right-3">
          <MinistryStatusBadge status={ministry.status} />
        </div>

        {/* Menu Flutuante de Ações */}
        <div className="absolute bottom-2 right-2">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu((prev) => !prev);
            }}
            className="w-8 h-8 rounded-lg bg-black/40 hover:bg-black/70 backdrop-blur-xs text-white flex items-center justify-center transition-colors cursor-pointer"
            title="Opções do ministério"
          >
            <MoreVertical className="w-4 h-4" />
          </button>

          {showMenu && (
            <>
              <div
                className="fixed inset-0 z-20"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowMenu(false);
                }}
              />
              <div className="absolute right-0 bottom-9 w-44 bg-white rounded-xl shadow-lg border border-stone-200 py-1.5 z-30 text-xs text-stone-700">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowMenu(false);
                    onPreview(ministry);
                  }}
                  className="w-full px-3 py-1.5 text-left flex items-center gap-2 hover:bg-stone-50 cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5 text-stone-500" />
                  <span>Visualizar</span>
                </button>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowMenu(false);
                    onEdit(ministry);
                  }}
                  className="w-full px-3 py-1.5 text-left flex items-center gap-2 hover:bg-stone-50 cursor-pointer"
                >
                  <Edit className="w-3.5 h-3.5 text-stone-500" />
                  <span>Editar</span>
                </button>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowMenu(false);
                    onDuplicate(ministry);
                  }}
                  className="w-full px-3 py-1.5 text-left flex items-center gap-2 hover:bg-stone-50 cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5 text-stone-500" />
                  <span>Duplicar</span>
                </button>

                {onStatusChange && (
                  <div className="border-t border-stone-100 my-1 pt-1">
                    <div className="px-3 py-1 text-[10px] font-semibold text-stone-400 uppercase tracking-wider">
                      Alterar Status
                    </div>
                    {ministry.status !== 'active' && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowMenu(false);
                          onStatusChange(ministry, 'active');
                        }}
                        className="w-full px-3 py-1 text-left flex items-center gap-2 hover:bg-emerald-50 text-emerald-700 cursor-pointer"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        <span>Marcar Ativo</span>
                      </button>
                    )}
                    {ministry.status !== 'inactive' && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowMenu(false);
                          onStatusChange(ministry, 'inactive');
                        }}
                        className="w-full px-3 py-1 text-left flex items-center gap-2 hover:bg-stone-50 text-stone-600 cursor-pointer"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-stone-400" />
                        <span>Marcar Inativo</span>
                      </button>
                    )}
                  </div>
                )}

                <div className="border-t border-stone-100 my-1 pt-1">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowMenu(false);
                      onDelete(ministry);
                    }}
                    className="w-full px-3 py-1.5 text-left flex items-center gap-2 text-red-600 hover:bg-red-50 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Excluir</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Corpo do Card */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div className="space-y-2">
          {/* Liderança e Data de Criação */}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-stone-500">
            {ministry.leaderName ? (
              <div className="flex items-center gap-1.5 font-medium text-stone-700">
                <User className="w-3.5 h-3.5 text-stone-400" />
                <span className="truncate">{ministry.leaderName}</span>
              </div>
            ) : (
              <span className="text-stone-400 italic text-[11px]">Sem liderança designada</span>
            )}
            {ministry.createdAt && (
              <>
                <span>•</span>
                <div className="flex items-center gap-1 text-[11px] text-stone-400">
                  <Calendar className="w-3 h-3 text-stone-400" />
                  <span>{formatMinistryDate(ministry.createdAt)}</span>
                </div>
              </>
            )}
          </div>

          {/* Nome do Ministério */}
          <h3
            onClick={() => onPreview(ministry)}
            className="font-bold text-stone-900 text-sm sm:text-base leading-snug line-clamp-2 hover:text-stone-700 cursor-pointer transition-colors"
          >
            {ministry.name}
          </h3>

          {/* Descrição resumida */}
          {ministry.description && (
            <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
              {ministry.description}
            </p>
          )}
        </div>

        {/* Rodapé: Slug e Ações Rápidas */}
        <div className="pt-3 border-t border-stone-100 flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={handleCopySlug}
            className="flex items-center gap-1 text-[11px] font-mono text-stone-500 hover:text-stone-800 transition-colors truncate max-w-[150px] cursor-pointer"
            title="Clique para copiar o slug"
          >
            {copiedSlug ? (
              <span className="flex items-center gap-1 text-emerald-600 font-sans font-medium">
                <Check className="w-3 h-3" /> Copiado!
              </span>
            ) : (
              <>
                <span className="truncate">/{ministry.slug}</span>
                <Copy className="w-3 h-3 shrink-0 opacity-60" />
              </>
            )}
          </button>

          <div className="flex items-center gap-1 shrink-0">
            <button
              type="button"
              onClick={() => onPreview(ministry)}
              className="p-1.5 rounded-lg text-stone-600 hover:bg-stone-100 hover:text-stone-900 transition-colors cursor-pointer"
              title="Pré-visualizar ministério"
            >
              <Eye className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => onEdit(ministry)}
              className="p-1.5 rounded-lg text-stone-600 hover:bg-stone-100 hover:text-stone-900 transition-colors cursor-pointer"
              title="Editar ministério"
            >
              <Edit className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
