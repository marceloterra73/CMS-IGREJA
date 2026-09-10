import React, { useState, useEffect } from 'react';
import {
  X,
  Save,
  Users,
  User,
  Image as ImageIcon,
  AlertCircle,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import { ChurchMinistry, MinistryStatus, MediaItem } from '../../types';
import {
  generateMinistrySlug,
  ensureUniqueMinistrySlug,
} from './ministriesUtils';
import { MediaPickerModal } from '../media/MediaPickerModal';
import { INITIAL_DEMO_MEDIA } from '../media/demoMediaData';

interface MinistryEditorModalProps {
  ministry: ChurchMinistry | null; // null = novo ministério
  isOpen: boolean;
  onClose: () => void;
  onSave: (ministry: ChurchMinistry) => void;
  existingMinistries: ChurchMinistry[];
}

export const MinistryEditorModal: React.FC<MinistryEditorModalProps> = ({
  ministry,
  isOpen,
  onClose,
  onSave,
  existingMinistries,
}) => {
  const isEditing = Boolean(ministry);

  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [isSlugManual, setIsSlugManual] = useState(false);
  const [description, setDescription] = useState('');
  const [leaderName, setLeaderName] = useState('');
  const [imageMediaId, setImageMediaId] = useState<string | undefined>(undefined);
  const [status, setStatus] = useState<MinistryStatus>('active');

  // Controle do seletor de mídia reutilizável
  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Inicialização do formulário ao abrir
  useEffect(() => {
    if (isOpen) {
      if (ministry) {
        setName(ministry.name);
        setSlug(ministry.slug);
        setIsSlugManual(true);
        setDescription(ministry.description || '');
        setLeaderName(ministry.leaderName || '');
        setImageMediaId(ministry.imageMediaId);
        setStatus(ministry.status);
      } else {
        // Novo ministério
        setName('');
        setSlug('');
        setIsSlugManual(false);
        setDescription('');
        setLeaderName('');
        setImageMediaId(undefined);
        setStatus('active');
      }
      setErrorMsg(null);
    }
  }, [isOpen, ministry]);

  if (!isOpen) return null;

  // Imagem selecionada para prévia
  const selectedImage = imageMediaId
    ? INITIAL_DEMO_MEDIA.find((m) => m.id === imageMediaId)
    : null;

  const handleNameChange = (val: string) => {
    setName(val);
    if (!isSlugManual) {
      const generated = generateMinistrySlug(val);
      setSlug(generated);
    }
  };

  const handleSlugChange = (val: string) => {
    setIsSlugManual(true);
    setSlug(generateMinistrySlug(val));
  };

  const handleSave = () => {
    setErrorMsg(null);

    // Validações obrigatórias
    if (!name.trim()) {
      setErrorMsg('O nome do ministério é obrigatório.');
      return;
    }

    // Garante slug válido e único
    const cleanBaseSlug = slug.trim() ? slug : generateMinistrySlug(name);
    const uniqueSlug = ensureUniqueMinistrySlug(
      cleanBaseSlug,
      existingMinistries,
      ministry?.id
    );

    const now = new Date().toISOString();

    const savedMinistry: ChurchMinistry = {
      id: ministry ? ministry.id : `min_${Date.now()}`,
      tenantId: ministry ? ministry.tenantId : 'ib_central',
      name: name.trim(),
      slug: uniqueSlug,
      description: description.trim() || undefined,
      leaderName: leaderName.trim() || undefined,
      imageMediaId: imageMediaId || undefined,
      status,
      createdAt: ministry?.createdAt || now,
      updatedAt: now,
    };

    onSave(savedMinistry);
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 md:p-6 animate-in fade-in duration-200">
        <div
          id="ministry-editor-modal"
          className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[92vh]"
        >
          {/* Cabeçalho do Modal */}
          <div className="px-5 py-4 border-b border-stone-200 flex items-center justify-between bg-stone-50/70">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-stone-900 text-white flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-stone-900 text-base">
                  {isEditing ? 'Editar Ministério' : 'Novo Ministério'}
                </h3>
                <p className="text-xs text-stone-500">
                  {isEditing
                    ? 'Atualize os dados, liderança e mídia do departamento.'
                    : 'Cadastre um novo ministério ou equipe da congregação.'}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Mensagem de Erro */}
          {errorMsg && (
            <div className="mx-5 mt-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Formulário com Scroll */}
          <div className="p-5 overflow-y-auto space-y-5 text-xs sm:text-sm">
            {/* Nome do Ministério */}
            <div>
              <label className="block font-semibold text-stone-800 mb-1.5">
                Nome do Ministério / Departamento <span className="text-red-500">*</span>
              </label>
              <input
                id="ministry-input-name"
                type="text"
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="Ex: Ministério de Louvor & Adoração"
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 focus:bg-white focus:ring-2 focus:ring-stone-400 focus:outline-hidden transition-all text-sm font-medium"
              />
            </div>

            {/* Slug URL */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block font-semibold text-stone-800">
                  Slug URL <span className="text-red-500">*</span>
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setIsSlugManual(false);
                    setSlug(generateMinistrySlug(name));
                  }}
                  className="text-[11px] text-stone-500 hover:text-stone-800 underline cursor-pointer"
                >
                  Regerar a partir do nome
                </button>
              </div>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 font-mono text-xs">
                  /ministerios/
                </span>
                <input
                  id="ministry-input-slug"
                  type="text"
                  value={slug}
                  onChange={(e) => handleSlugChange(e.target.value)}
                  placeholder="nome-do-ministerio"
                  className="w-full pl-28 pr-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 font-mono text-xs focus:bg-white focus:ring-2 focus:ring-stone-400 focus:outline-hidden transition-all"
                />
              </div>
            </div>

            {/* Liderança Responsável */}
            <div>
              <label className="block font-semibold text-stone-800 mb-1.5 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-stone-500" />
                <span>Liderança Responsável</span>
              </label>
              <input
                id="ministry-input-leader"
                type="text"
                value={leaderName}
                onChange={(e) => setLeaderName(e.target.value)}
                placeholder="Ex: Pr. Carlos Eduardo e Mariana Costa"
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 focus:bg-white focus:ring-2 focus:ring-stone-400 focus:outline-hidden text-xs sm:text-sm"
              />
              <p className="text-[11px] text-stone-400 mt-1">
                Nome dos pastores, diáconos ou líderes que coordenam esta frente.
              </p>
            </div>

            {/* Imagem de Capa (imageMediaId via MediaPickerModal) */}
            <div>
              <label className="block font-semibold text-stone-800 mb-1.5 flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5 text-stone-500" />
                <span>Imagem de Destaque</span>
              </label>

              {selectedImage ? (
                <div className="flex items-center gap-3 p-3 bg-stone-50 border border-stone-200 rounded-xl">
                  <img
                    src={selectedImage.url}
                    alt={selectedImage.title}
                    className="w-20 h-14 rounded-lg object-cover border border-stone-200 shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="font-semibold text-stone-800 text-xs truncate">
                      {selectedImage.title}
                    </div>
                    <div className="text-[10px] text-stone-400 truncate">
                      {selectedImage.filename}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <button
                        type="button"
                        onClick={() => setIsMediaPickerOpen(true)}
                        className="text-[11px] text-stone-700 font-medium hover:underline cursor-pointer"
                      >
                        Trocar imagem
                      </button>
                      <span className="text-stone-300">•</span>
                      <button
                        type="button"
                        onClick={() => setImageMediaId(undefined)}
                        className="text-[11px] text-red-600 hover:underline cursor-pointer"
                      >
                        Remover
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsMediaPickerOpen(true)}
                  className="w-full p-4 border border-dashed border-stone-300 hover:border-stone-400 rounded-xl bg-stone-50 hover:bg-stone-100/60 transition-colors flex flex-col items-center justify-center text-center gap-1 cursor-pointer"
                >
                  <ImageIcon className="w-5 h-5 text-stone-400" />
                  <span className="text-xs font-semibold text-stone-700">
                    Selecionar imagem da biblioteca de mídia
                  </span>
                  <span className="text-[10px] text-stone-400">
                    Fotos e banners do acervo local da congregação
                  </span>
                </button>
              )}
            </div>

            {/* Descrição do Ministério */}
            <div>
              <label className="block font-semibold text-stone-800 mb-1.5">
                Descrição do Ministério
              </label>
              <textarea
                id="ministry-input-description"
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Descreva as atividades, propósito, horários de ensaio/reunião ou objetivos deste ministério..."
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 focus:bg-white focus:ring-2 focus:ring-stone-400 focus:outline-hidden text-xs sm:text-sm leading-relaxed"
              />
              <p className="text-[11px] text-stone-400 mt-1">
                Texto seguro estruturado em parágrafos.
              </p>
            </div>

            {/* Status Canônico ('active' | 'inactive') */}
            <div>
              <label className="block font-semibold text-stone-800 mb-1.5">
                Status Operacional
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label className="relative flex flex-col p-3 border border-stone-200 rounded-xl cursor-pointer hover:bg-stone-50 transition-colors">
                  <input
                    type="radio"
                    name="ministry-status"
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
                    Em atividade regular e visível para a comunidade.
                  </span>
                </label>

                <label className="relative flex flex-col p-3 border border-stone-200 rounded-xl cursor-pointer hover:bg-stone-50 transition-colors">
                  <input
                    type="radio"
                    name="ministry-status"
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
                    Atividades suspensas temporariamente ou arquivadas.
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Rodapé do Modal com Botões */}
          <div className="px-5 py-4 border-t border-stone-200 bg-stone-50/70 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-white border border-stone-200 text-stone-700 hover:bg-stone-100 rounded-xl text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
            >
              Cancelar
            </button>

            <button
              id="btn-save-ministry"
              type="button"
              onClick={handleSave}
              className="inline-flex items-center gap-2 px-5 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs sm:text-sm font-semibold transition-all shadow-xs hover:shadow-md cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{isEditing ? 'Salvar Alterações' : 'Salvar Ministério'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Modal Reutilizável de Seleção de Imagens da Biblioteca */}
      <MediaPickerModal
        isOpen={isMediaPickerOpen}
        onClose={() => setIsMediaPickerOpen(false)}
        selectedMediaId={imageMediaId}
        onSelectImage={(media: MediaItem) => {
          setImageMediaId(media.id);
          setIsMediaPickerOpen(false);
        }}
      />
    </>
  );
};
