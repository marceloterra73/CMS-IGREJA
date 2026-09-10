import React, { useState, useEffect } from 'react';
import { AdminShell } from './components/layout/AdminShell';
import { PublicSiteView } from './components/public-site/PublicSiteView';

export default function App() {
  const [viewMode, setViewMode] = useState<'admin' | 'public'>(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.toLowerCase();
      if (
        hash === '#site' ||
        hash === '#public' ||
        hash.startsWith('#/site') ||
        hash.startsWith('#site-preview')
      ) {
        return 'public';
      }
    }
    return 'admin';
  });

  // Ouvir hashchange para suportar navegação direta por URL (#site ou #admin)
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.toLowerCase();
      if (
        hash === '#site' ||
        hash === '#public' ||
        hash.startsWith('#/site') ||
        hash.startsWith('#site-preview')
      ) {
        setViewMode('public');
      } else if (hash === '#admin' || hash === '' || hash === '#') {
        setViewMode('admin');
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleVisitSite = () => {
    window.location.hash = '#site';
    setViewMode('public');
  };

  const handleBackToAdmin = () => {
    window.location.hash = '#admin';
    setViewMode('admin');
  };

  if (viewMode === 'public') {
    return <PublicSiteView onBackToAdmin={handleBackToAdmin} />;
  }

  return <AdminShell onVisitSite={handleVisitSite} />;
}


