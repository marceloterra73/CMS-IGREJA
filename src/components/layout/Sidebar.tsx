import React from 'react';
import {
  LayoutDashboard,
  FileText,
  Image as ImageIcon,
  CheckSquare,
  Calendar,
  Newspaper,
  Video,
  Users,
  HeartHandshake,
  Camera,
  Palette,
  Compass,
  Search,
  Globe,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  X,
  Church,
  UserCheck,
  Layers,
  Clock,
  Gift,
  Radio,
} from 'lucide-react';

export type NavigationKey =
  | 'churchflow'\n  | 'dashboard'
  | 'pages'
  | 'media'
  | 'banners'
  | 'forms'
  | 'schedule'
  | 'events'
  | 'news'
  | 'sermons'
  | 'livestream'
  | 'ministries'
  | 'prayers'
  | 'gallery'
  | 'leaders'
  | 'donations'
  | 'appearance'
  | 'navigation'
  | 'seo'
  | 'domains'
  | 'analytics'
  | 'settings';

interface NavItem {
  id: NavigationKey;
  label: string;
  icon: React.ElementType;
  badge?: string;
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

const NAV_GROUPS: NavGroup[] = [
  {
    title: 'PRINCIPAL',
    items: [
      { id: 'churchflow', label: 'ChurchFlow', icon: Church },\n      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    ],
  },
  {
    title: 'CONTEÚDO',
    items: [
      { id: 'pages', label: 'Páginas', icon: FileText, badge: '12' },
      { id: 'media', label: 'Mídia', icon: ImageIcon, badge: '156' },
      { id: 'banners', label: 'Banners', icon: Layers, badge: '6' },
      { id: 'forms', label: 'Formulários', icon: CheckSquare, badge: '24' },
    ],
  },
  {
    title: 'IGREJA',
    items: [
      { id: 'schedule', label: 'Horários & Cultos', icon: Clock },
      { id: 'events', label: 'Eventos', icon: Calendar, badge: '8' },
      { id: 'news', label: 'Notícias', icon: Newspaper },
      { id: 'sermons', label: 'Sermões', icon: Video, badge: '42' },
      { id: 'livestream', label: 'Transmissão ao Vivo', icon: Radio },
      { id: 'ministries', label: 'Ministérios', icon: Users, badge: '10' },
      { id: 'leaders', label: 'Lideranças', icon: UserCheck },
      { id: 'donations', label: 'Doações & PIX', icon: Gift },
      { id: 'prayers', label: 'Pedidos de Oração', icon: HeartHandshake, badge: '5' },
      { id: 'gallery', label: 'Galeria', icon: Camera },
    ],
  },
  {
    title: 'SITE',
    items: [
      { id: 'appearance', label: 'Aparência', icon: Palette },
      { id: 'navigation', label: 'Navegação', icon: Compass },
      { id: 'seo', label: 'SEO', icon: Search },
      { id: 'domains', label: 'Domínios', icon: Globe },
      { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    ],
  },
  {
    title: 'SISTEMA',
    items: [
      { id: 'settings', label: 'Configurações', icon: Settings },
    ],
  },
];

interface SidebarProps {
  currentSection: NavigationKey;
  onSelectSection: (section: NavigationKey) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentSection,
  onSelectSection,
  isCollapsed,
  onToggleCollapse,
  isMobileOpen,
  onCloseMobile,
}) => {
  return (
    <>
      {/* Overlay Backdrop para Mobile */}
      {isMobileOpen && (
        <div
          id="sidebar-mobile-backdrop"
          onClick={onCloseMobile}
          className="fixed inset-0 bg-stone-900/40 backdrop-blur-xs z-40 lg:hidden transition-opacity"
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        id="admin-sidebar"
        className={`
          fixed top-0 bottom-0 left-0 z-50 bg-stone-900 text-stone-300 flex flex-col border-r border-stone-800 transition-all duration-200 ease-in-out
          ${isCollapsed ? 'lg:w-20' : 'lg:w-64'}
          ${isMobileOpen ? 'translate-x-0 w-72' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-stone-800 shrink-0">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-9 h-9 rounded-lg bg-amber-500 text-stone-950 flex items-center justify-center shrink-0 shadow-xs font-bold">
              <Church className="w-5 h-5 text-stone-950" />
            </div>
            {(!isCollapsed || isMobileOpen) && (
              <div className="flex flex-col truncate">
                <span className="font-bold text-sm tracking-tight text-white truncate">
                  CMS Eclesial
                </span>
                <span className="text-[10px] text-stone-400 font-medium tracking-wide truncate">
                  Gestão Visual de Igrejas
                </span>
              </div>
            )}
          </div>

          {/* Botão Fechar no Mobile */}
          <button
            id="btn-close-mobile-sidebar"
            type="button"
            onClick={onCloseMobile}
            className="lg:hidden p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
            aria-label="Fechar menu lateral"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation List */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6 scrollbar-thin scrollbar-thumb-stone-800">
          {NAV_GROUPS.map((group) => (
            <div key={group.title} className="space-y-1">
              {(!isCollapsed || isMobileOpen) && (
                <div className="px-3 text-[10px] font-bold text-stone-500 uppercase tracking-wider mb-2">
                  {group.title}
                </div>
              )}
              {isCollapsed && !isMobileOpen && (
                <div className="w-full h-px bg-stone-800 my-2" />
              )}

              {group.items.map((item) => {
                const IconComponent = item.icon;
                const isActive = currentSection === item.id;

                return (
                  <button
                    key={item.id}
                    id={`nav-item-${item.id}`}
                    type="button"
                    onClick={() => {
                      onSelectSection(item.id);
                      if (isMobileOpen) onCloseMobile();
                    }}
                    title={isCollapsed && !isMobileOpen ? item.label : undefined}
                    className={`
                      w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all group relative
                      ${
                        isActive
                          ? 'bg-amber-500 text-stone-950 font-semibold shadow-xs'
                          : 'text-stone-400 hover:text-stone-100 hover:bg-stone-800/80'
                      }
                      ${isCollapsed && !isMobileOpen ? 'justify-center' : 'justify-between'}
                    `}
                  >
                    <div className="flex items-center gap-3 truncate">
                      <IconComponent
                        className={`w-4 h-4 shrink-0 transition-colors ${
                          isActive
                            ? 'text-stone-950'
                            : 'text-stone-400 group-hover:text-stone-200'
                        }`}
                      />
                      {(!isCollapsed || isMobileOpen) && (
                        <span className="truncate">{item.label}</span>
                      )}
                    </div>

                    {(!isCollapsed || isMobileOpen) && item.badge && (
                      <span
                        className={`
                          text-[10px] px-1.5 py-0.5 rounded-full font-mono font-medium shrink-0
                          ${
                            isActive
                              ? 'bg-stone-950/20 text-stone-950'
                              : 'bg-stone-800 text-stone-400 group-hover:bg-stone-700'
                          }
                        `}
                      >
                        {item.badge}
                      </span>
                    )}

                    {/* Tooltip rápido quando colapsado */}
                    {isCollapsed && !isMobileOpen && (
                      <span className="sr-only">{item.label}</span>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        {/* Footer / Botão de Recolhimento na versão Desktop */}
        <div className="p-3 border-t border-stone-800 hidden lg:flex items-center justify-between">
          <button
            id="btn-toggle-sidebar-collapse"
            type="button"
            onClick={onToggleCollapse}
            className={`
              w-full flex items-center gap-2 p-2 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors text-xs font-medium
              ${isCollapsed ? 'justify-center' : 'justify-start'}
            `}
            title={isCollapsed ? 'Expandir menu lateral' : 'Recolher menu lateral'}
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <>
                <ChevronLeft className="w-4 h-4" />
                <span>Recolher menu</span>
              </>
            )}
          </button>
        </div>
      </aside>
    </>
  );
};
