import React from 'react';
import {
  CheckCircle2,
  Globe,
  ShieldCheck,
  Search,
  BarChart3,
  Palette,
  Lock,
} from 'lucide-react';

export const SiteStatusCard: React.FC = () => {
  const statusItems = [
    {
      key: 'site',
      label: 'SITE',
      statusText: 'Online',
      detail: 'Publicado & Acessível publicamente',
      icon: Globe,
      statusColor: 'text-emerald-700 bg-emerald-50 border-emerald-200',
      dotColor: 'bg-emerald-500',
    },
    {
      key: 'domain',
      label: 'DOMÍNIO',
      statusText: 'Configurado',
      detail: 'igrejabatistacentral.com.br',
      icon: ShieldCheck,
      statusColor: 'text-emerald-700 bg-emerald-50 border-emerald-200',
      dotColor: 'bg-emerald-500',
    },
    {
      key: 'ssl',
      label: 'SSL',
      statusText: 'Ativo',
      detail: 'Certificado TLS 1.3 Seguro',
      icon: Lock,
      statusColor: 'text-emerald-700 bg-emerald-50 border-emerald-200',
      dotColor: 'bg-emerald-500',
    },
    {
      key: 'seo',
      label: 'SEO',
      statusText: 'Configurado',
      detail: 'Meta tags e Open Graph ativos',
      icon: Search,
      statusColor: 'text-emerald-700 bg-emerald-50 border-emerald-200',
      dotColor: 'bg-emerald-500',
    },
    {
      key: 'theme',
      label: 'TEMA',
      statusText: 'Ativo',
      detail: 'Contemporâneo Suave (Fase 8)',
      icon: Palette,
      statusColor: 'text-emerald-700 bg-emerald-50 border-emerald-200',
      dotColor: 'bg-emerald-500',
    },
    {
      key: 'analytics',
      label: 'ANALYTICS',
      statusText: 'Configurado',
      detail: 'GA4 (G-87123910) Ativo',
      icon: BarChart3,
      statusColor: 'text-emerald-700 bg-emerald-50 border-emerald-200',
      dotColor: 'bg-emerald-500',
    },
  ];

  return (
    <div id="site-status-card" className="bg-white p-5 rounded-xl border border-stone-200 shadow-xs">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-sm font-bold text-stone-900 tracking-tight">
            Status do Site
          </h2>
          <p className="text-xs text-stone-500">
            Visão consolidada dos serviços e infraestrutura
          </p>
        </div>
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          100% Operacional
        </span>
      </div>

      <div className="space-y-2.5">
        {statusItems.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.key}
              className="flex items-center justify-between p-2.5 rounded-lg bg-stone-50/80 border border-stone-100 text-xs hover:bg-stone-50 transition-colors"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-7 h-7 rounded-md bg-white border border-stone-200 flex items-center justify-center text-stone-700 shrink-0">
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0">
                  <div className="text-[10px] font-bold tracking-wider text-stone-400 uppercase">
                    {item.label}
                  </div>
                  <div className="text-xs font-medium text-stone-700 truncate">
                    {item.detail}
                  </div>
                </div>
              </div>

              <div className="shrink-0 ml-2">
                <span
                  className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2 py-0.5 rounded-full border ${item.statusColor}`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${item.dotColor}`} />
                  {item.statusText}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
        <span>Última sincronização: há 4 minutos</span>
        <span className="font-mono text-[11px] text-stone-400">Tenant: ib_central</span>
      </div>
    </div>
  );
};
