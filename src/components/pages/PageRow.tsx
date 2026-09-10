import React, { useState, useRef, useEffect } from 'react';
import {
  Home,
  Layers,
  MoreHorizontal,
  Pencil,
  Eye,
  Copy,
  Archive,
  Trash2,
  ExternalLink,
  ArrowUp,
  ArrowDown,
  Check,
  Globe,
  Clock,
} from 'lucide-react';
import { Page, PageStatus } from '../../types';
import { PageStatusBadge } from './PageStatusBadge';

interface PageRowProps {
  page: Page;
  index: number;
  totalCount: number;
  onEdit: (page: Page) => void;
  onPreview: (page: Page) => void;
  onDuplicate: (page: Page) => void;
  onSetAsHome: (pageId: string) => void;
  onChangeStatus: (pageId: string, status: PageStatus) => void;
  onMoveUp?: (index: number) => void;
  onMoveDown?: (index: number) => void;
  onDelete: (page: Page) => void;
}

export const PageRow: React.FC<PageRowProps> = ({
  page,
  index,
  totalCount,
  onEdit,
  onPreview,
  onDuplicate,
  onSetAsHome,
  onChangeStatus,
  onMoveUp,
  onMoveDown,
  onDelete,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Fecha menu ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  const sectionCount = page.sections?.length || 0;

  return (
    <>
      {/* Visualização Desktop (Tabela) */}
      <tr className="hidden md:table-row hover:bg-stone-50/80 transition-colors border-b border-stone-200/70 group">
        {/* Coluna 1: Página (Título, Slug, Badge Home, Ordem) */}
        <td className="py-3.5 px-4">
          <div className="flex items-center gap-3">
            {/* Controles de Ordenação sutil */}
            <div className="flex flex-col items-center gap-0.5 opacity-40 group-hover:opacity-100 transition-opacity">
              <button
                type="button"
                disabled={index === 0}
                onClick={() => onMoveUp && onMoveUp(index)}
                className="p-0.5 hover:text-amber-700 disabled:opacity-20 disabled:hover:text-stone-400 rounded transition-colors"
                title="Mover para cima"
              >
                <ArrowUp className="w-3 h-3" />
              </button>
              <button
                type="button"
                disabled={index === totalCount - 1}
                onClick={() => onMoveDown && onMoveDown(index)}
                className="p-0.5 hover:text-amber-700 disabled:opacity-20 disabled:hover:text-stone-400 rounded transition-colors"
                title="Mover para baixo"
              >
                <ArrowDown className="w-3 h-3" />
              </button>
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-stone-900 group-hover:text-amber-900 transition-colors truncate">
                  {page.title}
                </span>

                {page.isHome && (
                  <span
                    className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-800 bg-amber-100/80 border border-amber-300/80 px-2 py-0.5 rounded-md shrink-0 shadow-2xs"
                    title="Página Inicial do Site"
                  >
                    <Home className="w-3 h-3 text-amber-700" />
                    <span>Página Inicial</span>
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 text-xs text-stone-500 font-mono mt-0.5">
                <span className="text-stone-400">{page.slug}</span>
              </div>
            </div>
          </div>
        </td>

        {/* Coluna 2: Status */}
        <td className="py-3.5 px-4 whitespace-nowrap">
          <PageStatusBadge status={page.status} size="sm" />
        </td>

        {/* Coluna 3: Estrutura (Seções) */}
        <td className="py-3.5 px-4 whitespace-nowrap">
          <div className="flex items-center gap-1.5 text-xs text-stone-600 font-medium">
            <Layers className="w-3.5 h-3.5 text-stone-400" />
            <span>
              {sectionCount} {sectionCount === 1 ? 'seção' : 'seções'}
            </span>
          </div>
        </td>

        {/* Coluna 4: Atualização */}
        <td className="py-3.5 px-4 whitespace-nowrap text-xs text-stone-500">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-stone-400" />
            <span>{page.updatedAt}</span>
          </div>
        </td>

        {/* Coluna 5: Ações */}
        <td className="py-3.5 px-4 whitespace-nowrap text-right">
          <div className="flex items-center justify-end gap-1.5">
            <button
              type="button"
              onClick={() => onEdit(page)}
              className="inline-flex items-center gap-1 text-xs font-semibold text-stone-700 hover:text-amber-900 bg-stone-100 hover:bg-amber-100/70 border border-stone-200 hover:border-amber-300 px-2.5 py-1.5 rounded-lg transition-colors shadow-2xs"
            >
              <Pencil className="w-3.5 h-3.5" />
              <span>Editar</span>
            </button>

            {/* Menu Suspenso de Ações */}
            <div className="relative" ref={menuRef}>
              <button
                type="button"
                onClick={() => setIsMenuOpen((prev) => !prev)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-stone-500 hover:text-stone-900 hover:bg-stone-100 border border-transparent hover:border-stone-200 transition-colors"
                title="Mais opções"
                aria-label="Mais opções"
              >
                <MoreHorizontal className="w-4 h-4" />
              </button>

              {isMenuOpen && (
                <div className="absolute right-0 top-full mt-1 w-52 bg-white rounded-xl shadow-lg border border-stone-200 py-1.5 z-30 text-xs text-stone-700 animate-in fade-in zoom-in-95 duration-100">
                  <button
                    type="button"
                    onClick={() => {
                      setIsMenuOpen(false);
                      onPreview(page);
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-stone-50 flex items-center gap-2"
                  >
                    <Eye className="w-3.5 h-3.5 text-stone-500" />
                    <span>Visualizar prévia</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setIsMenuOpen(false);
                      onDuplicate(page);
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-stone-50 flex items-center gap-2"
                  >
                    <Copy className="w-3.5 h-3.5 text-stone-500" />
                    <span>Duplicar página</span>
                  </button>

                  {!page.isHome && (
                    <button
                      type="button"
                      onClick={() => {
                        setIsMenuOpen(false);
                        onSetAsHome(page.id);
                      }}
                      className="w-full text-left px-3 py-2 hover:bg-amber-50 text-amber-900 flex items-center gap-2 font-medium"
                    >
                      <Home className="w-3.5 h-3.5 text-amber-600" />
                      <span>Definir como inicial</span>
                    </button>
                  )}

                  <div className="my-1 border-t border-stone-100" />

                  {page.status !== 'published' && (
                    <button
                      type="button"
                      onClick={() => {
                        setIsMenuOpen(false);
                        onChangeStatus(page.id, 'published');
                      }}
                      className="w-full text-left px-3 py-2 hover:bg-emerald-50 text-emerald-800 flex items-center gap-2"
                    >
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Publicar página</span>
                    </button>
                  )}

                  {page.status !== 'draft' && (
                    <button
                      type="button"
                      onClick={() => {
                        setIsMenuOpen(false);
                        onChangeStatus(page.id, 'draft');
                      }}
                      className="w-full text-left px-3 py-2 hover:bg-amber-50 text-amber-800 flex items-center gap-2"
                    >
                      <Clock className="w-3.5 h-3.5 text-amber-600" />
                      <span>Mudar para rascunho</span>
                    </button>
                  )}

                  {page.status !== 'archived' && (
                    <button
                      type="button"
                      onClick={() => {
                        setIsMenuOpen(false);
                        onChangeStatus(page.id, 'archived');
                      }}
                      className="w-full text-left px-3 py-2 hover:bg-stone-50 text-stone-600 flex items-center gap-2"
                    >
                      <Archive className="w-3.5 h-3.5 text-stone-500" />
                      <span>Arquivar página</span>
                    </button>
                  )}

                  {!page.isHome && (
                    <>
                      <div className="my-1 border-t border-stone-100" />
                      <button
                        type="button"
                        onClick={() => {
                          setIsMenuOpen(false);
                          onDelete(page);
                        }}
                        className="w-full text-left px-3 py-2 hover:bg-red-50 text-red-600 flex items-center gap-2 font-medium"
                      >
                        <Trash2 className="w-3.5 h-3.5 text-red-500" />
                        <span>Excluir página</span>
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </td>
      </tr>

      {/* Visualização Mobile (Card) */}
      <tr className="md:hidden">
        <td colSpan={5} className="p-0">
          <div className="p-4 border-b border-stone-200 bg-white space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-sm font-bold text-stone-900">
                    {page.title}
                  </span>
                  {page.isHome && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                      <Home className="w-3 h-3 text-amber-700" />
                      <span>Inicial</span>
                    </span>
                  )}
                </div>
                <div className="text-xs font-mono text-stone-500 mt-0.5">
                  {page.slug}
                </div>
              </div>

              <PageStatusBadge status={page.status} size="sm" />
            </div>

            <div className="flex items-center justify-between text-xs text-stone-500 pt-1 border-t border-stone-100">
              <div className="flex items-center gap-1">
                <Layers className="w-3.5 h-3.5 text-stone-400" />
                <span>{sectionCount} {sectionCount === 1 ? 'seção' : 'seções'}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-stone-400" />
                <span>{page.updatedAt}</span>
              </div>
            </div>

            <div className="flex items-center justify-between gap-2 pt-2">
              <button
                type="button"
                onClick={() => onEdit(page)}
                className="flex-1 inline-flex items-center justify-center gap-1.5 text-xs font-semibold text-stone-800 bg-stone-100 hover:bg-stone-200 border border-stone-200 py-2 rounded-lg"
              >
                <Pencil className="w-3.5 h-3.5" />
                <span>Editar</span>
              </button>

              <button
                type="button"
                onClick={() => onPreview(page)}
                className="inline-flex items-center justify-center gap-1 text-xs font-semibold text-stone-700 bg-white hover:bg-stone-50 border border-stone-200 px-3 py-2 rounded-lg"
                title="Visualizar prévia"
              >
                <Eye className="w-3.5 h-3.5" />
                <span className="sr-only">Prévia</span>
              </button>

              <button
                type="button"
                onClick={() => onDuplicate(page)}
                className="inline-flex items-center justify-center gap-1 text-xs font-semibold text-stone-700 bg-white hover:bg-stone-50 border border-stone-200 px-3 py-2 rounded-lg"
                title="Duplicar"
              >
                <Copy className="w-3.5 h-3.5" />
                <span className="sr-only">Duplicar</span>
              </button>

              {!page.isHome && (
                <button
                  type="button"
                  onClick={() => onSetAsHome(page.id)}
                  className="inline-flex items-center justify-center gap-1 text-xs font-semibold text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200 px-3 py-2 rounded-lg"
                  title="Definir como inicial"
                >
                  <Home className="w-3.5 h-3.5" />
                  <span className="sr-only">Tornar Inicial</span>
                </button>
              )}

              {!page.isHome && (
                <button
                  type="button"
                  onClick={() => onDelete(page)}
                  className="inline-flex items-center justify-center text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 px-3 py-2 rounded-lg"
                  title="Excluir"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span className="sr-only">Excluir</span>
                </button>
              )}
            </div>
          </div>
        </td>
      </tr>
    </>
  );
};
