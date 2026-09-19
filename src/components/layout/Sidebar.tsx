import React from 'react';
import { Church, LayoutDashboard, FileText, Image as ImageIcon, Calendar, Settings, X, ChevronLeft, ChevronRight } from 'lucide-react';

export type NavigationKey =
  | 'churchflow'
  | 'dashboard'
  | 'pages'
  | 'media'
  | 'events'
  | 'settings';

interface SidebarProps {
  currentSection: NavigationKey;
  onSelectSection: (section: NavigationKey) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

const items = [
  { id: 'churchflow' as NavigationKey, label: 'ChurchFlow', icon: Church },
  { id: 'dashboard' as NavigationKey, label: 'Dashboard', icon: LayoutDashboard },
  { id: 'pages' as NavigationKey, label: 'Páginas', icon: FileText },
  { id: 'media' as NavigationKey, label: 'Mídia', icon: ImageIcon },
  { id: 'events' as NavigationKey, label: 'Eventos', icon: Calendar },
  { id: 'settings' as NavigationKey, label: 'Configurações', icon: Settings },
];

export const Sidebar: React.FC<SidebarProps> = ({ currentSection, onSelectSection, isCollapsed, onToggleCollapse, isMobileOpen, onCloseMobile }) => (
  <>
    {isMobileOpen && <div className="fixed inset-0 z-40 bg-stone-900/40 lg:hidden" onClick={onCloseMobile} />}
    <aside className={`fixed inset-y-0 left-0 z-50 flex flex-col bg-stone-900 text-stone-300 border-r border-stone-800 transition-all ${isCollapsed ? 'lg:w-20' : 'lg:w-64'} ${isMobileOpen ? 'w-72 translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
      <div className="h-16 flex items-center justify-between px-4 border-b border-stone-800">
        <div className="flex items-center gap-3"><div className="w-9 h-9 rounded-lg bg-amber-500 flex items-center justify-center"><Church className="w-5 h-5 text-stone-950" /></div>{(!isCollapsed || isMobileOpen) && <span className="font-bold text-white">CMS Eclesial</span>}</div>
        <button onClick={onCloseMobile} className="lg:hidden"><X className="w-5 h-5" /></button>
      </div>
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {items.map(({ id, label, icon: Icon }) => <button key={id} onClick={() => { onSelectSection(id); onCloseMobile(); }} title={isCollapsed ? label : undefined} className={`w-full flex items-center gap-3 rounded-lg px-3 py-2 text-xs ${currentSection === id ? 'bg-amber-500 text-stone-950 font-semibold' : 'text-stone-400 hover:bg-stone-800 hover:text-white'} ${isCollapsed && !isMobileOpen ? 'justify-center' : ''}`}><Icon className="w-4 h-4 shrink-0" />{(!isCollapsed || isMobileOpen) && <span>{label}</span>}</button>)}
      </nav>
      <div className="hidden lg:block p-3 border-t border-stone-800"><button onClick={onToggleCollapse} className="w-full flex items-center gap-2 p-2 text-xs text-stone-400 hover:text-white">{isCollapsed ? <ChevronRight className="w-4 h-4" /> : <><ChevronLeft className="w-4 h-4" />Recolher menu</>}</button></div>
    </aside>
  </>
);
