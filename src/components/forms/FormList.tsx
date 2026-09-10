import React, { useState } from 'react';
import {
  FileText,
  Eye,
  Edit2,
  Copy,
  Trash2,
  Check,
  Calendar,
  Layers,
} from 'lucide-react';
import { FormDefinition } from '../../types';
import { FormStatusBadge } from './FormStatusBadge';

interface FormListProps {
  forms: FormDefinition[];
  onEdit: (form: FormDefinition) => void;
  onPreview: (form: FormDefinition) => void;
  onDuplicate: (form: FormDefinition) => void;
  onDelete: (form: FormDefinition) => void;
}

export const FormList: React.FC<FormListProps> = ({
  forms,
  onEdit,
  onPreview,
  onDuplicate,
  onDelete,
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopySlug = (e: React.MouseEvent, form: FormDefinition) => {
    e.stopPropagation();
    navigator.clipboard?.writeText(form.slug);
    setCopiedId(form.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="bg-white rounded-xl border border-stone-200 shadow-xs overflow-hidden">
      {/* Tabela para Desktop */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-stone-50 border-b border-stone-200 text-xs font-semibold text-stone-600 uppercase tracking-wider">
              <th className="py-3 px-4">Nome do Formulário</th>
              <th className="py-3 px-4">Slug</th>
              <th className="py-3 px-4 text-center">Campos</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Atualizado em</th>
              <th className="py-3 px-4 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100 text-sm">
            {forms.map((form) => {
              const formattedDate = new Date(form.updatedAt).toLocaleDateString(
                'pt-BR',
                {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                }
              );

              return (
                <tr
                  key={form.id}
                  id={`form-row-${form.id}`}
                  className="hover:bg-stone-50/80 transition-colors group"
                >
                  {/* Nome e Descrição */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-stone-100 text-stone-700 flex items-center justify-center shrink-0 group-hover:bg-stone-900 group-hover:text-white transition-colors">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="font-bold text-stone-900 block leading-tight">
                          {form.name}
                        </span>
                        {form.description && (
                          <span className="text-xs text-stone-500 line-clamp-1 max-w-xs sm:max-w-sm mt-0.5">
                            {form.description}
                          </span>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Slug */}
                  <td className="py-3.5 px-4 font-mono text-xs text-stone-500">
                    <div className="flex items-center gap-1.5">
                      <span>/{form.slug}</span>
                      <button
                        type="button"
                        onClick={(e) => handleCopySlug(e, form)}
                        title="Copiar slug"
                        className="text-stone-400 hover:text-stone-700 p-0.5 rounded transition-colors"
                      >
                        {copiedId === form.id ? (
                          <Check className="w-3 h-3 text-emerald-600" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                      </button>
                    </div>
                  </td>

                  {/* Quantidade de Campos */}
                  <td className="py-3.5 px-4 text-center">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 text-xs font-medium">
                      <Layers className="w-3 h-3 text-stone-400" />
                      {form.fields.length}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="py-3.5 px-4">
                    <FormStatusBadge status={form.status} />
                  </td>

                  {/* Atualizado */}
                  <td className="py-3.5 px-4 text-xs text-stone-500">
                    {formattedDate}
                  </td>

                  {/* Ações */}
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => onPreview(form)}
                        title="Visualizar prévia"
                        className="p-1.5 rounded-lg text-stone-500 hover:text-stone-900 hover:bg-stone-100 transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => onEdit(form)}
                        title="Editar formulário"
                        className="p-1.5 rounded-lg text-stone-700 hover:text-stone-900 hover:bg-stone-100 transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => onDuplicate(form)}
                        title="Duplicar formulário"
                        className="p-1.5 rounded-lg text-stone-500 hover:text-stone-900 hover:bg-stone-100 transition-colors"
                      >
                        <Copy className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => onDelete(form)}
                        title="Excluir formulário"
                        className="p-1.5 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Lista Mobile */}
      <div className="md:hidden divide-y divide-stone-100">
        {forms.map((form) => {
          const formattedDate = new Date(form.updatedAt).toLocaleDateString(
            'pt-BR',
            {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
            }
          );

          return (
            <div key={form.id} className="p-4 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-stone-100 text-stone-700 flex items-center justify-center shrink-0">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-stone-900 text-sm">
                      {form.name}
                    </h4>
                    <span className="text-xs font-mono text-stone-500">
                      /{form.slug}
                    </span>
                  </div>
                </div>
                <FormStatusBadge status={form.status} />
              </div>

              {form.description && (
                <p className="text-xs text-stone-600 line-clamp-2">
                  {form.description}
                </p>
              )}

              <div className="flex items-center justify-between text-xs text-stone-500 pt-1">
                <span className="flex items-center gap-1">
                  <Layers className="w-3 h-3 text-stone-400" />
                  {form.fields.length} campos
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-stone-400" />
                  {formattedDate}
                </span>
              </div>

              <div className="flex items-center gap-2 pt-2 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => onPreview(form)}
                  className="flex-1 py-1.5 px-2 bg-stone-100 text-stone-700 rounded-lg text-xs font-medium flex items-center justify-center gap-1"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Ver</span>
                </button>
                <button
                  type="button"
                  onClick={() => onEdit(form)}
                  className="flex-1 py-1.5 px-2 bg-stone-900 text-white rounded-lg text-xs font-medium flex items-center justify-center gap-1"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Editar</span>
                </button>
                <button
                  type="button"
                  onClick={() => onDuplicate(form)}
                  className="p-1.5 border border-stone-200 rounded-lg text-stone-600"
                  title="Duplicar"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => onDelete(form)}
                  className="p-1.5 border border-stone-200 rounded-lg text-rose-600"
                  title="Excluir"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
