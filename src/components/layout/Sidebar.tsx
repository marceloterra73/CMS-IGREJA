import React from 'react';
import {
  Church,
  LayoutDashboard,
  FileText,
  Image as ImageIcon,
  Calendar,
  Settings,
  X,
  ChevronLeft,
} from 'lucide-react';

export type NavigationKey =
  | 'churchflow'
  | 'dashboard'
  | 'pages'
  | 'media'
  | 'events'
  | 'settings';

type SidebarProps = {
  currentSection: NavigationKey;
  onSelectSection: (key: NavigationKey) => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
};

const items: Array<{
  key: NavigationKey;
  label: string;
  icon: React.ElementType;
}> = [
  { key: 'churchflow', label: 'ChurchFlow', icon: Church },
  { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { key: 'pages', label: 'Páginas', icon: FileText },
  { key: 'media', label: 'Mídia', icon: ImageIcon },
  { key: 'events', label: 'Eventos', icon: Calendar },
  { key: 'settings', label: 'Configurações', icon: Settings },
];

export const Sidebar: React.FC<SidebarProps> = ({
  currentSection,
  onSelectSection,
  isCollapsed = false,
  onToggleCollapse,
  isMobileOpen = false,
  onCloseMobile,
}) => {
  return (
    <aside
      className={`
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0
        fixed inset-y-0 left-0 z-40
        flex w-64 flex-col
        border-r bg-white
        transition-transform
        ${isCollapsed ? 'lg:w-20' : 'lg:w-64'}
      `}
    >
      <div className="flex h-16 items-center justify-between border-b px-4">
        {!isCollapsed && <div className="font-bold">ChurchFlow</div>}
        <button
          type="button"
          onClick={onCloseMobile}
          aria-label="Fechar menu"
        >
          <X size={20} />
        </button>
      </div>

      <nav className="flex-1 space-y-1 p-3">
        {items.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            type="button"
            onClick={() => onSelectSection(key)}
            className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left ${
              currentSection === key ? 'bg-slate-100 font-semibold' : ''
            }`}
          >
            <Icon size={20} />
            {!isCollapsed && <span>{label}</span>}
          </button>
        ))}
      </nav>

      {onToggleCollapse && (
        <button
          type="button"
          onClick={onToggleCollapse}
          aria-label="Alternar menu"
          className="m-3 hidden lg:flex"
        >
          <ChevronLeft size={20} />
        </button>
      )}
    </aside>
  );
};

export default Sidebar;
