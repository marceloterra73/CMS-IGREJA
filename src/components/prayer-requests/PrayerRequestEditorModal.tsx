import React, { useState, useEffect } from 'react';
import { X, HeartHandshake, Lock, User, AlertCircle, Save } from 'lucide-react';
import { ChurchPrayerRequest, PrayerRequestStatus } from '../../types';

interface PrayerRequestEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (requestData: Partial<ChurchPrayerRequest>) => void;
  initialData?: ChurchPrayerRequest | null;
}

export const PrayerRequestEditorModal: React.FC<PrayerRequestEditorModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
}) => {
  const isEditing = Boolean(initialData);

  const [title, setTitle] = useState('');
  const [requesterName, setRequesterName] = useState('');
  const [requestText, setRequestText] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [status, setStatus] = useState<PrayerRequestStatus>('pending');
  const [errorMessage, setErrorMessage] = useState('');

  // Inicializa o formulário com dados existentes ou valores padrão
  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '');
      setRequesterName(initialData.requesterName || '');
      setRequestText(initialData.requestText || '');
      setIsAnonymous(Boolean(initialData.isAnonymous));
      setStatus(initialData.status || 'pending');
    } else {
      setTitle('');
      setRequesterName('');
      setRequestText('');
      setIsAnonymous(false);
      setStatus('pending');
    }
    setErrorMessage('');
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!requestText.trim()) {
      setErrorMessage('Por favor, descreva o pedido de oração ou motivo de intercessão.');
      return;
    }

    setErrorMessage('');

    const payload: Partial<ChurchPrayerRequest> = {
      title: title.trim() || undefined,
      requesterName: isAnonymous ? undefined : requesterName.trim() || undefined,
      requestText: requestText.trim(),
      isAnonymous: Boolean(isAnonymous),
      status,
    };

    onSave(payload);
  };

  return (
    <div
      id="prayer-editor-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div className="bg-white rounded-3xl border border-stone-200 shadow-2xl w-full max-w-xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Cabeçalho do Modal */}
        <div className="px-6 py-5 border-b border-stone-100 flex items-center justify-between bg-stone-50/50 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-stone-900 text-white flex items-center justify-center">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-stone-900">
                {isEditing ? 'Editar Pedido de Oração' : 'Novo Pedido de Oração'}
              </h2>
              <p className="text-xs text-stone-500">
                {isEditing
                  ? 'Atualize os dados e o status de intercessão pastoral.'
                  : 'Cadastre um pedido recebido pela liderança ou intercessão.'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-xl transition-colors cursor-pointer"
            title="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Formulário com Scroll Interno */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Opção de Anonimato */}
          <div className="bg-stone-50 border border-stone-200 rounded-2xl p-3.5 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                  isAnonymous ? 'bg-stone-800 text-white' : 'bg-stone-200 text-stone-600'
                }`}
              >
                {isAnonymous ? <Lock className="w-4 h-4" /> : <User className="w-4 h-4" />}
              </div>
              <div>
                <label
                  htmlFor="prayer-field-isAnonymous"
                  className="font-bold text-stone-900 cursor-pointer block"
                >
                  Pedido Anônimo
                </label>
                <p className="text-[11px] text-stone-500">
                  Oculta o nome do solicitante para proteger o sigilo pessoal.
                </p>
              </div>
            </div>
            <input
              id="prayer-field-isAnonymous"
              type="checkbox"
              checked={isAnonymous}
              onChange={(e) => {
                setIsAnonymous(e.target.checked);
                if (e.target.checked) {
                  setRequesterName('');
                }
              }}
              className="w-4 h-4 rounded text-stone-900 focus:ring-stone-400 cursor-pointer"
            />
          </div>

          {/* Nome do Solicitante (somente se não for anônimo) */}
          {!isAnonymous && (
            <div>
              <label
                htmlFor="prayer-field-requesterName"
                className="block font-bold text-stone-800 mb-1.5"
              >
                Nome do Solicitante
              </label>
              <input
                id="prayer-field-requesterName"
                type="text"
                value={requesterName}
                onChange={(e) => setRequesterName(e.target.value)}
                placeholder="Ex: Maria Helena da Silva"
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 placeholder:text-stone-400 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-stone-400 transition-all text-xs sm:text-sm"
              />
              <p className="text-[11px] text-stone-400 mt-1">
                Opcional. Deixe em branco caso o solicitante não tenha se identificado.
              </p>
            </div>
          )}

          {/* Título do Pedido */}
          <div>
            <label htmlFor="prayer-field-title" className="block font-bold text-stone-800 mb-1.5">
              Título ou Assunto do Pedido
            </label>
            <input
              id="prayer-field-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Recuperação cirúrgica do Sr. Joaquim"
              className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 placeholder:text-stone-400 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-stone-400 transition-all text-xs sm:text-sm"
            />
            <p className="text-[11px] text-stone-400 mt-1">
              Opcional. Ajuda a resumir o motivo para a equipe pastoral.
            </p>
          </div>

          {/* Texto do Pedido (Obrigatório) */}
          <div>
            <label
              htmlFor="prayer-field-requestText"
              className="block font-bold text-stone-800 mb-1.5"
            >
              Descrição do Pedido de Oração <span className="text-rose-500">*</span>
            </label>
            <textarea
              id="prayer-field-requestText"
              rows={5}
              required
              value={requestText}
              onChange={(e) => setRequestText(e.target.value)}
              placeholder="Escreva detalhadamente o motivo da intercessão, necessidades da família ou motivos de gratidão..."
              className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 placeholder:text-stone-400 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-stone-400 transition-all text-xs sm:text-sm resize-y leading-relaxed"
            />
            <div className="flex items-center justify-between text-[11px] text-stone-400 mt-1">
              <span>Campo confidencial. O texto é tratado com estrita segurança.</span>
              <span>{requestText.length} caracteres</span>
            </div>
          </div>

          {/* Status do Pedido */}
          <div>
            <label htmlFor="prayer-field-status" className="block font-bold text-stone-800 mb-1.5">
              Status Pastoral
            </label>
            <select
              id="prayer-field-status"
              value={status}
              onChange={(e) => setStatus(e.target.value as PrayerRequestStatus)}
              className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-stone-400 transition-all text-xs sm:text-sm cursor-pointer"
            >
              <option value="pending">Pendente (aguardando triagem)</option>
              <option value="praying">Em Oração (intercessão ativa)</option>
              <option value="answered">Respondido (motivo de louvor)</option>
              <option value="archived">Arquivado (concluído)</option>
            </select>
          </div>

          {/* Botões do Rodapé */}
          <div className="pt-4 border-t border-stone-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-stone-100 text-stone-700 hover:bg-stone-200 rounded-xl font-semibold transition-colors cursor-pointer text-xs"
            >
              Cancelar
            </button>
            <button
              id="prayer-editor-submit-btn"
              type="submit"
              className="px-5 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl font-semibold transition-colors inline-flex items-center gap-2 cursor-pointer shadow-xs text-xs"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{isEditing ? 'Salvar Alterações' : 'Criar Pedido'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
