import React from 'react';
import { NumberEditableField } from '../../../types';

interface NumberFieldProps {
  field: NumberEditableField;
  value: number;
  onChange: (newValue: number) => void;
}

export const NumberField: React.FC<NumberFieldProps> = ({ field, value, onChange }) => {
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
        {field.unit && (
          <span className="text-[10px] text-stone-400 font-medium">
            {field.unit}
          </span>
        )}
      </div>

      <input
        id={`field-${field.id}`}
        type="number"
        value={Number.isNaN(value) ? '' : value}
        min={field.min}
        max={field.max}
        step={field.step || 1}
        onChange={(e) => {
          const val = parseFloat(e.target.value);
          onChange(Number.isNaN(val) ? 0 : val);
        }}
        placeholder={field.placeholder || '0'}
        className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-stone-200 bg-white text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
      />

      {field.description && (
        <p className="text-[10px] text-stone-400 leading-tight">
          {field.description}
        </p>
      )}
    </div>
  );
};
