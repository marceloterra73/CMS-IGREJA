import React, { useState } from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { DashboardView } from '../dashboard/DashboardView';
import { ChurchFlowView } from '../church/ChurchFlowView';
import { PlaceholderView } from '../common/PlaceholderView';

export interface AdminShellProps { onVisitSite?: () => void; }

export const AdminShell: React.FC<AdminShellProps> = ({ onVisitSite }) => {
  const [currentSection, setCurrentSection] = useState<any>('dashboard');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const content = currentSection === 'churchflow'
    ? <ChurchFlowView />
    : currentSection === 'dashboard'
      ? <DashboardView onNavigate={(section) => setCurrentSection(section)} />
      : <PlaceholderView sectionKey={currentSection} onBackToDashboard={() => setCurrentSection('dashboard')} />;

  return (
    <div className="min-h-screen bg-stone-100/70 text-stone-900 flex flex-col font-sans">
      <Sidebar currentSection={currentSection} onSelectSection={setCurrentSection} isCollapsed={isSidebarCollapsed} onToggleCollapse={() => setIsSidebarCollapsed(v => !v)} isMobileOpen={isMobileSidebarOpen} onCloseMobile={() => setIsMobileSidebarOpen(false)} />
      <div className={`flex-1 flex flex-col transition-all duration-200 ${isSidebarCollapsed ? 'lg:pl-20' : 'lg:pl-64'}`}>
        <Header tenantName="Igreja Batista Central" isSiteLive={true} onToggleMobileSidebar={() => setIsMobileSidebarOpen(v => !v)} onVisitSite={onVisitSite} />
        <main id="admin-main-content" className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">{content}</main>
        <footer className="bg-white border-t border-stone-200 py-4 px-6 text-xs text-stone-500 mt-auto flex items-center justify-between"><span className="font-semibold text-stone-700">CMS Visual para Igrejas</span><span>ChurchFlow • Modo Cirúrgico Ativo</span></footer>
      </div>
    </div>
  );
};
