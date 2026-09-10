import React, { useState } from 'react';
import { Church, ExternalLink, ChevronDown, Eye, EyeOff, Smartphone, Monitor } from 'lucide-react';
import { NavigationMenu, NavigationItem } from '../../types';

interface NavigationMenuPreviewProps {
  menu: NavigationMenu;
}

export const NavigationMenuPreview: React.FC<NavigationMenuPreviewProps> = ({ menu }) => {
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

  // Filtra apenas itens visíveis para a prévia fiel
  const visibleItems = menu.items.filter((item) => item.isVisible);

  return (
    <div className="bg-stone-50 border border-stone-200 rounded-xl p-4 overflow-hidden">
      <div className="flex items-center justify-between mb-3 pb-2 border-b border-stone-200/80">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">
            Prévia Visual
          </span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-stone-200 text-stone-700 font-medium">
            {menu.location === 'header' && 'Cabeçalho'}
            {menu.location === 'footer' && 'Rodapé'}
            {menu.location === 'mobile_drawer' && 'Gaveta Mobile'}
            {menu.location === 'mobile' && 'Barra Mobile'}
            {menu.location === 'sidebar' && 'Barra Lateral'}
          </span>
        </div>
        <div className="text-[11px] text-stone-400">
          {visibleItems.length} {visibleItems.length === 1 ? 'item visível' : 'itens visíveis'}
        </div>
      </div>

      {/* Renderização da Prévia conforme a localização */}
      {menu.location === 'header' && (
        <div className="bg-white rounded-lg border border-stone-200 px-4 py-3 shadow-xs flex items-center justify-between gap-4 overflow-x-auto">
          {/* Logo Eclesial Fictício */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="w-7 h-7 rounded-md bg-amber-600 text-white flex items-center justify-center">
              <Church className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-stone-900 tracking-tight">
              Igreja Central
            </span>
          </div>

          {/* Links Horizontais */}
          <div className="flex items-center gap-1 shrink-0">
            {visibleItems.length === 0 ? (
              <span className="text-xs text-stone-400 italic">Nenhum item visível no menu</span>
            ) : (
              visibleItems.map((item) => {
                const hasChildren = item.children && item.children.filter((c) => c.isVisible).length > 0;
                const isDropdownOpen = openDropdownId === item.id;

                return (
                  <div key={item.id} className="relative">
                    <button
                      type="button"
                      onClick={() => {
                        if (hasChildren) {
                          setOpenDropdownId(isDropdownOpen ? null : item.id);
                        }
                      }}
                      className={`text-xs px-2.5 py-1.5 rounded-md font-medium flex items-center gap-1 transition-colors ${
                        isDropdownOpen
                          ? 'bg-stone-100 text-amber-700 font-semibold'
                          : 'text-stone-700 hover:text-amber-700 hover:bg-stone-50'
                      }`}
                    >
                      <span>{item.label}</span>
                      {hasChildren && <ChevronDown className="w-3 h-3 opacity-60" />}
                      {item.isExternal && <ExternalLink className="w-2.5 h-2.5 opacity-50" />}
                    </button>

                    {/* Dropdown simulado para itens com filhos */}
                    {hasChildren && isDropdownOpen && (
                      <div className="absolute top-full left-0 mt-1 w-44 bg-white rounded-lg shadow-lg border border-stone-200 py-1.5 z-20 animate-in fade-in zoom-in-95 duration-100">
                        {item.children
                          ?.filter((child) => child.isVisible)
                          .map((child) => (
                            <div
                              key={child.id}
                              className="px-3 py-1.5 text-xs text-stone-700 hover:bg-amber-50 hover:text-amber-800 flex items-center justify-between"
                            >
                              <span>{child.label}</span>
                              {child.isExternal && <ExternalLink className="w-2.5 h-2.5 opacity-40" />}
                            </div>
                          ))}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {menu.location === 'footer' && (
        <div className="bg-stone-900 text-stone-200 rounded-lg p-4 shadow-xs">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-3 border-b border-stone-800">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-amber-500/20 text-amber-400 flex items-center justify-center">
                <Church className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs font-semibold text-white">Igreja Central</span>
            </div>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
              {visibleItems.length === 0 ? (
                <span className="text-xs text-stone-500 italic">Nenhum item no rodapé</span>
              ) : (
                visibleItems.map((item) => (
                  <div key={item.id} className="text-xs text-stone-400 hover:text-white flex items-center gap-1">
                    <span>{item.label}</span>
                    {item.isExternal && <ExternalLink className="w-2.5 h-2.5 opacity-40" />}
                  </div>
                ))
              )}
            </div>
          </div>
          <div className="pt-2 text-[10px] text-stone-500 text-center sm:text-left">
            © 2026 Igreja Batista Central. Todos os direitos reservados.
          </div>
        </div>
      )}

      {(menu.location === 'mobile_drawer' || menu.location === 'mobile') && (
        <div className="max-w-xs mx-auto bg-white rounded-xl border border-stone-300 shadow-md p-3 overflow-hidden">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-stone-100">
            <div className="flex items-center gap-1.5">
              <Smartphone className="w-3.5 h-3.5 text-stone-500" />
              <span className="text-xs font-bold text-stone-800">Navegação Mobile</span>
            </div>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 font-semibold">
              Preview
            </span>
          </div>
          <div className="space-y-1">
            {visibleItems.length === 0 ? (
              <div className="text-xs text-stone-400 italic py-2 text-center">Nenhum item cadastrado</div>
            ) : (
              visibleItems.map((item) => {
                const hasChildren = item.children && item.children.filter((c) => c.isVisible).length > 0;
                return (
                  <div key={item.id} className="text-xs">
                    <div className="py-1.5 px-2 rounded-md hover:bg-stone-50 text-stone-800 font-medium flex items-center justify-between">
                      <span>{item.label}</span>
                      {item.isExternal && <ExternalLink className="w-3 h-3 text-stone-400" />}
                    </div>
                    {hasChildren && (
                      <div className="pl-4 py-1 space-y-1 border-l-2 border-stone-200 ml-2">
                        {item.children
                          ?.filter((c) => c.isVisible)
                          .map((child) => (
                            <div
                              key={child.id}
                              className="text-[11px] py-1 px-2 text-stone-600 hover:text-stone-900 rounded flex items-center justify-between"
                            >
                              <span>{child.label}</span>
                              {child.isExternal && <ExternalLink className="w-2.5 h-2.5 text-stone-400" />}
                            </div>
                          ))}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {menu.location === 'sidebar' && (
        <div className="bg-white rounded-lg border border-stone-200 p-3 max-w-sm">
          <div className="text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-2">
            Links Laterais
          </div>
          <div className="space-y-1">
            {visibleItems.map((item) => (
              <div
                key={item.id}
                className="text-xs px-2.5 py-1.5 rounded-md hover:bg-stone-100 text-stone-700 font-medium flex items-center justify-between"
              >
                <span>{item.label}</span>
                {item.isExternal && <ExternalLink className="w-3 h-3 text-stone-400" />}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
