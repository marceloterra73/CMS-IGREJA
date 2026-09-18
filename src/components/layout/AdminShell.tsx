import React, { useState } from 'react';
import { Header } from './Header';
import { Sidebar, NavigationKey } from './Sidebar';
import { DashboardView } from '../dashboard/DashboardView';
import { PagesView } from '../pages/PagesView';
import { NavigationView } from '../navigation/NavigationView';
import { MediaView } from '../media/MediaView';
import { FormsView } from '../forms/FormsView';
import { EventsView } from '../events/EventsView';
import { NewsView } from '../news/NewsView';
import { SermonsView } from '../sermons/SermonsView';
import { MinistriesView } from '../ministries/MinistriesView';
import { PrayerRequestsView } from '../prayer-requests/PrayerRequestsView';
import { GalleryView } from '../gallery/GalleryView';
import { LeadersView } from '../leaders/LeadersView';
import { BannersView } from '../banners/BannersView';
import { SettingsView } from '../settings/SettingsView';
import { AppearanceView } from '../appearance/AppearanceView';
import { SEOView } from '../seo/SEOView';
import { DomainsView } from '../domains/DomainsView';
import { AnalyticsView } from '../analytics/AnalyticsView';
import { SchedulesView } from '../schedules/SchedulesView';
import { DonationsView } from '../donations/DonationsView';
import { LiveStreamView } from '../live-stream/LiveStreamView';
import { PlaceholderView } from '../common/PlaceholderView';
import { ChurchFlowView } from '../church/ChurchFlowView';
import {
  BookOpen,
  X,
  CheckCircle2,
  ShieldCheck,
  Building2,
  Lock,
  Layers,
  Sparkles,
} from 'lucide-react';

export interface AdminShellProps {
  onVisitSite?: () => void;
}

