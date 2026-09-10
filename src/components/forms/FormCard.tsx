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
  MoreVertical,
} from 'lucide-react';
import { FormDefinition } from '../../types';
import { FormStatusBadge } from './FormStatusBadge';

interface FormCardProps {
  form: FormDefinition;
  onEdit: (form: FormDefinition) => void;
  onPreview: (form: FormDefinition) => void;
  onDuplicate: (form: FormDefinition) => void;
  onDelete: (form: FormDefinition) => void;
}

export const FormCard: React.FC<FormCardProps> = ({
  form,
  onEdit,
  onPreview,
  onDuplicate,
  onDelete,
}) => {
  const [copied, setCopied] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleCopySlug = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard?.writeText(form.slug);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formattedDate = new Date(form.updatedAt).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  return (
    <div
      id={`form-card-${form.id}`}
      className="bg-white rounded-xl border border-stone-200 p-5 hover:border-stone-300 hover:shadow-md transition-all flex flex-col justify-between group"
    >
      <div>
        {/* Cabeçalho do Card */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-lg bg-stone-100 text-stone-700 flex items-center justify-center shrink-0 group-hover:bg-stone-900 group-hover:text-white transition-colors">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-stone-900 line-clamp-1">
                {form.name}
              </h3>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-xs font-mono text-stone-500 truncate max-w-[140px] sm:max-w-[180px]">
                  /{form.slug}
                </span>
                <button
                  type="button"
                  onClick={handleCopySlug}
                  title="Copiar slug"
                  className="text-stone-400 hover:text-stone-700 p-0.5 rounded transition-colors"
                >
                  {copied ? (
                    <Check className="w-3 h-3 text-emerald-600" />
                  ) : (
                    <Copy className="w-3 h-3" />
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="relative">
            <FormStatusBadge status={form.status} />
          </div>
        </div>

        {/* Descrição */}
        <p className="text-xs text-stone-600 line-clamp-2 min-h-[32px] mb-4">
          {form.description || 'Sem descrição cadastrada.'}
        </p>

        {/* Metadados: Quantidade de Campos e Data */}
        <div className="flex items-center justify-between text-xs text-stone-500 pt-3 border-t border-stone-100 mb-4">
          <div className="flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-stone-400" />
            <span>
              {form.fields.length} {form.fields.length === 1 ? 'campo' : 'campos'}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-stone-400" />
            <span>{formattedDate}</span>
          </div>
        </div>
      </div>

      {/* Botões de Ação */}
      <div className="flex items-center gap-2 pt-2 border-t border-stone-100">
        <button
          type="button"
          onClick={() => onPreview(form)}
          className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg border border-stone-200 text-xs font-medium text-stone-700 hover:bg-stone-50 transition-colors"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>Visualizar</span>
        </button>

        <button
          type="button"
          onClick={() => onEdit(form)}
          className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-900 text-white text-xs font-medium hover:bg-stone-800 transition-colors"
        >
          <Edit2 className="w-3.5 h-3.5" />
          <span>Editar</span>
        </button>

        <button
          type="button"
          onClick={() => onDuplicate(form)}
          title="Duplicar formulário"
          className="p-1.5 rounded-lg border border-stone-200 text-stone-600 hover:bg-stone-50 hover:text-stone-900 transition-colors"
        >
          <Copy className="w-3.5 h-3.5" />
        </button>

        <button
          type="button"
          onClick={() => onDelete(form)}
          title="Excluir formulário"
          className="p-1.5 rounded-lg border border-stone-200 text-stone-600 hover:bg-rose-50 hover:border-rose-200 hover:text-rose-600 transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
