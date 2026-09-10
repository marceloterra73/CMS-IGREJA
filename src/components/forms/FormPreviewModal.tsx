import React, { useState } from 'react';
import { X, Send, Eye, Info, CheckCircle2 } from 'lucide-react';
import { FormDefinition, FormFieldDefinition } from '../../types';

interface FormPreviewModalProps {
  form: FormDefinition | null;
  isOpen: boolean;
  onClose: () => void;
}

export const FormPreviewModal: React.FC<FormPreviewModalProps> = ({
  form,
  isOpen,
  onClose,
}) => {
  const [demoValues, setDemoValues] = useState<Record<string, any>>({});
  const [showDemoFeedback, setShowDemoFeedback] = useState(false);

  if (!isOpen || !form) return null;

  const handleFieldChange = (name: string, value: any) => {
    setDemoValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleDemoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowDemoFeedback(true);
    setTimeout(() => {
      setShowDemoFeedback(false);
    }, 4000);
  };

  // Ordenar campos por 'order'
  const sortedFields = [...form.fields].sort((a, b) => a.order - b.order);

  const renderFieldInput = (field: FormFieldDefinition) => {
    const value = demoValues[field.name] ?? '';

    switch (field.type) {
      case 'text':
        return (
          <input
            type="text"
            id={`preview-field-${field.id}`}
            value={value}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            placeholder={field.placeholder || ''}
            className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-lg text-sm text-stone-900 focus:bg-white focus:ring-2 focus:ring-stone-400 focus:outline-hidden transition-colors"
          />
        );

      case 'textarea':
        return (
          <textarea
            id={`preview-field-${field.id}`}
            rows={4}
            value={value}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            placeholder={field.placeholder || ''}
            className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-lg text-sm text-stone-900 focus:bg-white focus:ring-2 focus:ring-stone-400 focus:outline-hidden transition-colors resize-y"
          />
        );

      case 'email':
        return (
          <input
            type="email"
            id={`preview-field-${field.id}`}
            value={value}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            placeholder={field.placeholder || 'exemplo@dominio.com'}
            className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-lg text-sm text-stone-900 focus:bg-white focus:ring-2 focus:ring-stone-400 focus:outline-hidden transition-colors"
          />
        );

      case 'tel':
        return (
          <input
            type="tel"
            id={`preview-field-${field.id}`}
            value={value}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            placeholder={field.placeholder || '(00) 00000-0000'}
            className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-lg text-sm text-stone-900 focus:bg-white focus:ring-2 focus:ring-stone-400 focus:outline-hidden transition-colors"
          />
        );

      case 'number':
        return (
          <input
            type="number"
            id={`preview-field-${field.id}`}
            value={value}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            placeholder={field.placeholder || '0'}
            className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-lg text-sm text-stone-900 focus:bg-white focus:ring-2 focus:ring-stone-400 focus:outline-hidden transition-colors"
          />
        );

      case 'url':
        return (
          <input
            type="url"
            id={`preview-field-${field.id}`}
            value={value}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            placeholder={field.placeholder || 'https://'}
            className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-lg text-sm text-stone-900 focus:bg-white focus:ring-2 focus:ring-stone-400 focus:outline-hidden transition-colors"
          />
        );

      case 'date':
        return (
          <input
            type="date"
            id={`preview-field-${field.id}`}
            value={value}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-lg text-sm text-stone-900 focus:bg-white focus:ring-2 focus:ring-stone-400 focus:outline-hidden transition-colors"
          />
        );

      case 'select':
        return (
          <select
            id={`preview-field-${field.id}`}
            value={value}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-lg text-sm text-stone-900 focus:bg-white focus:ring-2 focus:ring-stone-400 focus:outline-hidden transition-colors"
          >
            <option value="">Selecione uma opção...</option>
            {field.options?.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        );

      case 'radio':
        return (
          <div className="space-y-2 pt-1">
            {field.options && field.options.length > 0 ? (
              field.options.map((opt) => (
                <label
                  key={opt.value}
                  className="flex items-center gap-2.5 text-sm text-stone-700 cursor-pointer select-none"
                >
                  <input
                    type="radio"
                    name={`preview_radio_${field.name}`}
                    value={opt.value}
                    checked={value === opt.value}
                    onChange={() => handleFieldChange(field.name, opt.value)}
                    className="w-4 h-4 text-stone-900 border-stone-300 focus:ring-stone-400"
                  />
                  <span>{opt.label}</span>
                </label>
              ))
            ) : (
              <span className="text-xs text-stone-400 italic">
                Nenhuma opção configurada neste campo de rádio.
              </span>
            )}
          </div>
        );

      case 'checkbox':
        return (
          <label className="flex items-center gap-2.5 text-sm text-stone-700 cursor-pointer select-none pt-1">
            <input
              type="checkbox"
              id={`preview-field-${field.id}`}
              checked={Boolean(value)}
              onChange={(e) => handleFieldChange(field.name, e.target.checked)}
              className="w-4 h-4 rounded text-stone-900 border-stone-300 focus:ring-stone-400"
            />
            <span>{field.placeholder || field.label}</span>
          </label>
        );

      case 'boolean':
        return (
          <div className="flex items-center justify-between p-3 rounded-lg bg-stone-50 border border-stone-200">
            <span className="text-sm font-medium text-stone-700">
              {field.label}
            </span>
            <button
              type="button"
              onClick={() => handleFieldChange(field.name, !value)}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                value ? 'bg-stone-900' : 'bg-stone-300'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                  value ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        );

      default:
        return (
          <input
            type="text"
            value={value}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-lg text-sm"
          />
        );
    }
  };

  return (
    <div
      id="modal-form-preview-backdrop"
      className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        id="modal-form-preview-content"
        className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-stone-200 my-8 overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Barra Superior Informativa */}
        <div className="bg-stone-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Eye className="w-5 h-5 text-stone-300" />
            <div>
              <h3 className="text-base font-bold">Prévia do Formulário</h3>
              <p className="text-xs text-stone-300">
                Visualização de como o formulário se comportará para os visitantes
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-stone-300 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Notificação Demonstrativa quando o usuário clica em Enviar */}
        {showDemoFeedback && (
          <div className="bg-emerald-50 border-b border-emerald-200 px-6 py-3 flex items-center gap-3 text-emerald-800 text-sm animate-in fade-in duration-200">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <strong className="block font-semibold">
                Prévia demonstrativa!
              </strong>
              <span>
                O envio real e armazenamento de submissões serão conectados em uma fase futura.
              </span>
            </div>
          </div>
        )}

        {/* Corpo do Formulário */}
        <div className="p-6 sm:p-8 max-h-[75vh] overflow-y-auto">
          {/* Cabeçalho do formulário */}
          <div className="mb-6 pb-5 border-b border-stone-200">
            <h2 className="text-2xl font-bold text-stone-900 tracking-tight">
              {form.name}
            </h2>
            {form.description && (
              <p className="text-sm text-stone-600 mt-2 leading-relaxed">
                {form.description}
              </p>
            )}
            <div className="flex items-center gap-2 mt-3">
              <span className="text-xs font-mono text-stone-400 bg-stone-100 px-2 py-0.5 rounded">
                slug: /{form.slug}
              </span>
              <span className="text-xs text-stone-500">
                • {form.fields.length} {form.fields.length === 1 ? 'campo' : 'campos'}
              </span>
            </div>
          </div>

          {/* Renderização dos Campos */}
          <form onSubmit={handleDemoSubmit} className="space-y-5">
            {sortedFields.length === 0 ? (
              <div className="text-center py-10 border-2 border-dashed border-stone-200 rounded-xl bg-stone-50 text-stone-500">
                <p className="text-sm font-medium">
                  Este formulário ainda não possui campos cadastrados.
                </p>
                <p className="text-xs text-stone-400 mt-1">
                  Abra a edição do formulário para adicionar campos.
                </p>
              </div>
            ) : (
              sortedFields.map((field) => (
                <div key={field.id} className="space-y-1.5">
                  {field.type !== 'boolean' && (
                    <label
                      htmlFor={`preview-field-${field.id}`}
                      className="block text-sm font-medium text-stone-800"
                    >
                      {field.label}
                      {field.required && (
                        <span className="text-rose-500 ml-1 font-bold">*</span>
                      )}
                    </label>
                  )}

                  {renderFieldInput(field)}

                  {field.helpText && (
                    <p className="text-xs text-stone-500 mt-1">
                      {field.helpText}
                    </p>
                  )}
                </div>
              ))
            )}

            {/* Rodapé Demonstrativo de Envio */}
            <div className="pt-6 border-t border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-xs text-stone-500">
                <Info className="w-4 h-4 text-stone-400 shrink-0" />
                <span>Campos com asterisco (*) são obrigatórios.</span>
              </div>

              <button
                type="submit"
                id="btn-preview-submit-form"
                disabled={sortedFields.length === 0}
                className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg bg-stone-900 text-white text-sm font-medium hover:bg-stone-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-xs cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Enviar formulário</span>
              </button>
            </div>
          </form>
        </div>

        {/* Rodapé do Modal */}
        <div className="bg-stone-50 px-6 py-3 border-t border-stone-200 flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-stone-700 hover:bg-stone-200 rounded-lg transition-colors cursor-pointer"
          >
            Fechar prévia
          </button>
        </div>
      </div>
    </div>
  );
};
