import React from 'react';
import { UrlEditableField } from '../../../types';
import { Link as LinkIcon } from 'lucide-react';

interface UrlFieldProps {
  field: UrlEditableField;
  value: string;
  onChange: (newValue: string) => void;
}

export const UrlField: React.FC<UrlFieldProps> = ({ field, value, onChange }) => {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <label
          htmlFor={`field-${field.id}`}
          className="text-[11px] font-semibold text-stone-700 block"
        >
          {field.label}
          {field.required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
        {field.allowedProtocols && (
          <span className="text-[9px] text-stone-400 font-mono">
            {field.allowedProtocols.join(', ')}
          </span>
        )}
      </div>

      <div className="relative">
        <LinkIcon className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
        <input
          id={`field-${field.id}`}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder || 'https://...'}
          className="w-full text-xs pl-8 pr-2.5 py-1.5 rounded-lg border border-stone-200 bg-white text-stone-900 font-mono text-[11px] focus:outline-none focus:ring-2 focus:ring-amber-500"
        />
      </div>

      {field.description && (
        <p className="text-[10px] text-stone-400 leading-tight">
          {field.description}
        </p>
      )}
    </div>
  );
};
