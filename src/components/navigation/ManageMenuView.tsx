import React, { useState } from 'react';
import {
  ArrowLeft,
  Plus,
  Compass,
  FileText,
  ExternalLink,
  Eye,
  EyeOff,
  ChevronUp,
  ChevronDown,
  Copy,
  Pencil,
  Trash2,
  Menu as MenuIcon,
  Sparkles,
  Layers,
  ChevronRight,
} from 'lucide-react';
import { NavigationMenu, NavigationItem, Page, NavigationTargetType } from '../../types';
import { ItemModal } from './ItemModal';
import { DeleteItemConfirmModal } from './DeleteItemConfirmModal';
import { NavigationMenuPreview } from './NavigationMenuPreview';

interface ManageMenuViewProps {
  menu: NavigationMenu;
  availablePages: Page[];
  onBack: () => void;
  onUpdateMenu: (updatedMenu: NavigationMenu) => void;
  showNotification: (msg: string) => void;
}

export const ManageMenuView: React.FC<ManageMenuViewProps> = ({
  menu,
  availablePages,
  onBack,
  onUpdateMenu,
  showNotification,
}) => {
  const [showPreview, setShowPreview] = useState(true);
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<NavigationItem | null>(null);
  const [defaultParentId, setDefaultParentId] = useState<string | undefined>(undefined);
  const [itemPendingDelete, setItemPendingDelete] = useState<NavigationItem | null>(null);

  // Helper para resolver o nome da página a partir do pageId
  const getPageTitle = (pageId: string): string => {
    const p = availablePages.find((page) => page.id === pageId);
    return p ? p.title : pageId;
  };

  // Itens elegíveis para serem pais (apenas itens de primeiro nível)
  const parentCandidates = menu.items;

  // --- Ações de Manipulação de Itens ---

  const handleOpenAddItem = (parentId?: string) => {
    setEditingItem(null);
    setDefaultParentId(parentId);
    setIsItemModalOpen(true);
  };

  const handleOpenEditItem = (item: NavigationItem) => {
    setEditingItem(item);
    setDefaultParentId(item.parentId);
    setIsItemModalOpen(true);
  };

  const handleSaveItem = (itemData: {
    label: string;
    targetType: NavigationTargetType;
    pageId?: string;
    url?: string;
    openInNewTab?: boolean;
    parentId?: string;
    isVisible: boolean;
  }) => {
    if (editingItem) {
      // Edição de item existente
      const updatedItems = menu.items.map((it) => {
        if (it.id === editingItem.id) {
          return {
            ...it,
            label: itemData.label,
            isVisible: itemData.isVisible,
            parentId: itemData.parentId,
            target:
              itemData.targetType === 'page'
                ? {
                    type: 'page' as const,
                    pageId: itemData.pageId || availablePages[0]?.id || '',
                    openInNewTab: itemData.openInNewTab,
                  }
                : {
                    type: 'external' as const,
                    url: itemData.url || '',
                    openInNewTab: itemData.openInNewTab,
                  },
            url: itemData.targetType === 'external' ? itemData.url : undefined,
            isExternal: itemData.targetType === 'external',
            openInNewTab: itemData.openInNewTab,
          };
        }

        // Verifica se é um item filho
        if (it.children) {
          const updatedChildren = it.children.map((child) => {
            if (child.id === editingItem.id) {
              return {
                ...child,
                label: itemData.label,
                isVisible: itemData.isVisible,
                parentId: itemData.parentId || it.id,
                target:
                  itemData.targetType === 'page'
                    ? {
                        type: 'page' as const,
                        pageId: itemData.pageId || availablePages[0]?.id || '',
                        openInNewTab: itemData.openInNewTab,
                      }
                    : {
                        type: 'external' as const,
                        url: itemData.url || '',
                        openInNewTab: itemData.openInNewTab,
                      },
                url: itemData.targetType === 'external' ? itemData.url : undefined,
                isExternal: itemData.targetType === 'external',
                openInNewTab: itemData.openInNewTab,
              };
            }
            return child;
          });
          return { ...it, children: updatedChildren };
        }

        return it;
      });

      onUpdateMenu({
        ...menu,
        items: updatedItems,
        updatedAt: 'Agora mesmo',
      });
      showNotification(`Item "${itemData.label}" atualizado com sucesso.`);
    } else {
      // Criação de novo item
      const newItemId = `nav_${Date.now()}`;
      const newItem: NavigationItem = {
        id: newItemId,
        label: itemData.label,
        order: itemData.parentId ? 1 : menu.items.length + 1,
        isVisible: itemData.isVisible,
        parentId: itemData.parentId,
        target:
          itemData.targetType === 'page'
            ? {
                type: 'page',
                pageId: itemData.pageId || availablePages[0]?.id || '',
                openInNewTab: itemData.openInNewTab,
              }
            : {
                type: 'external',
                url: itemData.url || '',
                openInNewTab: itemData.openInNewTab,
              },
        url: itemData.targetType === 'external' ? itemData.url : undefined,
        isExternal: itemData.targetType === 'external',
        openInNewTab: itemData.openInNewTab,
        children: [],
      };

      if (itemData.parentId) {
        // Inserir como filho do parentId correspondente
        const updatedItems = menu.items.map((parent) => {
          if (parent.id === itemData.parentId) {
            const existingChildren = parent.children || [];
            newItem.order = existingChildren.length + 1;
            return {
              ...parent,
              children: [...existingChildren, newItem],
            };
          }
          return parent;
        });

        onUpdateMenu({
          ...menu,
          items: updatedItems,
          updatedAt: 'Agora mesmo',
        });
      } else {
        // Inserir no primeiro nível
        onUpdateMenu({
          ...menu,
          items: [...menu.items, newItem],
          updatedAt: 'Agora mesmo',
        });
      }

      showNotification(`Item "${itemData.label}" adicionado ao menu.`);
    }
  };

  const handleToggleVisibility = (item: NavigationItem) => {
    const updatedItems = menu.items.map((it) => {
      if (it.id === item.id) {
        return { ...it, isVisible: !it.isVisible };
      }
      if (it.children) {
        return {
          ...it,
          children: it.children.map((c) => (c.id === item.id ? { ...c, isVisible: !c.isVisible } : c)),
        };
      }
      return it;
    });

    onUpdateMenu({
      ...menu,
      items: updatedItems,
      updatedAt: 'Agora mesmo',
    });
    showNotification(`Visibilidade de "${item.label}" alterada.`);
  };

  const handleMoveUp = (index: number, parentId?: string) => {
    if (parentId) {
      // Mover sub-item
      const parent = menu.items.find((p) => p.id === parentId);
      if (!parent || !parent.children || index <= 0) return;

      const newChildren = [...parent.children];
      const temp = newChildren[index - 1];
      newChildren[index - 1] = newChildren[index];
      newChildren[index] = temp;
      newChildren.forEach((c, idx) => {
        c.order = idx + 1;
      });

      const updatedItems = menu.items.map((p) =>
        p.id === parentId ? { ...p, children: newChildren } : p
      );

      onUpdateMenu({ ...menu, items: updatedItems, updatedAt: 'Agora mesmo' });
    } else {
      // Mover item de primeiro nível
      if (index <= 0) return;
      const newItems = [...menu.items];
      const temp = newItems[index - 1];
      newItems[index - 1] = newItems[index];
      newItems[index] = temp;
      newItems.forEach((it, idx) => {
        it.order = idx + 1;
      });

      onUpdateMenu({ ...menu, items: newItems, updatedAt: 'Agora mesmo' });
    }
  };

  const handleMoveDown = (index: number, parentId?: string) => {
    if (parentId) {
      // Mover sub-item
      const parent = menu.items.find((p) => p.id === parentId);
      if (!parent || !parent.children || index >= parent.children.length - 1) return;

      const newChildren = [...parent.children];
      const temp = newChildren[index + 1];
      newChildren[index + 1] = newChildren[index];
      newChildren[index] = temp;
      newChildren.forEach((c, idx) => {
        c.order = idx + 1;
      });

      const updatedItems = menu.items.map((p) =>
        p.id === parentId ? { ...p, children: newChildren } : p
      );

      onUpdateMenu({ ...menu, items: updatedItems, updatedAt: 'Agora mesmo' });
    } else {
      // Mover item de primeiro nível
      if (index >= menu.items.length - 1) return;
      const newItems = [...menu.items];
      const temp = newItems[index + 1];
      newItems[index + 1] = newItems[index];
      newItems[index] = temp;
      newItems.forEach((it, idx) => {
        it.order = idx + 1;
      });

      onUpdateMenu({ ...menu, items: newItems, updatedAt: 'Agora mesmo' });
    }
  };

  const handleDuplicateItem = (item: NavigationItem) => {
    const timestamp = Date.now();
    const newItemId = `nav_${timestamp}`;

    if (item.parentId) {
      // Duplica sub-item
      const updatedItems = menu.items.map((parent) => {
        if (parent.id === item.parentId && parent.children) {
          const duplicatedSubItem: NavigationItem = {
            ...item,
            id: newItemId,
            label: `${item.label} (Cópia)`,
            order: parent.children.length + 1,
          };
          return {
            ...parent,
            children: [...parent.children, duplicatedSubItem],
          };
        }
        return parent;
      });

      onUpdateMenu({ ...menu, items: updatedItems, updatedAt: 'Agora mesmo' });
      showNotification(`Item "${item.label}" duplicado.`);
    } else {
      // Duplica item de primeiro nível (e seus filhos, se houver, gerando novos IDs para cada um)
      const duplicatedChildren = item.children
        ? item.children.map((child, cIdx) => ({
            ...child,
            id: `nav_${timestamp}_child_${cIdx}`,
            parentId: newItemId,
          }))
        : [];

      const duplicatedItem: NavigationItem = {
        ...item,
        id: newItemId,
        label: `${item.label} (Cópia)`,
        order: menu.items.length + 1,
        children: duplicatedChildren,
      };

      onUpdateMenu({
        ...menu,
        items: [...menu.items, duplicatedItem],
        updatedAt: 'Agora mesmo',
      });
      showNotification(`Item "${item.label}" duplicado com sucesso.`);
    }
  };

  const handleConfirmDeleteItem = () => {
    if (!itemPendingDelete) return;

    if (itemPendingDelete.parentId) {
      // Remove sub-item
      const updatedItems = menu.items.map((parent) => {
        if (parent.id === itemPendingDelete.parentId && parent.children) {
          const remainingChildren = parent.children
            .filter((c) => c.id !== itemPendingDelete.id)
            .map((c, idx) => ({ ...c, order: idx + 1 }));
          return {
            ...parent,
            children: remainingChildren,
          };
        }
        return parent;
      });

      onUpdateMenu({ ...menu, items: updatedItems, updatedAt: 'Agora mesmo' });
      showNotification(`Item "${itemPendingDelete.label}" removido.`);
    } else {
      // Remove item de primeiro nível
      const remainingItems = menu.items
        .filter((it) => it.id !== itemPendingDelete.id)
        .map((it, idx) => ({ ...it, order: idx + 1 }));

      onUpdateMenu({ ...menu, items: remainingItems, updatedAt: 'Agora mesmo' });
      showNotification(`Item "${itemPendingDelete.label}" removido.`);
    }

    setItemPendingDelete(null);
  };

  return (
    <div className="space-y-6">
      {/* Barra Superior de Ações */}
      <div className="bg-white rounded-xl border border-stone-200 p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="p-2 text-stone-500 hover:text-stone-800 hover:bg-stone-100 rounded-lg transition-colors border border-stone-200"
            title="Voltar aos Menus"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-stone-900">{menu.name}</h2>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                {menu.location === 'header' && 'Cabeçalho'}
                {menu.location === 'footer' && 'Rodapé'}
                {menu.location === 'mobile_drawer' && 'Gaveta Mobile'}
                {menu.location === 'mobile' && 'Barra Mobile'}
                {menu.location === 'sidebar' && 'Barra Lateral'}
              </span>
              <span
                className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                  menu.status === 'active'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : menu.status === 'draft'
                    ? 'bg-amber-50 text-amber-700 border border-amber-200'
                    : 'bg-stone-100 text-stone-600 border border-stone-200'
                }`}
              >
                {menu.status === 'active' ? 'Ativo' : menu.status === 'draft' ? 'Rascunho' : 'Arquivado'}
              </span>
            </div>
            <p className="text-xs text-stone-500 mt-0.5">
              {menu.items.length} {menu.items.length === 1 ? 'item principal' : 'itens principais'} • Atualizado {menu.updatedAt}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button
            type="button"
            onClick={() => setShowPreview((prev) => !prev)}
            className="text-xs font-semibold px-3 py-2 rounded-lg border border-stone-200 text-stone-600 hover:bg-stone-50 transition-colors"
          >
            {showPreview ? 'Ocultar Prévia' : 'Mostrar Prévia'}
          </button>

          <button
            type="button"
            onClick={() => handleOpenAddItem()}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-lg transition-colors shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Adicionar Item</span>
          </button>
        </div>
      </div>

      {/* Prévia Visual do Menu */}
      {showPreview && <NavigationMenuPreview menu={menu} />}

      {/* Estrutura de Itens do Menu */}
      <div className="bg-white rounded-xl border border-stone-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-stone-100 flex items-center justify-between bg-stone-50/70">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-stone-500" />
            <h3 className="text-xs font-bold text-stone-800 uppercase tracking-wider">
              Estrutura Hierárquica do Menu
            </h3>
          </div>
          <span className="text-[11px] text-stone-400">
            Arraste ou use as setas para reordenar itens
          </span>
        </div>

        {menu.items.length === 0 ? (
          <div className="py-12 px-4 text-center">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center mx-auto mb-3">
              <Compass className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-bold text-stone-800 mb-1">
              Este menu ainda não possui itens
            </h4>
            <p className="text-xs text-stone-500 max-w-sm mx-auto mb-4">
              Adicione links de páginas internas ou links externos para estruturar a navegação da igreja.
            </p>
            <button
              type="button"
              onClick={() => handleOpenAddItem()}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-lg transition-colors shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Adicionar Primeiro Item</span>
            </button>
          </div>
        ) : (
          <div className="divide-y divide-stone-100">
            {menu.items.map((item, index) => {
              const hasChildren = item.children && item.children.length > 0;
              const isPageTarget = item.target?.type === 'page' || (!item.target && !item.isExternal);
              const pageTargetId = item.target?.type === 'page' ? item.target.pageId : '';
              const externalUrl = item.target?.type === 'external' ? item.target.url : item.url;

              return (
                <div key={item.id} className="group">
                  {/* Item de Nível 1 */}
                  <div
                    className={`p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors ${
                      !item.isVisible ? 'bg-stone-50/60 opacity-70' : 'hover:bg-amber-50/20'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {/* Ícone de Arrastar / Ordem */}
                      <div className="flex items-center gap-1.5 text-stone-400">
                        <MenuIcon className="w-4 h-4 text-stone-400" />
                        <span className="text-[11px] font-mono text-stone-400 w-4 text-center">
                          {item.order}
                        </span>
                      </div>

                      {/* Informações do Item */}
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-stone-900">{item.label}</span>
                          {!item.isVisible && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-stone-200 text-stone-600 font-medium">
                              Oculto
                            </span>
                          )}
                          {hasChildren && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 font-semibold">
                              {item.children?.length} {item.children?.length === 1 ? 'sub-item' : 'sub-itens'}
                            </span>
                          )}
                        </div>

                        {/* Destino */}
                        <div className="flex items-center gap-1.5 mt-0.5 text-[11px] text-stone-500">
                          {isPageTarget ? (
                            <>
                              <FileText className="w-3 h-3 text-stone-400" />
                              <span>Página: {pageTargetId ? getPageTitle(pageTargetId) : 'Início'}</span>
                            </>
                          ) : (
                            <>
                              <ExternalLink className="w-3 h-3 text-stone-400" />
                              <span className="font-mono text-stone-600 truncate max-w-xs">{externalUrl}</span>
                              {item.openInNewTab && (
                                <span className="text-[10px] text-stone-400">(Nova aba)</span>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Botões de Ação do Item */}
                    <div className="flex items-center gap-1 self-end sm:self-auto">
                      {/* Reordenação */}
                      <button
                        type="button"
                        onClick={() => handleMoveUp(index)}
                        disabled={index === 0}
                        className={`p-1.5 rounded-md border text-stone-500 transition-colors ${
                          index === 0
                            ? 'opacity-30 cursor-not-allowed border-transparent'
                            : 'hover:bg-stone-100 hover:text-stone-800 border-stone-200'
                        }`}
                        title="Mover para cima"
                      >
                        <ChevronUp className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleMoveDown(index)}
                        disabled={index === menu.items.length - 1}
                        className={`p-1.5 rounded-md border text-stone-500 transition-colors ${
                          index === menu.items.length - 1
                            ? 'opacity-30 cursor-not-allowed border-transparent'
                            : 'hover:bg-stone-100 hover:text-stone-800 border-stone-200'
                        }`}
                        title="Mover para baixo"
                      >
                        <ChevronDown className="w-3.5 h-3.5" />
                      </button>

                      <div className="h-4 w-px bg-stone-200 mx-1" />

                      {/* Visibilidade */}
                      <button
                        type="button"
                        onClick={() => handleToggleVisibility(item)}
                        className={`p-1.5 rounded-md border transition-colors ${
                          item.isVisible
                            ? 'text-stone-600 hover:bg-stone-100 border-stone-200'
                            : 'text-amber-700 bg-amber-50 border-amber-200'
                        }`}
                        title={item.isVisible ? 'Ocultar item' : 'Mostrar item'}
                      >
                        {item.isVisible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                      </button>

                      {/* Adicionar Sub-item */}
                      <button
                        type="button"
                        onClick={() => handleOpenAddItem(item.id)}
                        className="p-1.5 rounded-md border border-stone-200 text-stone-600 hover:bg-stone-100 hover:text-stone-900 transition-colors"
                        title="Adicionar sub-item"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>

                      {/* Duplicar */}
                      <button
                        type="button"
                        onClick={() => handleDuplicateItem(item)}
                        className="p-1.5 rounded-md border border-stone-200 text-stone-600 hover:bg-stone-100 hover:text-stone-900 transition-colors"
                        title="Duplicar item"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>

                      {/* Editar */}
                      <button
                        type="button"
                        onClick={() => handleOpenEditItem(item)}
                        className="p-1.5 rounded-md border border-stone-200 text-stone-600 hover:bg-stone-100 hover:text-stone-900 transition-colors"
                        title="Editar item"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>

                      {/* Excluir */}
                      <button
                        type="button"
                        onClick={() => setItemPendingDelete(item)}
                        className="p-1.5 rounded-md border border-stone-200 text-red-600 hover:bg-red-50 hover:border-red-200 transition-colors"
                        title="Excluir item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Sub-itens (Nível 2) */}
                  {hasChildren && (
                    <div className="bg-stone-50/50 pl-8 sm:pl-12 pr-4 py-1.5 border-t border-stone-100 space-y-1">
                      {item.children?.map((child, childIdx) => {
                        const isChildPageTarget =
                          child.target?.type === 'page' || (!child.target && !child.isExternal);
                        const childPageTargetId =
                          child.target?.type === 'page' ? child.target.pageId : '';
                        const childExternalUrl =
                          child.target?.type === 'external' ? child.target.url : child.url;

                        return (
                          <div
                            key={child.id}
                            className={`p-2 rounded-lg border border-stone-200/80 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-2 transition-colors ${
                              !child.isVisible ? 'opacity-60' : 'hover:border-amber-300'
                            }`}
                          >
                            <div className="flex items-center gap-2.5">
                              <span className="text-stone-400 font-mono text-[10px]">
                                ↳ {child.order}
                              </span>
                              <div>
                                <div className="flex items-center gap-1.5">
                                  <span className="text-xs font-semibold text-stone-800">
                                    {child.label}
                                  </span>
                                  {!child.isVisible && (
                                    <span className="text-[9px] px-1 rounded bg-stone-200 text-stone-600">
                                      Oculto
                                    </span>
                                  )}
                                </div>
                                <div className="flex items-center gap-1 text-[10px] text-stone-500">
                                  {isChildPageTarget ? (
                                    <>
                                      <FileText className="w-2.5 h-2.5 text-stone-400" />
                                      <span>Página: {childPageTargetId ? getPageTitle(childPageTargetId) : 'Início'}</span>
                                    </>
                                  ) : (
                                    <>
                                      <ExternalLink className="w-2.5 h-2.5 text-stone-400" />
                                      <span className="font-mono text-stone-600 truncate max-w-xs">{childExternalUrl}</span>
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Ações do Sub-item */}
                            <div className="flex items-center gap-1 self-end sm:self-auto">
                              <button
                                type="button"
                                onClick={() => handleMoveUp(childIdx, item.id)}
                                disabled={childIdx === 0}
                                className={`p-1 rounded text-stone-500 ${
                                  childIdx === 0
                                    ? 'opacity-30 cursor-not-allowed'
                                    : 'hover:bg-stone-100 hover:text-stone-800'
                                }`}
                                title="Mover para cima"
                              >
                                <ChevronUp className="w-3 h-3" />
                              </button>

                              <button
                                type="button"
                                onClick={() => handleMoveDown(childIdx, item.id)}
                                disabled={childIdx === (item.children?.length || 0) - 1}
                                className={`p-1 rounded text-stone-500 ${
                                  childIdx === (item.children?.length || 0) - 1
                                    ? 'opacity-30 cursor-not-allowed'
                                    : 'hover:bg-stone-100 hover:text-stone-800'
                                }`}
                                title="Mover para baixo"
                              >
                                <ChevronDown className="w-3 h-3" />
                              </button>

                              <div className="h-3 w-px bg-stone-200 mx-0.5" />

                              <button
                                type="button"
                                onClick={() => handleToggleVisibility(child)}
                                className="p-1 rounded text-stone-600 hover:bg-stone-100"
                                title={child.isVisible ? 'Ocultar sub-item' : 'Mostrar sub-item'}
                              >
                                {child.isVisible ? (
                                  <Eye className="w-3 h-3" />
                                ) : (
                                  <EyeOff className="w-3 h-3 text-amber-700" />
                                )}
                              </button>

                              <button
                                type="button"
                                onClick={() => handleDuplicateItem(child)}
                                className="p-1 rounded text-stone-600 hover:bg-stone-100"
                                title="Duplicar sub-item"
                              >
                                <Copy className="w-3 h-3" />
                              </button>

                              <button
                                type="button"
                                onClick={() => handleOpenEditItem(child)}
                                className="p-1 rounded text-stone-600 hover:bg-stone-100"
                                title="Editar sub-item"
                              >
                                <Pencil className="w-3 h-3" />
                              </button>

                              <button
                                type="button"
                                onClick={() => setItemPendingDelete(child)}
                                className="p-1 rounded text-red-600 hover:bg-red-50"
                                title="Excluir sub-item"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modais de Item */}
      <ItemModal
        isOpen={isItemModalOpen}
        onClose={() => setIsItemModalOpen(false)}
        onSave={handleSaveItem}
        availablePages={availablePages}
        parentCandidates={parentCandidates}
        editingItem={editingItem}
        defaultParentId={defaultParentId}
      />

      <DeleteItemConfirmModal
        isOpen={!!itemPendingDelete}
        item={itemPendingDelete}
        onClose={() => setItemPendingDelete(null)}
        onConfirm={handleConfirmDeleteItem}
      />
    </div>
  );
};
