import React from 'react';
import { TextEditableField } from '../../../types';

interface TextFieldProps {
  field: TextEditableField;
  value: string;
  onChange: (newValue: string) => void;
}

export const TextField: React.FC<TextFieldProps> = ({ field, value, onChange }) => {
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
        {field.maxLength && (
          <span className="text-[10px] text-stone-400 font-mono">
            {value.length}/{field.maxLength}
          </span>
        )}
      </div>

      <input
        id={`field-${field.id}`}
        type="text"
        value={value}
        onChange={(e) => {
          if (field.maxLength && e.target.value.length > field.maxLength) {
            return;
          }
          onChange(e.target.value);
        }}
        placeholder={field.placeholder || ''}
        className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-stone-200 bg-white text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
      />

      {field.description && (
        <p className="text-[10px] text-stone-400 leading-tight">
          {field.description}
        </p>
      )}
    </div>
  );
};
