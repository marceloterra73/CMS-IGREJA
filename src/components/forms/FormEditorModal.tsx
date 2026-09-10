import React, { useState, useEffect } from 'react';
import {
  X,
  Save,
  FileText,
  Layers,
  Eye,
  AlertCircle,
  Sparkles,
  Check,
} from 'lucide-react';
import { FormDefinition, FormFieldDefinition, FormStatus } from '../../types';
import { generateSlug, ensureUniqueSlug } from './formsUtils';
import { FormFieldEditor } from './FormFieldEditor';
import { FormPreviewModal } from './FormPreviewModal';

interface FormEditorModalProps {
  form: FormDefinition | null; // null = novo formulário
  isOpen: boolean;
  onClose: () => void;
  onSave: (form: FormDefinition) => void;
  existingForms: FormDefinition[];
}

export const FormEditorModal: React.FC<FormEditorModalProps> = ({
  form,
  isOpen,
  onClose,
  onSave,
  existingForms,
}) => {
  const isEditing = Boolean(form);

  const [activeTab, setActiveTab] = useState<'info' | 'fields' | 'preview'>('info');
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(false);
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<FormStatus>('active');
  const [fields, setFields] = useState<FormFieldDefinition[]>([]);
  const [initialTemplate, setInitialTemplate] = useState<'empty' | 'standard'>('standard');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Inicializar estado ao abrir modal
  useEffect(() => {
    if (isOpen) {
      if (form) {
        setName(form.name);
        setSlug(form.slug);
        setIsSlugManuallyEdited(true);
        setDescription(form.description || '');
        setStatus(form.status);
        setFields(form.fields || []);
        setActiveTab('info');
      } else {
        setName('');
        setSlug('');
        setIsSlugManuallyEdited(false);
        setDescription('');
        setStatus('active');
        setInitialTemplate('standard');
        setFields([
          {
            id: `f_${Date.now()}_1`,
            name: 'nome',
            label: 'Nome Completo',
            type: 'text',
            required: true,
            placeholder: 'Seu nome completo',
            order: 1,
          },
          {
            id: `f_${Date.now()}_2`,
            name: 'email',
            label: 'E-mail',
            type: 'email',
            required: true,
            placeholder: 'exemplo@dominio.com',
            order: 2,
          },
          {
            id: `f_${Date.now()}_3`,
            name: 'mensagem',
            label: 'Mensagem',
            type: 'textarea',
            required: true,
            placeholder: 'Escreva sua mensagem...',
            order: 3,
          },
        ]);
        setActiveTab('info');
      }
      setErrorMsg(null);
    }
  }, [isOpen, form]);

  if (!isOpen) return null;

  // Atualização do Nome com geração automática de Slug
  const handleNameChange = (val: string) => {
    setName(val);
    if (!isSlugManuallyEdited) {
      const generated = generateSlug(val);
      setSlug(generated);
    }
  };

  const handleSlugChange = (val: string) => {
    setIsSlugManuallyEdited(true);
    setSlug(generateSlug(val));
  };

  // Alternar template inicial para novo formulário
  const handleTemplateChange = (tmpl: 'empty' | 'standard') => {
    setInitialTemplate(tmpl);
    if (tmpl === 'empty') {
      setFields([]);
    } else {
      setFields([
        {
          id: `f_${Date.now()}_1`,
          name: 'nome',
          label: 'Nome Completo',
          type: 'text',
          required: true,
          placeholder: 'Seu nome completo',
          order: 1,
        },
        {
          id: `f_${Date.now()}_2`,
          name: 'email',
          label: 'E-mail',
          type: 'email',
          required: true,
          placeholder: 'exemplo@dominio.com',
          order: 2,
        },
        {
          id: `f_${Date.now()}_3`,
          name: 'mensagem',
          label: 'Mensagem',
          type: 'textarea',
          required: true,
          placeholder: 'Escreva sua mensagem...',
          order: 3,
        },
      ]);
    }
  };

  // Validação e Salvamento
  const handleSave = () => {
    if (!name.trim()) {
      setErrorMsg('Por favor, informe o nome do formulário.');
      setActiveTab('info');
      return;
    }

    const finalSlug = ensureUniqueSlug(
      slug.trim() || generateSlug(name),
      existingForms.map((f) => f.slug),
      form?.id,
      existingForms
    );

    const updatedForm: FormDefinition = {
      id: form?.id || `form_${Date.now()}`,
      tenantId: form?.tenantId || 'tenant_batista_central',
      name: name.trim(),
      slug: finalSlug,
      description: description.trim() || undefined,
      status,
      fields: fields.map((f, i) => ({ ...f, order: i + 1 })),
      createdAt: form?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onSave(updatedForm);
    onClose();
  };

  // Estrutura temporária para visualização na aba Prévia
  const currentPreviewForm: FormDefinition = {
    id: form?.id || 'temp_preview',
    tenantId: form?.tenantId || 'tenant_batista_central',
    name: name || 'Sem Nome',
    slug: slug || 'sem-slug',
    description: description,
    status,
    fields,
    createdAt: form?.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  return (
    <div
      id="modal-form-editor-backdrop"
      className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        id="modal-form-editor-content"
        className="bg-white rounded-2xl max-w-3xl w-full shadow-2xl border border-stone-200 my-6 overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cabeçalho do Modal */}
        <div className="bg-stone-50 px-6 py-4 border-b border-stone-200 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-stone-900 text-white flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-stone-900">
                {isEditing ? `Editar: ${form?.name}` : 'Novo Formulário'}
              </h3>
              <p className="text-xs text-stone-500">
                {isEditing
                  ? 'Configure as informações e os campos do formulário.'
                  : 'Crie um novo formulário para o site da sua igreja.'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-stone-400 hover:text-stone-600 p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Abas de Navegação */}
        <div className="px-6 pt-3 border-b border-stone-200 bg-white flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('info')}
            className={`pb-3 px-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 cursor-pointer ${
              activeTab === 'info'
                ? 'border-stone-900 text-stone-900 font-bold'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Informações</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('fields')}
            className={`pb-3 px-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 cursor-pointer ${
              activeTab === 'fields'
                ? 'border-stone-900 text-stone-900 font-bold'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Campos ({fields.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('preview')}
            className={`pb-3 px-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 cursor-pointer ${
              activeTab === 'preview'
                ? 'border-stone-900 text-stone-900 font-bold'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <Eye className="w-4 h-4" />
            <span>Prévia</span>
          </button>
        </div>

        {/* Mensagem de Erro */}
        {errorMsg && (
          <div className="bg-rose-50 border-b border-rose-200 px-6 py-2.5 flex items-center gap-2 text-rose-700 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Conteúdo da Aba Ativa */}
        <div className="p-6 overflow-y-auto flex-1 space-y-5">
          {activeTab === 'info' && (
            <div className="space-y-4">
              {/* Nome */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Nome do Formulário *
                </label>
                <input
                  id="form-name-input"
                  type="text"
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="Ex: Pedido de Oração"
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-lg text-sm text-stone-900 focus:bg-white focus:ring-2 focus:ring-stone-400 focus:outline-hidden"
                />
              </div>

              {/* Slug */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Slug (Identificador URL) *
                </label>
                <div className="flex items-center">
                  <span className="px-3 py-2.5 bg-stone-100 border border-r-0 border-stone-200 rounded-l-lg text-xs font-mono text-stone-500">
                    /
                  </span>
                  <input
                    id="form-slug-input"
                    type="text"
                    value={slug}
                    onChange={(e) => handleSlugChange(e.target.value)}
                    placeholder="pedido-de-oracao"
                    className="flex-1 px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-r-lg text-sm font-mono text-stone-900 focus:bg-white focus:ring-2 focus:ring-stone-400 focus:outline-hidden"
                  />
                </div>
                <span className="text-[11px] text-stone-400 mt-1 block">
                  Gerado automaticamente a partir do nome. Pode ser ajustado conforme necessário.
                </span>
              </div>

              {/* Status */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Status de Disponibilidade *
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as FormStatus)}
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-lg text-sm text-stone-900 focus:bg-white focus:ring-2 focus:ring-stone-400 focus:outline-hidden"
                >
                  <option value="active">Ativo (visível e operante)</option>
                  <option value="draft">Rascunho (em edição interna)</option>
                  <option value="archived">Arquivado (inativo no site)</option>
                </select>
              </div>

              {/* Descrição */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Descrição ou Instrução Geral
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Instruções exibidas no topo do formulário para orientar os membros ou visitantes..."
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-lg text-sm text-stone-900 focus:bg-white focus:ring-2 focus:ring-stone-400 focus:outline-hidden resize-y"
                />
              </div>

              {/* Opção de Estrutura Inicial (Apenas para Novo Formulário) */}
              {!isEditing && (
                <div className="pt-2 border-t border-stone-200">
                  <label className="block text-xs font-semibold text-stone-700 mb-2">
                    Estrutura Inicial de Campos:
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => handleTemplateChange('standard')}
                      className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                        initialTemplate === 'standard'
                          ? 'border-stone-900 bg-stone-50/80 ring-1 ring-stone-900'
                          : 'border-stone-200 bg-white hover:border-stone-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-stone-900">
                          Padrão (Recomendado)
                        </span>
                        {initialTemplate === 'standard' && (
                          <Check className="w-4 h-4 text-stone-900" />
                        )}
                      </div>
                      <p className="text-[11px] text-stone-500 mt-1">
                        Inicia com 3 campos essenciais: Nome, E-mail e Mensagem.
                      </p>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleTemplateChange('empty')}
                      className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                        initialTemplate === 'empty'
                          ? 'border-stone-900 bg-stone-50/80 ring-1 ring-stone-900'
                          : 'border-stone-200 bg-white hover:border-stone-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-stone-900">
                          Formulário Vazio
                        </span>
                        {initialTemplate === 'empty' && (
                          <Check className="w-4 h-4 text-stone-900" />
                        )}
                      </div>
                      <p className="text-[11px] text-stone-500 mt-1">
                        Comece do zero sem nenhum campo pré-configurado.
                      </p>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'fields' && (
            <FormFieldEditor fields={fields} onChange={setFields} />
          )}

          {activeTab === 'preview' && (
            <div className="border border-stone-200 rounded-xl p-6 bg-stone-50/40">
              <div className="max-w-xl mx-auto bg-white p-6 rounded-xl border border-stone-200 shadow-xs">
                <h4 className="text-xl font-bold text-stone-900">
                  {name || 'Nome do Formulário'}
                </h4>
                {description && (
                  <p className="text-xs text-stone-600 mt-1">{description}</p>
                )}
                <div className="mt-4 pt-4 border-t border-stone-100 space-y-4">
                  {fields.length === 0 ? (
                    <p className="text-xs text-stone-400 italic text-center py-4">
                      Nenhum campo configurado para prévia.
                    </p>
                  ) : (
                    fields.map((f, i) => (
                      <div key={f.id || i} className="space-y-1">
                        <label className="text-xs font-semibold text-stone-700 block">
                          {f.label}
                          {f.required && (
                            <span className="text-rose-500 ml-0.5">*</span>
                          )}
                        </label>
                        <input
                          type="text"
                          disabled
                          placeholder={f.placeholder || `(${f.type})`}
                          className="w-full px-3 py-2 bg-stone-100 border border-stone-200 rounded text-xs text-stone-500 cursor-not-allowed"
                        />
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Rodapé de Ações */}
        <div className="bg-stone-50 px-6 py-4 border-t border-stone-200 flex items-center justify-between shrink-0">
          <span className="text-xs text-stone-500 hidden sm:inline">
            Modo em memória local da sessão atual
          </span>

          <div className="flex items-center gap-3 ml-auto">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-stone-700 hover:bg-stone-200 rounded-lg transition-colors cursor-pointer"
            >
              Cancelar
            </button>

            <button
              id="btn-save-form"
              type="button"
              onClick={handleSave}
              className="inline-flex items-center gap-2 px-5 py-2 bg-stone-900 text-white rounded-lg text-sm font-medium hover:bg-stone-800 transition-colors shadow-xs cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{isEditing ? 'Salvar Alterações' : 'Criar Formulário'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