export const AdminShell: React.FC<AdminShellProps> = ({ onVisitSite }) => {
  const [currentSection, setCurrentSection] = useState<NavigationKey>('dashboard');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [showDocsModal, setShowDocsModal] = useState(false);

  return (
    <div id="admin-shell-root" className="min-h-screen bg-stone-100/70 text-stone-900 flex flex-col font-sans">
      {/* Sidebar Lateral */}
      <Sidebar
        currentSection={currentSection}
        onSelectSection={(section) => setCurrentSection(section)}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed((prev) => !prev)}
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main Wrapper deslocado pela Sidebar no Desktop */}
      <div
        className={`flex-1 flex flex-col transition-all duration-200 ease-in-out ${
          isSidebarCollapsed ? 'lg:pl-20' : 'lg:pl-64'
        }`}
      >
        {/* Header Superior */}
        <Header
          tenantName="Igreja Batista Central"
          isSiteLive={true}
          onToggleMobileSidebar={() => setIsMobileSidebarOpen((prev) => !prev)}
          onOpenDocs={() => setShowDocsModal(true)}
          onVisitSite={onVisitSite}
        />

        {/* Área de Conteúdo Principal */}
        <main id="admin-main-content" className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {currentSection === 'churchflow' ? (\n            <ChurchFlowView />\n          ) : currentSection === 'dashboard' ? (
            <DashboardView onNavigate={(section) => setCurrentSection(section)} />
          ) : currentSection === 'pages' ? (
            <PagesView />
          ) : currentSection === 'navigation' ? (
            <NavigationView />
          ) : currentSection === 'media' ? (
            <MediaView />
          ) : currentSection === 'banners' ? (
            <BannersView />
          ) : currentSection === 'forms' ? (
            <FormsView />
          ) : currentSection === 'schedule' ? (
            <SchedulesView />
          ) : currentSection === 'events' ? (
            <EventsView />
          ) : currentSection === 'news' ? (
            <NewsView />
          ) : currentSection === 'sermons' ? (
            <SermonsView />
          ) : currentSection === 'livestream' ? (
            <LiveStreamView />
          ) : currentSection === 'ministries' ? (
            <MinistriesView />
          ) : currentSection === 'prayers' ? (
            <PrayerRequestsView />
          ) : currentSection === 'gallery' ? (
            <GalleryView />
          ) : currentSection === 'leaders' ? (
            <LeadersView />
          ) : currentSection === 'donations' ? (
            <DonationsView />
          ) : currentSection === 'appearance' ? (
            <AppearanceView />
          ) : currentSection === 'seo' ? (
            <SEOView />
          ) : currentSection === 'domains' ? (
            <DomainsView />
          ) : currentSection === 'analytics' ? (
            <AnalyticsView />
          ) : currentSection === 'settings' ? (
            <SettingsView />
          ) : (
            <PlaceholderView
              sectionKey={currentSection}
              onBackToDashboard={() => setCurrentSection('dashboard')}
            />
          )}
        </main>

        {/* Rodapé Administrativo */}
        <footer
          id="admin-footer"
          className="bg-white border-t border-stone-200 py-4 px-6 text-xs text-stone-500 mt-auto flex flex-col sm:flex-row items-center justify-between gap-2"
        >
          <div className="flex items-center gap-2">
            <span className="font-semibold text-stone-700">CMS Visual para Igrejas</span>
            <span>•</span>
            <span>Fase 50: Fundação do Site Público / Renderer</span>
          </div>

          <div className="flex items-center gap-3">
            {onVisitSite && (
              <>
                <button
                  type="button"
                  onClick={onVisitSite}
                  className="text-amber-700 hover:text-amber-800 font-semibold cursor-pointer"
                >
                  Visualizar Site Público →
                </button>
                <span>•</span>
              </>
            )}
            <button
              type="button"
              onClick={() => setShowDocsModal(true)}
              className="text-stone-600 hover:text-stone-900 font-medium cursor-pointer"
            >
              Auditoria das Fases 0–23
            </button>
            <span>•</span>
            <span className="font-mono text-[11px] text-stone-400">Modo Cirúrgico Ativo</span>
          </div>
        </footer>
      </div>

      {/* Modal / Drawer de Inspeção da Arquitetura (Fases 0 a 23) */}
      {showDocsModal && (
        <div
          id="docs-modal-backdrop"
          className="fixed inset-0 bg-stone-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4 transition-all"
        >
          <div
            id="docs-modal-card"
            className="bg-white w-full max-w-3xl max-h-[85vh] rounded-2xl shadow-xl border border-stone-200 flex flex-col overflow-hidden"
          >
            <div className="p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-stone-900 text-amber-400 flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-stone-900">
                    Arquitetura e Fundações Consolidadas
                  </h3>
                  <p className="text-xs text-stone-500">
                    Contratos das Fases 0 a 23 100% preservados
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowDocsModal(false)}
                className="p-2 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-5 text-xs">
              <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 text-amber-900">
                <div className="font-semibold mb-1 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-700" />
                  Transição da Fase 23 para a Fase 24
                </div>
                <p className="text-[11px] text-amber-800 leading-relaxed">
                  As Fases 1 a 23 estabeleceram os contratos canônicos imutáveis (Tenant, Blocos, Páginas, Temas, RBAC, Mídia, SEO, Domínios, Formulários e Analytics). A Fase 24 inaugura a camada visual administrativa sem qualquer quebra arquitetural.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 bg-stone-50 rounded-lg border border-stone-200">
                  <div className="font-semibold text-stone-900 mb-1">Isolamento Multi-Tenant</div>
                  <div className="text-[11px] text-stone-500">Isolamento estrito por tenantId em todo o domínio e contratos.</div>
                </div>
                <div className="p-3 bg-stone-50 rounded-lg border border-stone-200">
                  <div className="font-semibold text-stone-900 mb-1">Zero Código Arbitrário</div>
                  <div className="text-[11px] text-stone-500">Proibição de dangerouslySetInnerHTML, eval, Function e scripts livres.</div>
                </div>
                <div className="p-3 bg-stone-50 rounded-lg border border-stone-200">
                  <div className="font-semibold text-stone-900 mb-1">Motor de Páginas & Blocos</div>
                  <div className="text-[11px] text-stone-500">Schemas imutáveis de seções e blocos eclesiais.</div>
                </div>
                <div className="p-3 bg-stone-50 rounded-lg border border-stone-200">
                  <div className="font-semibold text-stone-900 mb-1">Formulários & Analytics</div>
                  <div className="text-[11px] text-stone-500">Contratos declarativos para submissões e telemetria.</div>
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-stone-200 bg-stone-50 flex justify-end">
              <button
                type="button"
                onClick={() => setShowDocsModal(false)}
                className="px-4 py-2 bg-stone-900 text-white rounded-lg text-xs font-semibold hover:bg-stone-800 transition-colors"
              >
                Fechar Painel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
