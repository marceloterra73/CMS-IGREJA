import React, { useState, useEffect, useMemo } from 'react';
import {
  X,
  Save,
  Video,
  Calendar,
  User,
  Image as ImageIcon,
  AlertCircle,
  BookOpen,
  Headphones,
  Link as LinkIcon,
} from 'lucide-react';
import { ChurchSermon, SermonStatus, MediaItem } from '../../types';
import {
  generateSermonSlug,
  ensureUniqueSermonSlug,
  isValidVideoUrl,
} from './sermonsUtils';
import { MediaPickerModal } from '../media/MediaPickerModal';
import { INITIAL_DEMO_MEDIA } from '../media/demoMediaData';

interface SermonEditorModalProps {
  sermon: ChurchSermon | null; // null = novo sermão
  isOpen: boolean;
  onClose: () => void;
  onSave: (sermon: ChurchSermon) => void;
  existingSermons: ChurchSermon[];
}

export const SermonEditorModal: React.FC<SermonEditorModalProps> = ({
  sermon,
  isOpen,
  onClose,
  onSave,
  existingSermons,
}) => {
  const isEditing = Boolean(sermon);

  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [isSlugManual, setIsSlugManual] = useState(false);
  const [description, setDescription] = useState('');
  const [preacher, setPreacher] = useState('');
  const [date, setDate] = useState('');
  const [scriptureReference, setScriptureReference] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [audioMediaId, setAudioMediaId] = useState<string | undefined>(undefined);
  const [thumbnailMediaId, setThumbnailMediaId] = useState<string | undefined>(undefined);
  const [status, setStatus] = useState<SermonStatus>('draft');

  // Controle do seletor de mídia de imagem (reutiliza MediaPickerModal existente)
  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Lista de áudios disponíveis no acervo para integração com audioMediaId
  const availableAudios = useMemo(() => {
    return INITIAL_DEMO_MEDIA.filter((m) => m.type === 'audio');
  }, []);

  // Inicialização do formulário
  useEffect(() => {
    if (isOpen) {
      if (sermon) {
        setTitle(sermon.title);
        setSlug(sermon.slug);
        setIsSlugManual(true);
        setDescription(sermon.description || '');
        setPreacher(sermon.preacher);
        setDate(sermon.date ? sermon.date.split('T')[0] : '');
        setScriptureReference(sermon.scriptureReference || '');
        setVideoUrl(sermon.videoUrl || '');
        setAudioMediaId(sermon.audioMediaId);
        setThumbnailMediaId(sermon.thumbnailMediaId);
        setStatus(sermon.status);
      } else {
        // Novo sermão
        setTitle('');
        setSlug('');
        setIsSlugManual(false);
        setDescription('');
        setPreacher('Pr. Roberto Silveira');
        const todayStr = new Date().toISOString().split('T')[0];
        setDate(todayStr);
        setScriptureReference('');
        setVideoUrl('');
        setAudioMediaId(undefined);
        setThumbnailMediaId('med_02'); // Imagem de culto padrão
        setStatus('draft');
      }
      setErrorMsg(null);
    }
  }, [isOpen, sermon]);

  if (!isOpen) return null;

  // Imagem selecionada para prévia
  const selectedThumbnail = thumbnailMediaId
    ? INITIAL_DEMO_MEDIA.find((m) => m.id === thumbnailMediaId)
    : null;

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!isSlugManual) {
      const generated = generateSermonSlug(val);
      setSlug(generated);
    }
  };

  const handleSlugChange = (val: string) => {
    setIsSlugManual(true);
    setSlug(generateSermonSlug(val));
  };

  const handleSave = () => {
    setErrorMsg(null);

    // Validações obrigatórias
    if (!title.trim()) {
      setErrorMsg('O título do sermão é obrigatório.');
      return;
    }

    if (!preacher.trim()) {
      setErrorMsg('O nome do pregador é obrigatório.');
      return;
    }

    if (!date) {
      setErrorMsg('A data do sermão é obrigatória.');
      return;
    }

    // Validação de segurança da URL de vídeo
    if (videoUrl.trim() && !isValidVideoUrl(videoUrl)) {
      setErrorMsg(
        'A URL do vídeo deve começar estritamente com https:// ou http:// e não conter scripts ou formatos inseguros.'
      );
      return;
    }

    // Garante slug válido e único
    const cleanBaseSlug = slug.trim() ? slug : generateSermonSlug(title);
    const uniqueSlug = ensureUniqueSermonSlug(
      cleanBaseSlug,
      existingSermons,
      sermon?.id
    );

    const now = new Date().toISOString();

    const savedSermon: ChurchSermon = {
      id: sermon ? sermon.id : `sermon_${Date.now()}`,
      tenantId: sermon ? sermon.tenantId : 'ib_central',
      title: title.trim(),
      slug: uniqueSlug,
      description: description.trim() || undefined,
      preacher: preacher.trim(),
      date,
      scriptureReference: scriptureReference.trim() || undefined,
      videoUrl: videoUrl.trim() || undefined,
      audioMediaId: audioMediaId || undefined,
      thumbnailMediaId: thumbnailMediaId || undefined,
      status,
      createdAt: sermon ? sermon.createdAt : now,
      updatedAt: now,
    };

    onSave(savedSermon);
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 md:p-6 animate-in fade-in duration-200">
        <div
          id="sermon-editor-modal"
          className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[92vh]"
        >
          {/* Cabeçalho do Modal */}
          <div className="px-5 py-4 border-b border-stone-200 flex items-center justify-between bg-stone-50/70">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-stone-900 text-white flex items-center justify-center">
                <Video className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-stone-900 text-base">
                  {isEditing ? 'Editar Sermão' : 'Novo Sermão'}
                </h3>
                <p className="text-xs text-stone-500">
                  {isEditing
                    ? 'Altere os dados, referências e mídias do sermão.'
                    : 'Cadastre uma nova mensagem com áudio, vídeo ou estudo.'}
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
            {/* Título do Sermão */}
            <div>
              <label className="block font-semibold text-stone-800 mb-1.5">
                Título do Sermão <span className="text-red-500">*</span>
              </label>
              <input
                id="sermon-input-title"
                type="text"
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="Ex: A Certeza da Esperança em Dias Incertos"
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
                    setSlug(generateSermonSlug(title));
                  }}
                  className="text-[11px] text-stone-500 hover:text-stone-800 underline cursor-pointer"
                >
                  Regerar a partir do título
                </button>
              </div>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 font-mono text-xs">
                  /sermoes/
                </span>
                <input
                  id="sermon-input-slug"
                  type="text"
                  value={slug}
                  onChange={(e) => handleSlugChange(e.target.value)}
                  placeholder="titulo-do-sermao"
                  className="w-full pl-22 pr-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 font-mono text-xs focus:bg-white focus:ring-2 focus:ring-stone-400 focus:outline-hidden transition-all"
                />
              </div>
            </div>

            {/* Pregador, Data e Passagem Bíblica (Grid 3 colunas) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Pregador */}
              <div>
                <label className="block font-semibold text-stone-800 mb-1.5 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-stone-500" />
                  <span>Pregador(a)</span> <span className="text-red-500">*</span>
                </label>
                <input
                  id="sermon-input-preacher"
                  type="text"
                  value={preacher}
                  onChange={(e) => setPreacher(e.target.value)}
                  placeholder="Ex: Pr. Roberto Silveira"
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 focus:bg-white focus:ring-2 focus:ring-stone-400 focus:outline-hidden text-xs"
                />
              </div>

              {/* Data da Pregação */}
              <div>
                <label className="block font-semibold text-stone-800 mb-1.5 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-stone-500" />
                  <span>Data da Mensagem</span> <span className="text-red-500">*</span>
                </label>
                <input
                  id="sermon-input-date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 focus:bg-white focus:ring-2 focus:ring-stone-400 focus:outline-hidden text-xs"
                />
              </div>

              {/* Passagem Bíblica */}
              <div>
                <label className="block font-semibold text-stone-800 mb-1.5 flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-stone-500" />
                  <span>Passagem Bíblica</span>
                </label>
                <input
                  id="sermon-input-scripture"
                  type="text"
                  value={scriptureReference}
                  onChange={(e) => setScriptureReference(e.target.value)}
                  placeholder="Ex: Romanos 8:28-39"
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 focus:bg-white focus:ring-2 focus:ring-stone-400 focus:outline-hidden text-xs"
                />
              </div>
            </div>

            {/* URL do Vídeo (Seguro) */}
            <div>
              <label className="block font-semibold text-stone-800 mb-1.5 flex items-center gap-1.5">
                <Video className="w-3.5 h-3.5 text-red-600" />
                <span>Link do Vídeo (YouTube, Vimeo ou gravação externa)</span>
              </label>
              <div className="relative">
                <LinkIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  id="sermon-input-video"
                  type="url"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="w-full pl-9 pr-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 focus:bg-white focus:ring-2 focus:ring-stone-400 focus:outline-hidden text-xs"
                />
              </div>
              <p className="text-[11px] text-stone-400 mt-1">
                Apenas links seguros começando com <code>https://</code> ou <code>http://</code>.
              </p>
            </div>

            {/* Integração de Mídia: Imagem de Capa e Áudio */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-stone-100">
              {/* Imagem de Capa (thumbnailMediaId via MediaPickerModal) */}
              <div>
                <label className="block font-semibold text-stone-800 mb-1.5 flex items-center gap-1.5">
                  <ImageIcon className="w-3.5 h-3.5 text-stone-500" />
                  <span>Imagem de Capa (Thumbnail)</span>
                </label>

                {selectedThumbnail ? (
                  <div className="flex items-center gap-3 p-2.5 bg-stone-50 border border-stone-200 rounded-xl">
                    <img
                      src={selectedThumbnail.url}
                      alt={selectedThumbnail.title}
                      className="w-16 h-12 rounded-lg object-cover border border-stone-200 shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="font-semibold text-stone-800 text-xs truncate">
                        {selectedThumbnail.title}
                      </div>
                      <div className="text-[10px] text-stone-400 truncate">
                        {selectedThumbnail.filename}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <button
                          type="button"
                          onClick={() => setIsMediaPickerOpen(true)}
                          className="text-[11px] text-stone-700 font-medium hover:underline cursor-pointer"
                        >
                          Trocar
                        </button>
                        <span className="text-stone-300">•</span>
                        <button
                          type="button"
                          onClick={() => setThumbnailMediaId(undefined)}
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
                      Selecionar imagem do acervo
                    </span>
                    <span className="text-[10px] text-stone-400">
                      Biblioteca de mídia da congregação
                    </span>
                  </button>
                )}
              </div>

              {/* Mensagem em Áudio (audioMediaId) */}
              <div>
                <label className="block font-semibold text-stone-800 mb-1.5 flex items-center gap-1.5">
                  <Headphones className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Áudio / Podcast do Sermão</span>
                </label>

                <div className="space-y-2">
                  <select
                    id="sermon-select-audio"
                    value={audioMediaId || ''}
                    onChange={(e) => setAudioMediaId(e.target.value || undefined)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 focus:bg-white focus:ring-2 focus:ring-stone-400 focus:outline-hidden text-xs"
                  >
                    <option value="">— Sem áudio associado —</option>
                    {availableAudios.map((audio) => (
                      <option key={audio.id} value={audio.id}>
                        {audio.title} ({audio.filename})
                      </option>
                    ))}
                  </select>

                  <div className="p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-[11px] text-stone-500 flex items-start gap-2">
                    <Headphones className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                    <div>
                      {audioMediaId ? (
                        <>
                          <strong className="text-stone-700 block font-medium">
                            Áudio selecionado do acervo:
                          </strong>
                          <span>
                            {availableAudios.find((a) => a.id === audioMediaId)?.title ||
                              audioMediaId}
                          </span>
                        </>
                      ) : (
                        <span>
                          Selecione um arquivo de áudio ou gravação presente na biblioteca de mídia
                          da congregação.
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Descrição e Resumo da Mensagem */}
            <div>
              <label className="block font-semibold text-stone-800 mb-1.5">
                Descrição e Esboço da Mensagem
              </label>
              <textarea
                id="sermon-input-description"
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Breve resumo da mensagem, tópicos principais ou notas para a congregação..."
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 focus:bg-white focus:ring-2 focus:ring-stone-400 focus:outline-hidden text-xs sm:text-sm leading-relaxed"
              />
              <p className="text-[11px] text-stone-400 mt-1">
                Texto seguro e estruturado em parágrafos. Não requer formatação HTML.
              </p>
            </div>

            {/* Status Canônico */}
            <div>
              <label className="block font-semibold text-stone-800 mb-1.5">
                Status Editorial
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  {
                    value: 'draft' as SermonStatus,
                    label: 'Rascunho',
                    desc: 'Salvo internamente, invisível ao público',
                    color: 'peer-checked:border-amber-500 peer-checked:bg-amber-50/40',
                  },
                  {
                    value: 'published' as SermonStatus,
                    label: 'Publicado',
                    desc: 'Acessível na página de sermões da igreja',
                    color: 'peer-checked:border-emerald-500 peer-checked:bg-emerald-50/40',
                  },
                  {
                    value: 'archived' as SermonStatus,
                    label: 'Arquivado',
                    desc: 'Mensagem guardada para consulta histórica',
                    color: 'peer-checked:border-stone-500 peer-checked:bg-stone-100',
                  },
                ].map((item) => (
                  <label
                    key={item.value}
                    className="relative flex flex-col p-3 border border-stone-200 rounded-xl cursor-pointer hover:bg-stone-50 transition-colors"
                  >
                    <input
                      type="radio"
                      name="sermon-status"
                      value={item.value}
                      checked={status === item.value}
                      onChange={() => setStatus(item.value)}
                      className="sr-only peer"
                    />
                    <div
                      className={`absolute inset-0 rounded-xl border-2 pointer-events-none transition-all ${
                        status === item.value
                          ? item.value === 'published'
                            ? 'border-emerald-500 bg-emerald-50/20'
                            : item.value === 'draft'
                            ? 'border-amber-500 bg-amber-50/20'
                            : 'border-stone-600 bg-stone-50'
                          : 'border-transparent'
                      }`}
                    />
                    <span className="font-bold text-xs text-stone-900 relative z-10">
                      {item.label}
                    </span>
                    <span className="text-[10px] text-stone-500 mt-0.5 leading-tight relative z-10">
                      {item.desc}
                    </span>
                  </label>
                ))}
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
              id="btn-save-sermon"
              type="button"
              onClick={handleSave}
              className="inline-flex items-center gap-2 px-5 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs sm:text-sm font-semibold transition-all shadow-xs hover:shadow-md cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{isEditing ? 'Salvar Alterações' : 'Salvar Sermão'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Modal Reutilizável de Seleção de Imagens da Biblioteca */}
      <MediaPickerModal
        isOpen={isMediaPickerOpen}
        onClose={() => setIsMediaPickerOpen(false)}
        selectedMediaId={thumbnailMediaId}
        onSelectImage={(media: MediaItem) => {
          setThumbnailMediaId(media.id);
          setIsMediaPickerOpen(false);
        }}
      />
    </>
  );
};
