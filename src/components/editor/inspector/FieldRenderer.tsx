import React from 'react';
import { EditableField, BlockDataValue } from '../../../types';
import { TextField } from './TextField';
import { TextareaField } from './TextareaField';
import { BooleanField } from './BooleanField';
import { ButtonField } from './ButtonField';
import { ImageField } from './ImageField';
import { RichTextField } from './RichTextField';
import { UrlField } from './UrlField';
import { NumberField } from './NumberField';

interface FieldRendererProps {
  field: EditableField;
  value: BlockDataValue;
  onChange: (fieldId: string, newValue: BlockDataValue) => void;
}

/**
 * Renderizador declarativo de campos do CMS baseado estritamente no catálogo de tipos da Fase 4.
 * Tipos canônicos suportados:
 * - text
 * - textarea
 * - rich_text
 * - image
 * - url
 * - button
 * - boolean
 * - number
 * - list
 * - group
 */
export const FieldRenderer: React.FC<FieldRendererProps> = ({ field, value, onChange }) => {
  const handleFieldChange = (newVal: BlockDataValue) => {
    onChange(field.id, newVal);
  };

  switch (field.type) {
    case 'text':
      return (
        <TextField
          field={field}
          value={(value as string) ?? (field.defaultValue as string) ?? ''}
          onChange={handleFieldChange}
        />
      );

    case 'textarea':
      return (
        <TextareaField
          field={field}
          value={(value as string) ?? (field.defaultValue as string) ?? ''}
          onChange={handleFieldChange}
        />
      );

    case 'boolean':
      return (
        <BooleanField
          field={field}
          value={
            typeof value === 'boolean'
              ? value
              : typeof field.defaultValue === 'boolean'
              ? field.defaultValue
              : false
          }
          onChange={handleFieldChange}
        />
      );

    case 'button':
      return (
        <ButtonField
          field={field}
          value={
            (value as any) || {
              label: field.defaultLabel || 'Saiba Mais',
              url: '#',
              openInNewTab: false,
            }
          }
          onChange={handleFieldChange}
        />
      );

    case 'image':
      return (
        <ImageField
          field={field}
          value={(value as any) || { url: '', altText: '' }}
          onChange={handleFieldChange}
        />
      );

    case 'rich_text':
      return (
        <RichTextField
          field={field}
          value={(value as any) ?? ''}
          onChange={handleFieldChange}
        />
      );

    case 'url':
      return (
        <UrlField
          field={field}
          value={(value as string) ?? ''}
          onChange={handleFieldChange}
        />
      );

    case 'number':
      return (
        <NumberField
          field={field}
          value={
            typeof value === 'number'
              ? value
              : typeof field.defaultValue === 'number'
              ? field.defaultValue
              : 0
          }
          onChange={handleFieldChange}
        />
      );

    case 'group':
      return (
        <div className="space-y-3 p-3 rounded-xl border border-stone-200 bg-stone-50/50">
          <label className="text-xs font-bold text-stone-800 uppercase tracking-wider block">
            {field.label}
          </label>
          {field.description && (
            <p className="text-[10px] text-stone-400">{field.description}</p>
          )}
          <div className="space-y-3 pt-1">
            {field.fields.map((subField) => {
              const groupData = (value as Record<string, BlockDataValue>) || {};
              return (
                <FieldRenderer
                  key={subField.id}
                  field={subField}
                  value={groupData[subField.id]}
                  onChange={(subFieldId, subVal) => {
                    handleFieldChange({
                      ...groupData,
                      [subFieldId]: subVal,
                    });
                  }}
                />
              );
            })}
          </div>
        </div>
      );

    case 'list': {
      const listItems = Array.isArray(value) ? value : [];
      return (
        <div className="space-y-2 p-3 rounded-xl border border-stone-200 bg-stone-50/40">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-stone-800">
              {field.label}
            </label>
            <span className="text-[10px] font-mono text-stone-400">
              {listItems.length} itens
            </span>
          </div>
          {field.description && (
            <p className="text-[10px] text-stone-400">{field.description}</p>
          )}

          <div className="space-y-2 max-h-56 overflow-y-auto pr-1 scrollbar-thin">
            {listItems.map((item, index) => (
              <div
                key={index}
                className="p-2 rounded-lg border border-stone-200 bg-white flex items-center gap-2"
              >
                <div className="flex-1 min-w-0">
                  <FieldRenderer
                    field={{
                      ...field.itemField,
                      id: `${index}`,
                      label: `${field.itemLabel || 'Item'} ${index + 1}`,
                    }}
                    value={item}
                    onChange={(_, newVal) => {
                      const updated = [...listItems];
                      updated[index] = newVal;
                      handleFieldChange(updated);
                    }}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const updated = listItems.filter((_, i) => i !== index);
                    handleFieldChange(updated);
                  }}
                  className="text-stone-400 hover:text-red-600 p-1 rounded text-xs self-start mt-2"
                  title="Remover item"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={() => {
              if (field.maxItems && listItems.length >= field.maxItems) return;
              const newItem = field.itemField.defaultValue ?? '';
              handleFieldChange([...listItems, newItem]);
            }}
            className="w-full text-xs py-1.5 rounded-lg border border-dashed border-stone-300 hover:border-amber-500 hover:text-amber-700 bg-white text-stone-600 font-semibold transition-colors"
          >
            + Adicionar {field.itemLabel || 'Item'}
          </button>
        </div>
      );
    }

    default:
      return null;
  }
};
