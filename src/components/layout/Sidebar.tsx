import React from 'react';
import { Church, LayoutDashboard, FileText, Image as ImageIcon, Calendar, Settings, X, ChevronLeft, ChevronRight } from 'lucide-react';

export type NavigationKey =
  | 'churchflow'
  | 'dashboard'
  | 'pages'
  | 'media'
  | 'events'
  | 'settings';

type SidebarProps = {
  activeKey: NavigationKey;
  onNavigate: (key: NavigationKey) => void;
  collapsed?: boolean;
  onToggle?: () => void;
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
};

const items: Array<{ key: NavigationKey; label: string; icon: React.ElementType }> = [
  { key: 'churchflow', label: 'ChurchFlow', icon: Church },
  { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { key: 'pages', label: 'Páginas', icon: FileText },
  { key: 'media', label: 'Mídia', icon: ImageIcon },
  { key: 'events', label: 'Eventos', icon: Calendar },
  { key: 'settings', label: 'Configurações', icon: Settings },
];

export default function Sidebar({ activeKey, onNavigate, collapsed = false, onToggle, mobileOpen = false, onCloseMobile }: SidebarProps) {
  return (
    <aside className={`${mobileOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r bg-white transition-transform ${collapsed ? 'md:w-20' : 'md:w-72'}`}>
      <div className="flex h-16 items-center justify-between border-b px-4">
        {!collapsed && <div className="font-bold">ChurchFlow</div>}
        <button type="button" onClick={onCloseMobile} aria-label="Fechar menu"><X size={20} /></button>
      </div>
      <nav className="flex-1 space-y-1 p-3">
        {items.map(({ key, label, icon: Icon }) => (
          <button key={key} type="button" onClick={() => onNavigate(key)} className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left ${activeKey === key ? 'bg-slate-100 font-semibold' : ''}`}>
            <Icon size={20} />
            {!collapsed && <span>{label}</span>}
          </button>
        ))}
      </nav>
      {onToggle && <button type="button" onClick={onToggle} aria-label="Alternar menu" className="m-3 hidden md:flex"><ChevronLeft size={20} /></button>}
    </aside>
  );
}
