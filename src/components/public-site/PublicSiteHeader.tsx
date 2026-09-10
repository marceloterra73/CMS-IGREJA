import React, { useState } from 'react';
import {
  Church,
  Menu as MenuIcon,
  X,
  ChevronDown,
  ExternalLink,
  MapPin,
  Clock,
} from 'lucide-react';
import {
  InstitutionalContent,
  NavigationItem,
  NavigationMenu,
} from '../../types';

interface PublicSiteHeaderProps {
  menu?: NavigationMenu;
  institutional?: InstitutionalContent;
  currentPageId?: string;
  currentPageSlug?: string;
  onNavigatePage?: (pageIdOrSlug: string) => void;
}

export const PublicSiteHeader: React.FC<PublicSiteHeaderProps> = ({
  menu,
  institutional,
  currentPageId,
  currentPageSlug,
  onNavigatePage,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

  const churchName = institutional?.profile?.name || 'Igreja Batista Central';
  const tagline = institutional?.profile?.tagline || 'Comunhão, Adoração e Missão';
  const logoUrl = institutional?.profile?.logoUrl;

  // Filtrar e ordenar itens de menu de primeiro nível
  const navItems = (menu?.items || [])
    .filter((item) => item.isVisible !== false)
    .sort((a, b) => a.order - b.order);

  const handleItemClick = (item: NavigationItem) => {
    setMobileMenuOpen(false);
    setOpenDropdownId(null);

    if (item.target?.type === 'page') {
      if (onNavigatePage) {
        onNavigatePage(item.target.pageId);
      }
    } else if (item.target?.type === 'external' || item.isExternal || item.url) {
      const url = item.target?.type === 'external' ? item.target.url : item.url;
      if (url) {
        if (item.openInNewTab) {
          window.open(url, '_blank', 'noopener,noreferrer');
        } else {
          window.location.href = url;
        }
      }
    }
  };

  const isItemActive = (item: NavigationItem) => {
    if (item.target?.type === 'page') {
      return (
        item.target.pageId === currentPageId ||
        item.target.pageId === currentPageSlug
      );
    }
    return false;
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-stone-200 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo e Nome da Igreja */}
          <div
            className="flex items-center gap-3 cursor-pointer group select-none"
            onClick={() => onNavigatePage && onNavigatePage('page_home')}
          >
            {logoUrl ? (
              <img
                src={logoUrl}
                alt={churchName}
                className="w-10 h-10 object-contain rounded-xl"
              />
            ) : (
              <div className="w-10 h-10 rounded-xl bg-amber-800 text-amber-100 flex items-center justify-center shadow-xs group-hover:bg-amber-900 transition-colors">
                <Church className="w-5 h-5" />
              </div>
            )}
            <div>
              <span className="block text-base font-bold text-stone-900 font-serif tracking-tight leading-tight group-hover:text-amber-800 transition-colors">
                {churchName}
              </span>
              <span className="block text-[11px] text-stone-500 font-medium tracking-normal leading-tight">
                {tagline}
              </span>
            </div>
          </div>

          {/* Navegação Desktop */}
          <nav className="hidden md:flex items-center gap-1.5" aria-label="Menu Principal">
            {navItems.map((item) => {
              const hasChildren = item.children && item.children.length > 0;
              const active = isItemActive(item);

              if (hasChildren) {
                const isOpen = openDropdownId === item.id;
                return (
                  <div
                    key={item.id}
                    className="relative"
                    onMouseEnter={() => setOpenDropdownId(item.id)}
                    onMouseLeave={() => setOpenDropdownId(null)}
                  >
                    <button
                      type="button"
                      onClick={() => handleItemClick(item)}
                      className={`inline-flex items-center gap-1 px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                        active
                          ? 'text-amber-900 bg-amber-50 font-bold'
                          : 'text-stone-700 hover:text-stone-900 hover:bg-stone-100'
                      }`}
                    >
                      <span>{item.label}</span>
                      <ChevronDown className="w-3.5 h-3.5 text-stone-400" />
                    </button>

                    {isOpen && (
                      <div className="absolute top-full left-0 mt-1 w-52 py-1.5 rounded-xl bg-white border border-stone-200 shadow-lg z-50 animate-in fade-in-50">
                        {item.children
                          ?.filter((sub) => sub.isVisible !== false)
                          .sort((a, b) => a.order - b.order)
                          .map((sub) => (
                            <button
                              key={sub.id}
                              type="button"
                              onClick={() => handleItemClick(sub)}
                              className="w-full text-left px-3.5 py-2 text-xs text-stone-700 hover:bg-amber-50 hover:text-amber-900 font-medium transition-colors flex items-center justify-between"
                            >
                              <span>{sub.label}</span>
                              {sub.isExternal && (
                                <ExternalLink className="w-3 h-3 text-stone-400" />
                              )}
                            </button>
                          ))}
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleItemClick(item)}
                  className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                    active
                      ? 'text-amber-900 bg-amber-50 font-bold'
                      : 'text-stone-700 hover:text-stone-900 hover:bg-stone-100'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Ação / Contato Rápido Desktop */}
          <div className="hidden lg:flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                if (onNavigatePage) onNavigatePage('page_schedule');
              }}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-900 bg-amber-100/70 hover:bg-amber-100 px-3.5 py-2 rounded-xl transition-colors cursor-pointer"
            >
              <Clock className="w-3.5 h-3.5 text-amber-800" />
              <span>Horários dos Cultos</span>
            </button>
          </div>

          {/* Botão Mobile Menu Hamburger */}
          <div className="flex md:hidden items-center">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
              aria-label="Abrir menu de navegação"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <MenuIcon className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Drawer de Navegação Mobile */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-stone-200 bg-white px-4 pt-3 pb-6 space-y-2 shadow-xl animate-in slide-in-from-top-2">
          {navItems.map((item) => (
            <div key={item.id} className="space-y-1">
              <button
                type="button"
                onClick={() => handleItemClick(item)}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-colors flex items-center justify-between ${
                  isItemActive(item)
                    ? 'bg-amber-50 text-amber-900 font-bold'
                    : 'text-stone-800 hover:bg-stone-50'
                }`}
              >
                <span>{item.label}</span>
                {item.isExternal && (
                  <ExternalLink className="w-3.5 h-3.5 text-stone-400" />
                )}
              </button>

              {item.children && item.children.length > 0 && (
                <div className="pl-4 space-y-1 border-l-2 border-amber-200 ml-3">
                  {item.children
                    .filter((sub) => sub.isVisible !== false)
                    .sort((a, b) => a.order - b.order)
                    .map((sub) => (
                      <button
                        key={sub.id}
                        type="button"
                        onClick={() => handleItemClick(sub)}
                        className="w-full text-left px-3 py-1.5 text-xs text-stone-600 hover:text-amber-900 hover:bg-stone-50 rounded-lg transition-colors"
                      >
                        {sub.label}
                      </button>
                    ))}
                </div>
              )}
            </div>
          ))}

          <div className="pt-4 border-t border-stone-100">
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                if (onNavigatePage) onNavigatePage('page_schedule');
              }}
              className="w-full py-2.5 px-4 rounded-xl bg-amber-800 text-white font-semibold text-xs text-center flex items-center justify-center gap-2"
            >
              <Clock className="w-4 h-4" />
              <span>Ver Horários dos Cultos</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
