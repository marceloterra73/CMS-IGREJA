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
  {
    key: 'churchflow',
    label: 'ChurchFlow',
    icon: Church,
  },
  {
    key: 'dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
  },
  {
    key: 'pages',
    label: 'Páginas',
    icon: FileText,
  },
  {
    key: 'media',
    label: 'Mídia',
    icon: ImageIcon,
  },
  {
    key: 'events',
    label: 'Eventos',
    icon: Calendar,
  },
  {
    key: 'settings',
    label: 'Configurações',
    icon: Settings,
  },
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
        ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }
        lg:translate-x-0
        fixed inset-y-0 left-0 z-40
        flex w-64 flex-col
        border-r bg-white
        transition-transform
        ${isCollapsed ? 'lg:w-20' : 'lg:w-64'}
      `}
    >
      <div className="flex h-16 items-center justify-between border-b px-4">
        {!isCollapsed && (
          <div className="font-bold">ChurchFlow</div>
        )}

        <button
          tipo="botão"
          ao clicar={emFecharMóvel}
          rótulo de ária="Menu Fechar"
        >
          <X tamanho={20} />
        </botão>
      </dividir>

      <navegação nome sim classe="flex-1 espaço-y-1 p-3">
        {itens.mapa(({ chave, rótulo, ícone: Ícone }) => (
          <botão
            chave={chave}
            tipo="botão"
            ao clicar={() => onSelectSeção(chave)}
            nome sim classe={`
              flex w-itens completos-lacuna central-3
              arredondado-lg px-3 py-2 texto à escala
              ${
                sessão atual === chave
                  ? 'fonte bg-slate-100-semibold'
                  : ''
              }
            `}
          >
            <Ícone tamanho={20} />

            {!está colapsado && <extensão>{rótulo}</extensão>}
          </botão>
        ))}
      </navegação>

      {onToggleCollapse && (
        <botão
          tipo="botão"
          ao clicar={onToggleColapse}
          rótulo de ária="Menu alternativo"
          nome sim classe="m-3 oculto lg:flex"
        >
          <ChevronEsquerda tamanho={20} />
        </botão>
      )}
    </separado>
  );
};

exportar padrão Barra lateral;
