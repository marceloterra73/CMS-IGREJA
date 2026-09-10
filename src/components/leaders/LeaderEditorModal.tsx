import React, { useState, useEffect } from 'react';
import {
  X,
  Save,
  UserCheck,
  User,
  Image as ImageIcon,
  AlertCircle,
  CheckCircle,
  XCircle,
  Hash,
  Trash2,
} from 'lucide-react';
import { ChurchLeader, LeaderStatus, MediaItem } from '../../types';
import { MediaPickerModal } from '../media/MediaPickerModal';
import { getMediaItemById } from './leadersUtils';

interface LeaderEditorModalProps {
  leader: ChurchLeader | null; // null = nova liderança
  isOpen: boolean;
  onClose: () => void;
  onSave: (leader: ChurchLeader) => void;
  existingLeaders: ChurchLeader[];
}

export const LeaderEditorModal: React.FC<LeaderEditorModalProps> = ({
  leader,
  isOpen,
  onClose,
  onSave,
  existingLeaders,
}) => {
  const isEditing = Boolean(leader);

  // Estados dos campos do contrato canônico ChurchLeader
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [description, setDescription] = useState('');
  const [photoMediaId, setPhotoMediaId] = useState<string | undefined>(undefined);
  const [order, setOrder] = useState<number>(1);
  const [status, setStatus] = useState<LeaderStatus>('active');

  // Controle de modal de mídia e erros
  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Inicialização do formulário ao abrir
  useEffect(() => {
    if (isOpen) {
      if (leader) {
        setName(leader.name);
        setRole(leader.role);
        setDescription(leader.description || '');
        setPhotoMediaId(leader.photoMediaId);
        setOrder(leader.order ?? 1);
        setStatus(leader.status);
      } else {
        // Nova liderança: calcula próxima ordem sugerida
        const maxOrder = existingLeaders.reduce(
          (max, l) => Math.max(max, l.order || 0),
          0
        );
        setName('');
        setRole('');
        setDescription('');
        setPhotoMediaId(undefined);
        setOrder(maxOrder + 1);
        setStatus('active');
      }
      setErrorMsg(null);
    }
  }, [isOpen, leader, existingLeaders]);

  if (!isOpen) return null;

  // Foto selecionada
  const selectedPhoto = getMediaItemById(photoMediaId);

  // Handler de salvamento com validação estrita
  const handleSave = () => {
    setErrorMsg(null);

    const trimmedName = name.trim();
    if (!trimmedName) {
      setErrorMsg('O nome da liderança é obrigatório.');
      return;
    }

    const trimmedRole = role.trim();
    if (!trimmedRole) {
      setErrorMsg('O cargo ou função ministerial é obrigatório.');
      return;
    }

    const parsedOrder = Number(order);
    if (isNaN(parsedOrder) || parsedOrder < 1) {
      setErrorMsg('A ordem de exibição deve ser um número maior ou igual a 1.');
      return;
    }

    const now = new Date().toISOString();

    const leaderData: ChurchLeader = {
      id: leader?.id || `ldr_${Date.now()}`,
      tenantId: leader?.tenantId || 'ib_central',
      name: trimmedName,
      role: trimmedRole,
      description: description.trim() || undefined,
      photoMediaId: photoMediaId || undefined,
      order: Math.floor(parsedOrder),
      status,
      createdAt: leader?.createdAt || now,
      updatedAt: now,
    };

    onSave(leaderData);
    onClose();
  };

  return (
    <>
      <div
        id="leader-editor-modal-backdrop"
        className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
      >
        <div
          id="leader-editor-modal-content"
          className="bg-white w-full max-w-xl rounded-2xl shadow-xl border border-stone-200 overflow-hidden flex flex-col my-8 max-h-[90vh]"
        >
          {/* Cabeçalho do Modal */}
          <div className="px-5 py-4 border-b border-stone-200 flex items-center justify-between bg-stone-50/70">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-stone-900 text-white rounded-xl shadow-xs">
                <UserCheck className="w-4 h-4 text-amber-400" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-bold text-stone-900">
                  {isEditing ? 'Editar Liderança' : 'Nova Liderança'}
                </h2>
                <p className="text-xs text-stone-500">
                  {isEditing
                    ? 'Atualize os dados e a foto da liderança pastoral.'
                    : 'Cadastre um novo pastor, ministro ou líder da congregação.'}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 rounded-lg transition-colors cursor-pointer"
              title="Fechar formulário"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Corpo com Campos do Contrato ChurchLeader */}
          <div className="p-5 overflow-y-auto space-y-4 flex-1">
            {/* Alerta de Validação */}
            {errorMsg && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2.5 text-xs text-rose-700">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Linha 1: Nome da Liderança (name) */}
            <div>
              <label
                htmlFor="input-leader-name"
                className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1"
              >
                Nome Completo <span className="text-rose-500">*</span>
              </label>
              <input
                id="input-leader-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Pr. Marcos Silveira ou Pra. Luciana Rocha"
                className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm text-stone-900 placeholder-stone-400 focus:outline-hidden focus:ring-2 focus:ring-stone-900 focus:bg-white transition-all font-medium"
              />
            </div>

            {/* Linha 2: Cargo / Função (role) e Ordem de Exibição (order) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label
                  htmlFor="input-leader-role"
                  className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1"
                >
                  Cargo ou Função Ministerial <span className="text-rose-500">*</span>
                </label>
                <input
                  id="input-leader-role"
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="Ex: Pastor Sênior, Pastora de Famílias, Líder de Jovens"
                  className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm text-stone-900 placeholder-stone-400 focus:outline-hidden focus:ring-2 focus:ring-stone-900 focus:bg-white transition-all"
                />
              </div>

              <div>
                <label
                  htmlFor="input-leader-order"
                  className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1"
                  title="Número para definir a ordem na hierarquia ou lista"
                >
                  Ordem (#) <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Hash className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    id="input-leader-order"
                    type="number"
                    min="1"
                    step="1"
                    value={order}
                    onChange={(e) => setOrder(parseInt(e.target.value, 10) || 1)}
                    className="w-full pl-8 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm text-stone-900 focus:outline-hidden focus:ring-2 focus:ring-stone-900 focus:bg-white font-mono transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Linha 3: Foto de Perfil (photoMediaId) com Reutilização de MediaPickerModal */}
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                Foto de Perfil / Retrato
              </label>

              {selectedPhoto ? (
                <div className="p-3 bg-stone-50 border border-stone-200 rounded-xl flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={selectedPhoto.url}
                      alt={selectedPhoto.altText || 'Foto da liderança'}
                      referrerPolicy="no-referrer"
                      className="w-12 h-12 rounded-xl object-cover border border-stone-200 shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="text-xs font-semibold text-stone-900 truncate">
                        {selectedPhoto.title}
                      </div>
                      <div className="text-[11px] text-stone-500 truncate">
                        {selectedPhoto.filename} • ID: {selectedPhoto.id}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => setIsMediaPickerOpen(true)}
                      className="px-2.5 py-1.5 bg-white border border-stone-200 hover:bg-stone-100 text-stone-700 rounded-lg text-xs font-medium transition-colors cursor-pointer"
                    >
                      Trocar
                    </button>
                    <button
                      type="button"
                      onClick={() => setPhotoMediaId(undefined)}
                      className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                      title="Remover foto"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-stone-50 border border-dashed border-stone-300 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-center sm:text-left">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-stone-200/80 text-stone-500 flex items-center justify-center shrink-0 mx-auto sm:mx-0">
                      <ImageIcon className="w-5 h-5 text-stone-400" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-stone-800">
                        Nenhuma foto associada
                      </div>
                      <div className="text-[11px] text-stone-500">
                        Selecione uma imagem já enviada para a biblioteca de mídia.
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsMediaPickerOpen(true)}
                    className="inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-white border border-stone-300 hover:bg-stone-100 text-stone-700 rounded-xl text-xs font-semibold transition-colors cursor-pointer shadow-2xs shrink-0"
                  >
                    <ImageIcon className="w-3.5 h-3.5 text-stone-500" />
                    <span>Selecionar da Mídia</span>
                  </button>
                </div>
              )}
            </div>

            {/* Linha 4: Biografia / Apresentação (description) */}
            <div>
              <label
                htmlFor="textarea-leader-description"
                className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1"
              >
                Apresentação / Biografia Breve
              </label>
              <textarea
                id="textarea-leader-description"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Breve resumo da trajetória ministerial, formação teológica ou vocação ministerial..."
                className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm text-stone-900 placeholder-stone-400 focus:outline-hidden focus:ring-2 focus:ring-stone-900 focus:bg-white transition-all leading-relaxed"
              />
            </div>

            {/* Linha 5: Status da Liderança (status) */}
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                Status Ministerial <span className="text-rose-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label className="relative flex flex-col p-3 border border-stone-200 rounded-xl cursor-pointer hover:bg-stone-50 transition-colors">
                  <input
                    type="radio"
                    name="leader-status"
                    value="active"
                    checked={status === 'active'}
                    onChange={() => setStatus('active')}
                    className="sr-only peer"
                  />
                  <div
                    className={`absolute inset-0 rounded-xl border-2 pointer-events-none transition-all ${
                      status === 'active'
                        ? 'border-emerald-500 bg-emerald-50/20'
                        : 'border-transparent'
                    }`}
                  />
                  <div className="flex items-center gap-1.5 relative z-10 font-bold text-xs text-stone-900">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Ativo</span>
                  </div>
                  <span className="text-[10px] text-stone-500 mt-1 leading-tight relative z-10">
                    Em exercício regular na igreja e visível na congregação.
                  </span>
                </label>

                <label className="relative flex flex-col p-3 border border-stone-200 rounded-xl cursor-pointer hover:bg-stone-50 transition-colors">
                  <input
                    type="radio"
                    name="leader-status"
                    value="inactive"
                    checked={status === 'inactive'}
                    onChange={() => setStatus('inactive')}
                    className="sr-only peer"
                  />
                  <div
                    className={`absolute inset-0 rounded-xl border-2 pointer-events-none transition-all ${
                      status === 'inactive'
                        ? 'border-stone-600 bg-stone-50'
                        : 'border-transparent'
                    }`}
                  />
                  <div className="flex items-center gap-1.5 relative z-10 font-bold text-xs text-stone-900">
                    <XCircle className="w-3.5 h-3.5 text-stone-500" />
                    <span>Inativo</span>
                  </div>
                  <span className="text-[10px] text-stone-500 mt-1 leading-tight relative z-10">
                    Emérito, em licença temporária ou afastado das funções.
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Rodapé com Botões de Ação */}
          <div className="px-5 py-4 border-t border-stone-200 bg-stone-50/70 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-white border border-stone-200 text-stone-700 hover:bg-stone-100 rounded-xl text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
            >
              Cancelar
            </button>

            <button
              id="btn-save-leader"
              type="button"
              onClick={handleSave}
              className="inline-flex items-center gap-2 px-5 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs sm:text-sm font-semibold transition-all shadow-xs hover:shadow-md cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{isEditing ? 'Salvar Alterações' : 'Cadastrar Liderança'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Modal Reutilizável de Seleção de Mídia da Biblioteca */}
      <MediaPickerModal
        isOpen={isMediaPickerOpen}
        onClose={() => setIsMediaPickerOpen(false)}
        selectedMediaId={photoMediaId}
        onSelectImage={(media: MediaItem) => {
          setPhotoMediaId(media.id);
          setIsMediaPickerOpen(false);
        }}
      />
    </>
  );
};
