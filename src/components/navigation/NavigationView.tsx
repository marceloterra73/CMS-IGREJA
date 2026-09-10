import React, { useState, useMemo, useEffect } from 'react';
import {
  Compass,
  Plus,
  Layers,
  Sparkles,
  Search,
  ExternalLink,
  ChevronRight,
  MoreVertical,
  CheckCircle2,
  Clock,
  Archive,
  Trash2,
  Copy,
  Pencil,
  AlertCircle,
} from 'lucide-react';
import { NavigationMenu, MenuLocation, NavigationMenuStatus, Page } from '../../types';
import { INITIAL_DEMO_MENUS } from './demoNavigationData';
import { INITIAL_DEMO_PAGES } from '../pages/demoPagesData';
import { cmsRepository } from '../../core/persistence';
import { NewMenuModal } from './NewMenuModal';
import { DeleteMenuConfirmModal } from './DeleteMenuConfirmModal';
import { ManageMenuView } from './ManageMenuView';

export const NavigationView: React.FC = () => {
  // Estado persistido canonicamente dos menus
  const [menus, setMenus] = useState<NavigationMenu[]>(() => cmsRepository.loadMenus());
  const [selectedMenuId, setSelectedMenuId] = useState<string | null>(null);

  // Páginas do CMS persistidas
  const [availablePages] = useState<Page[]>(() => cmsRepository.loadPages());

  // Sincroniza alterações nos menus localmente
  useEffect(() => {
    cmsRepository.saveMenus(menus);
  }, [menus]);

  // Busca e filtros
  const [searchQuery, setSearchQuery] = useState('');
  const [locationFilter, setLocationFilter] = useState<string>('all');

  // Modais
  const [isNewMenuModalOpen, setIsNewMenuModalOpen] = useState(false);
  const [menuPendingDelete, setMenuPendingDelete] = useState<NavigationMenu | null>(null);

  // Toast de feedback visual
  const [feedbackToast, setFeedbackToast] = useState<string | null>(null);

  const showNotification = (message: string) => {
    setFeedbackToast(message);
    setTimeout(() => {
      setFeedbackToast(null);
    }, 3500);
  };

  // Helper de localização amigável
  const getLocationLabel = (loc: MenuLocation): string => {
    switch (loc) {
      case 'header':
        return 'Cabeçalho';
      case 'footer':
        return 'Rodapé';
      case 'mobile_drawer':
        return 'Menu Mobile (Gaveta)';
      case 'mobile':
        return 'Barra Mobile';
      case 'sidebar':
        return 'Barra Lateral';
      default:
        return loc;
    }
  };

  // Helper para contagem total de itens (incluindo sub-itens)
  const getTotalItemsCount = (menu: NavigationMenu): number => {
    let count = menu.items.length;
    menu.items.forEach((it) => {
      if (it.children) {
        count += it.children.length;
      }
    });
    return count;
  };

  // Filtragem de menus
  const filteredMenus = useMemo(() => {
    return menus.filter((menu) => {
      const matchesSearch =
        menu.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        getLocationLabel(menu.location).toLowerCase().includes(searchQuery.toLowerCase());

      const matchesLocation = locationFilter === 'all' || menu.location === locationFilter;

      return matchesSearch && matchesLocation;
    });
  }, [menus, searchQuery, locationFilter]);

  // Menu atualmente selecionado para gerenciar
  const activeMenu = useMemo(() => {
    if (!selectedMenuId) return null;
    return menus.find((m) => m.id === selectedMenuId) || null;
  }, [menus, selectedMenuId]);

  // --- Handlers de Menus ---

  const handleCreateMenu = (data: {
    name: string;
    location: MenuLocation;
    status: NavigationMenuStatus;
  }) => {
    const newMenu: NavigationMenu = {
      id: `menu_${Date.now()}`,
      tenantId: 'ib_central',
      name: data.name,
      location: data.location,
      status: data.status,
      items: [],
      createdAt: new Date().toISOString(),
      updatedAt: 'Agora mesmo',
    };

    setMenus((prev) => [newMenu, ...prev]);
    showNotification(`Menu "${data.name}" criado com sucesso.`);
    setSelectedMenuId(newMenu.id);
  };

  const handleUpdateMenu = (updatedMenu: NavigationMenu) => {
    setMenus((prev) => prev.map((m) => (m.id === updatedMenu.id ? updatedMenu : m)));
  };

  const handleDuplicateMenu = (menu: NavigationMenu) => {
    const timestamp = Date.now();
    const newMenuId = `menu_${timestamp}`;

    // Clona todos os itens e sub-itens com novos IDs únicos
    const clonedItems = menu.items.map((it, idx) => {
      const clonedItemId = `nav_${timestamp}_${idx}`;
      const clonedChildren = it.children
        ? it.children.map((c, cIdx) => ({
            ...c,
            id: `nav_${timestamp}_${idx}_c_${cIdx}`,
            parentId: clonedItemId,
          }))
        : [];

      return {
        ...it,
        id: clonedItemId,
        children: clonedChildren,
      };
    });

    const duplicatedMenu: NavigationMenu = {
      ...menu,
      id: newMenuId,
      name: `${menu.name} (Cópia)`,
      status: 'draft',
      items: clonedItems,
      createdAt: new Date().toISOString(),
      updatedAt: 'Agora mesmo',
    };

    setMenus((prev) => [duplicatedMenu, ...prev]);
    showNotification(`Menu "${menu.name}" duplicado.`);
  };

  const handleToggleStatus = (menu: NavigationMenu) => {
    const nextStatus: NavigationMenuStatus =
      menu.status === 'active' ? 'draft' : menu.status === 'draft' ? 'archived' : 'active';

    const updated = {
      ...menu,
      status: nextStatus,
      updatedAt: 'Agora mesmo',
    };

    handleUpdateMenu(updated);
    showNotification(`Status do menu "${menu.name}" alterado para ${nextStatus}.`);
  };

  const handleConfirmDeleteMenu = () => {
    if (!menuPendingDelete) return;

    setMenus((prev) => prev.filter((m) => m.id !== menuPendingDelete.id));
    if (selectedMenuId === menuPendingDelete.id) {
      setSelectedMenuId(null);
    }
    showNotification(`Menu "${menuPendingDelete.name}" excluído.`);
    setMenuPendingDelete(null);
  };

  // Se um menu estiver selecionado para gerenciamento, renderiza a visualização do menu
  if (activeMenu) {
    return (
      <div className="space-y-6">
        {/* Toast Notifier */}
        {feedbackToast && (
          <div className="fixed bottom-5 right-5 z-50 bg-stone-900 text-white text-xs px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2 border border-stone-700 animate-in fade-in slide-in-from-bottom-2 duration-200">
            <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
            <span>{feedbackToast}</span>
          </div>
        )}

        <ManageMenuView
          menu={activeMenu}
          availablePages={availablePages}
          onBack={() => setSelectedMenuId(null)}
          onUpdateMenu={handleUpdateMenu}
          showNotification={showNotification}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Toast Notifier */}
      {feedbackToast && (
        <div className="fixed bottom-5 right-5 z-50 bg-stone-900 text-white text-xs px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2 border border-stone-700 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
          <span>{feedbackToast}</span>
        </div>
      )}

      {/* Cabeçalho da Seção de Navegação */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-stone-200/80">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-stone-900 tracking-tight">Navegação</h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-700 font-semibold border border-stone-200">
              {menus.length} {menus.length === 1 ? 'menu' : 'menus'}
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            Organize os menus e links do seu site para cabeçalho, rodapé e gaveta mobile.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsNewMenuModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-xl transition-colors shadow-xs self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Novo Menu</span>
        </button>
      </div>

      {/* Barra de Filtros e Pesquisa */}
      <div className="bg-white rounded-xl border border-stone-200 p-3 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por nome ou localização..."
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500 text-stone-800"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <label className="text-[11px] font-semibold text-stone-500">Filtrar:</label>
          <select
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            className="text-xs px-2.5 py-1.5 rounded-lg border border-stone-200 text-stone-700 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            <option value="all">Todas as localizações</option>
            <option value="header">Cabeçalho</option>
            <option value="footer">Rodapé</option>
            <option value="mobile_drawer">Menu Mobile (Gaveta)</option>
            <option value="mobile">Barra Mobile</option>
            <option value="sidebar">Barra Lateral</option>
          </select>
        </div>
      </div>

      {/* Lista de Menus */}
      {filteredMenus.length === 0 ? (
        <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center shadow-xs">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center mx-auto mb-3">
            <Compass className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-stone-800 mb-1">Nenhum menu encontrado</h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto mb-4">
            {searchQuery || locationFilter !== 'all'
              ? 'Tente alterar os termos de busca ou filtros aplicados.'
              : 'Crie seu primeiro menu para começar a organizar a navegação do site da igreja.'}
          </p>
          <button
            type="button"
            onClick={() => setIsNewMenuModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-lg transition-colors shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Criar Menu</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredMenus.map((menu) => {
            const totalItems = getTotalItemsCount(menu);

            return (
              <div
                key={menu.id}
                className="bg-white rounded-xl border border-stone-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group"
              >
                {/* Cabeçalho do Card */}
                <div className="p-5">
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700">
                        <Compass className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-stone-900 group-hover:text-amber-800 transition-colors">
                          {menu.name}
                        </h3>
                        <span className="text-[11px] font-semibold text-amber-700">
                          {getLocationLabel(menu.location)}
                        </span>
                      </div>
                    </div>

                    {/* Badge de Status */}
                    <button
                      type="button"
                      onClick={() => handleToggleStatus(menu)}
                      title="Clique para alternar status"
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full transition-colors cursor-pointer ${
                        menu.status === 'active'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                          : menu.status === 'draft'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100'
                          : 'bg-stone-100 text-stone-600 border border-stone-200 hover:bg-stone-200'
                      }`}
                    >
                      {menu.status === 'active'
                        ? 'Ativo'
                        : menu.status === 'draft'
                        ? 'Rascunho'
                        : 'Arquivado'}
                    </button>
                  </div>

                  {/* Informações de Itens */}
                  <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
                    <div className="flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-stone-400" />
                      <span>
                        <strong className="font-semibold text-stone-800">{totalItems}</strong>{' '}
                        {totalItems === 1 ? 'item configurado' : 'itens configurados'}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 text-[11px] text-stone-400">
                      <Clock className="w-3 h-3" />
                      <span>{menu.updatedAt}</span>
                    </div>
                  </div>
                </div>

                {/* Rodapé de Ações do Card */}
                <div className="bg-stone-50 px-5 py-3 border-t border-stone-100 flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleDuplicateMenu(menu)}
                      className="p-1.5 text-stone-500 hover:text-stone-800 hover:bg-stone-200 rounded-lg transition-colors"
                      title="Duplicar menu"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setMenuPendingDelete(menu)}
                      className="p-1.5 text-stone-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Excluir menu"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSelectedMenuId(menu.id)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-amber-700 hover:text-amber-800 hover:bg-amber-50 rounded-lg transition-colors border border-amber-200"
                  >
                    <span>Gerenciar</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modais */}
      <NewMenuModal
        isOpen={isNewMenuModalOpen}
        onClose={() => setIsNewMenuModalOpen(false)}
        onCreateMenu={handleCreateMenu}
      />

      <DeleteMenuConfirmModal
        isOpen={!!menuPendingDelete}
        menu={menuPendingDelete}
        onClose={() => setMenuPendingDelete(null)}
        onConfirm={handleConfirmDeleteMenu}
      />
    </div>
  );
};
