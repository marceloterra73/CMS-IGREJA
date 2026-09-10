import React from 'react';
import { BooleanEditableField } from '../../../types';
import { Check } from 'lucide-react';

interface BooleanFieldProps {
  field: BooleanEditableField;
  value: boolean;
  onChange: (newValue: boolean) => void;
}

export const BooleanField: React.FC<BooleanFieldProps> = ({ field, value, onChange }) => {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between p-2.5 rounded-lg border border-stone-200 bg-stone-50/50">
        <div className="min-w-0 flex-1 pr-2">
          <label
            htmlFor={`field-${field.id}`}
            className="text-xs font-semibold text-stone-800 cursor-pointer block"
          >
            {field.label}
          </label>
          {field.description && (
            <p className="text-[10px] text-stone-400 leading-tight mt-0.5">
              {field.description}
            </p>
          )}
        </div>

        <button
          id={`field-${field.id}`}
          type="button"
          role="switch"
          aria-checked={value}
          onClick={() => onChange(!value)}
          className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-amber-500 ${
            value ? 'bg-amber-600' : 'bg-stone-200'
          }`}
        >
          <span
            className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out ${
              value ? 'translate-x-4' : 'translate-x-0'
            }`}
          />
        </button>
      </div>
    </div>
  );
};
