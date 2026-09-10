import React, { useState } from 'react';
import { X, Plus, Compass } from 'lucide-react';
import { MenuLocation, NavigationMenuStatus, NavigationMenu } from '../../types';

interface NewMenuModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateMenu: (menuData: {
    name: string;
    location: MenuLocation;
    status: NavigationMenuStatus;
  }) => void;
}

export const NewMenuModal: React.FC<NewMenuModalProps> = ({
  isOpen,
  onClose,
  onCreateMenu,
}) => {
  if (!isOpen) return null;

  const [name, setName] = useState('');
  const [location, setLocation] = useState<MenuLocation>('header');
  const [status, setStatus] = useState<NavigationMenuStatus>('active');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onCreateMenu({
      name: name.trim(),
      location,
      status,
    });

    setName('');
    setLocation('header');
    setStatus('active');
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl border border-stone-200 w-full max-w-md overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header do Modal */}
        <div className="p-5 border-b border-stone-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700">
              <Compass className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-stone-900">Novo Menu</h3>
              <p className="text-xs text-stone-500">
                Configure a localização e identificação do menu
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Nome do Menu */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Nome do Menu
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Menu Principal, Links Úteis..."
              className="w-full text-xs px-3 py-2 rounded-lg border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-stone-800"
              autoFocus
            />
          </div>

          {/* Localização */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Localização no Site
            </label>
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value as MenuLocation)}
              className="w-full text-xs px-3 py-2 rounded-lg border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500 text-stone-800 bg-white"
            >
              <option value="header">Cabeçalho (Header Principal)</option>
              <option value="footer">Rodapé (Footer)</option>
              <option value="mobile_drawer">Menu Mobile (Gaveta Lateral)</option>
              <option value="mobile">Barra Mobile Inferior</option>
              <option value="sidebar">Barra Lateral (Sidebar)</option>
            </select>
          </div>

          {/* Status */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Status do Menu
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as NavigationMenuStatus)}
              className="w-full text-xs px-3 py-2 rounded-lg border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500 text-stone-800 bg-white"
            >
              <option value="active">Ativo (Visível no site)</option>
              <option value="draft">Rascunho (Em preparação)</option>
              <option value="archived">Arquivado (Inativo)</option>
            </select>
          </div>

          {/* Ações */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-stone-100">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 text-xs font-semibold text-stone-600 hover:text-stone-800 hover:bg-stone-100 rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-lg transition-colors shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Criar Menu</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
