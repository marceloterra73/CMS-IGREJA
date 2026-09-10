import React, { useState, useMemo } from 'react';
import {
  FileText,
  Plus,
  CheckCircle2,
  AlertCircle,
  X,
  Search,
} from 'lucide-react';
import { FormDefinition } from '../../types';
import { INITIAL_DEMO_FORMS } from './demoFormsData';
import { ensureUniqueSlug } from './formsUtils';
import {
  FormsToolbar,
  FormStatusFilter,
  FormViewMode,
} from './FormsToolbar';
import { FormCard } from './FormCard';
import { FormList } from './FormList';
import { FormEditorModal } from './FormEditorModal';
import { FormPreviewModal } from './FormPreviewModal';
import { DeleteFormConfirmModal } from './DeleteFormConfirmModal';

export const FormsView: React.FC = () => {
  const [forms, setForms] = useState<FormDefinition[]>(INITIAL_DEMO_FORMS);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<FormStatusFilter>('all');
  const [viewMode, setViewMode] = useState<FormViewMode>('grid');

  // Modais
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingForm, setEditingForm] = useState<FormDefinition | null>(null);

  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewForm, setPreviewForm] = useState<FormDefinition | null>(null);

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [formToDelete, setFormToDelete] = useState<FormDefinition | null>(null);

  // Toast / Notificação
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage((prev) => (prev === message ? null : prev));
    }, 3500);
  };

  // Estatísticas calculadas
  const stats = useMemo(() => {
    return {
      total: forms.length,
      active: forms.filter((f) => f.status === 'active').length,
      draft: forms.filter((f) => f.status === 'draft').length,
      archived: forms.filter((f) => f.status === 'archived').length,
    };
  }, [forms]);

  // Filtragem e busca local
  const filteredForms = useMemo(() => {
    return forms.filter((form) => {
      // Filtro de status
      if (statusFilter !== 'all' && form.status !== statusFilter) {
        return false;
      }

      // Busca por name, slug ou description
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase().trim();
        const matchesName = form.name.toLowerCase().includes(query);
        const matchesSlug = form.slug.toLowerCase().includes(query);
        const matchesDesc = (form.description || '').toLowerCase().includes(query);

        if (!matchesName && !matchesSlug && !matchesDesc) {
          return false;
        }
      }

      return true;
    });
  }, [forms, statusFilter, searchTerm]);

  // Ações do Formulário
  const handleOpenNewForm = () => {
    setEditingForm(null);
    setIsEditorOpen(true);
  };

  const handleEditForm = (form: FormDefinition) => {
    setEditingForm(form);
    setIsEditorOpen(true);
  };

  const handlePreviewForm = (form: FormDefinition) => {
    setPreviewForm(form);
    setIsPreviewOpen(true);
  };

  const handleSaveForm = (savedForm: FormDefinition) => {
    setForms((prev) => {
      const exists = prev.some((f) => f.id === savedForm.id);
      if (exists) {
        showToast(`Formulário "${savedForm.name}" atualizado com sucesso.`);
        return prev.map((f) => (f.id === savedForm.id ? savedForm : f));
      } else {
        showToast(`Formulário "${savedForm.name}" criado com sucesso.`);
        return [savedForm, ...prev];
      }
    });
  };

  const handleDuplicateForm = (form: FormDefinition) => {
    const newId = `form_${Date.now()}`;
    const baseSlug = `${form.slug}-copia`;
    const newSlug = ensureUniqueSlug(
      baseSlug,
      forms.map((f) => f.slug)
    );

    const duplicated: FormDefinition = {
      ...form,
      id: newId,
      name: `${form.name} (Cópia)`,
      slug: newSlug,
      status: 'draft',
      fields: form.fields.map((field, idx) => ({
        ...field,
        id: `field_${Date.now()}_${idx}`,
        options: field.options ? [...field.options.map((o) => ({ ...o }))] : undefined,
      })),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setForms((prev) => [duplicated, ...prev]);
    showToast(`Formulário duplicado como "${duplicated.name}".`);
  };

  const handleDeleteClick = (form: FormDefinition) => {
    setFormToDelete(form);
    setIsDeleteOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!formToDelete) return;
    setForms((prev) => prev.filter((f) => f.id !== formToDelete.id));
    showToast(`Formulário "${formToDelete.name}" excluído.`);
    setIsDeleteOpen(false);
    setFormToDelete(null);
  };

  return (
    <div id="forms-view" className="space-y-6 pb-12">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-stone-900 text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-5 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="text-sm font-medium">{toastMessage}</span>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="text-stone-400 hover:text-white p-0.5"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Toolbar Principal */}
      <FormsToolbar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onNewForm={handleOpenNewForm}
        totalCount={forms.length}
        filteredCount={filteredForms.length}
        stats={stats}
      />

      {/* Área de Listagem (Grade ou Lista) */}
      {filteredForms.length === 0 ? (
        <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center shadow-xs">
          <div className="w-12 h-12 rounded-xl bg-stone-100 text-stone-400 flex items-center justify-center mx-auto mb-3">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-stone-900 mb-1">
            Nenhum formulário encontrado
          </h3>
          <p className="text-sm text-stone-500 max-w-md mx-auto mb-5">
            {searchTerm || statusFilter !== 'all'
              ? 'Tente ajustar a busca ou os filtros para localizar o formulário desejado.'
              : 'Você ainda não possui formulários cadastrados nesta sessão.'}
          </p>
          {(searchTerm || statusFilter !== 'all') ? (
            <button
              type="button"
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('all');
              }}
              className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-lg text-xs font-semibold transition-colors"
            >
              Limpar busca e filtros
            </button>
          ) : (
            <button
              type="button"
              onClick={handleOpenNewForm}
              className="inline-flex items-center gap-2 px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-xs font-semibold transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Criar primeiro formulário</span>
            </button>
          )}
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredForms.map((form) => (
            <FormCard
              key={form.id}
              form={form}
              onEdit={handleEditForm}
              onPreview={handlePreviewForm}
              onDuplicate={handleDuplicateForm}
              onDelete={handleDeleteClick}
            />
          ))}
        </div>
      ) : (
        <FormList
          forms={filteredForms}
          onEdit={handleEditForm}
          onPreview={handlePreviewForm}
          onDuplicate={handleDuplicateForm}
          onDelete={handleDeleteClick}
        />
      )}

      {/* Modal de Criação / Edição */}
      <FormEditorModal
        form={editingForm}
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        onSave={handleSaveForm}
        existingForms={forms}
      />

      {/* Modal de Prévia Visual */}
      <FormPreviewModal
        form={previewForm}
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
      />

      {/* Modal de Confirmação de Exclusão */}
      <DeleteFormConfirmModal
        form={formToDelete}
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};
