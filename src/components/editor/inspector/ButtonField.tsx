import React from 'react';
import { ButtonEditableField, ButtonFieldData } from '../../../types';
import { ExternalLink, Link as LinkIcon } from 'lucide-react';

interface ButtonFieldProps {
  field: ButtonEditableField;
  value: ButtonFieldData;
  onChange: (newValue: ButtonFieldData) => void;
}

export const ButtonField: React.FC<ButtonFieldProps> = ({ field, value, onChange }) => {
  const currentData: ButtonFieldData = {
    label: value?.label || field.defaultLabel || 'Botão de Ação',
    url: value?.url || '#',
    openInNewTab: Boolean(value?.openInNewTab),
  };

  const updateLabel = (label: string) => {
    onChange({ ...currentData, label });
  };

  const updateUrl = (url: string) => {
    onChange({ ...currentData, url });
  };

  const toggleNewTab = () => {
    onChange({ ...currentData, openInNewTab: !currentData.openInNewTab });
  };

  return (
    <div className="space-y-2 p-3 rounded-xl border border-stone-200 bg-stone-50/40">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
          <LinkIcon className="w-3.5 h-3.5 text-amber-600" />
          <span>{field.label}</span>
        </label>
        {field.required && <span className="text-red-500 text-xs">*</span>}
      </div>

      {field.description && (
        <p className="text-[10px] text-stone-400">{field.description}</p>
      )}

      {/* Rótulo do Botão */}
      <div className="space-y-1">
        <label className="text-[10px] font-semibold text-stone-500 uppercase tracking-wider block">
          Texto do Botão
        </label>
        <input
          type="text"
          value={currentData.label}
          onChange={(e) => updateLabel(e.target.value)}
          placeholder={field.defaultLabel || 'Texto do botão'}
          className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-stone-200 bg-white text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
        />
      </div>

      {/* URL de Destino */}
      <div className="space-y-1">
        <label className="text-[10px] font-semibold text-stone-500 uppercase tracking-wider block">
          Link de Destino
        </label>
        <input
          type="text"
          value={currentData.url}
          onChange={(e) => updateUrl(e.target.value)}
          placeholder="https://exemplo.com ou /pagina"
          className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-stone-200 bg-white text-stone-900 font-mono text-[11px] focus:outline-none focus:ring-2 focus:ring-amber-500"
        />
      </div>

      {/* Abrir em nova aba */}
      <div className="flex items-center justify-between pt-1">
        <label className="text-[11px] text-stone-600 cursor-pointer flex items-center gap-1.5">
          <ExternalLink className="w-3 h-3 text-stone-400" />
          <span>Abrir em nova aba</span>
        </label>
        <input
          type="checkbox"
          checked={currentData.openInNewTab}
          onChange={toggleNewTab}
          className="h-3.5 w-3.5 rounded border-stone-300 text-amber-600 focus:ring-amber-500"
        />
      </div>
    </div>
  );
};
