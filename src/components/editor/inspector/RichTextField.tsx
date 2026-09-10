import React from 'react';
import { RichTextEditableField, RichTextFieldData } from '../../../types';
import { FileText, ShieldAlert } from 'lucide-react';

interface RichTextFieldProps {
  field: RichTextEditableField;
  value: RichTextFieldData | string;
  onChange: (newValue: RichTextFieldData | string) => void;
}

export const RichTextField: React.FC<RichTextFieldProps> = ({ field, value, onChange }) => {
  // Extrai o texto limpo sem expor HTML
  const rawText =
    typeof value === 'string'
      ? value
      : value?.rawText || '';

  const handleChange = (newText: string) => {
    if (field.maxLength && newText.length > field.maxLength) {
      return;
    }
    // Se o valor original já era um objeto RichTextFieldData, mantém a estrutura
    if (typeof value === 'object' && value !== null) {
      onChange({ ...value, rawText: newText });
    } else {
      // Caso contrário atualiza como string ou objeto estruturado seguro
      onChange(newText);
    }
  };

  return (
    <div className="space-y-1.5 p-3 rounded-xl border border-stone-200 bg-stone-50/40">
      <div className="flex items-center justify-between">
        <label
          htmlFor={`field-${field.id}`}
          className="text-xs font-bold text-stone-800 flex items-center gap-1.5"
        >
          <FileText className="w-3.5 h-3.5 text-amber-600" />
          <span>{field.label}</span>
          {field.required && <span className="text-red-500 text-xs">*</span>}
        </label>
        {field.maxLength && (
          <span className="text-[10px] text-stone-400 font-mono">
            {rawText.length}/{field.maxLength}
          </span>
        )}
      </div>

      {field.description && (
        <p className="text-[10px] text-stone-400">{field.description}</p>
      )}

      {/* Editor Estruturado Baseado em Parágrafos (Sem HTML Livre) */}
      <textarea
        id={`field-${field.id}`}
        rows={5}
        value={rawText}
        onChange={(e) => handleChange(e.target.value)}
        placeholder={field.placeholder || 'Digite o texto institucional da igreja...'}
        className="w-full text-xs p-2.5 rounded-lg border border-stone-200 bg-white text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500 leading-relaxed font-normal"
      />

      <div className="flex items-center gap-1.5 text-[10px] text-stone-400 pt-0.5">
        <ShieldAlert className="w-3 h-3 text-amber-600/80 shrink-0" />
        <span>Texto puro estruturado com suporte a quebras de parágrafo. Sem injeção de HTML.</span>
      </div>
    </div>
  );
};
