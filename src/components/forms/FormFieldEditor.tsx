import React, { useState } from 'react';
import {
  Plus,
  Trash2,
  Copy,
  ChevronUp,
  ChevronDown,
  AlertCircle,
  Check,
  MoveUp,
  MoveDown,
  HelpCircle,
  ListPlus,
  X,
} from 'lucide-react';
import { FormFieldDefinition, FormFieldType, FormFieldOption } from '../../types';
import { getFieldTypeLabel, generateSlug } from './formsUtils';

interface FormFieldEditorProps {
  fields: FormFieldDefinition[];
  onChange: (fields: FormFieldDefinition[]) => void;
}

const FIELD_TYPES: { value: FormFieldType; label: string }[] = [
  { value: 'text', label: 'Texto' },
  { value: 'textarea', label: 'Área de texto' },
  { value: 'email', label: 'E-mail' },
  { value: 'tel', label: 'Telefone' },
  { value: 'number', label: 'Número' },
  { value: 'url', label: 'URL' },
  { value: 'date', label: 'Data' },
  { value: 'select', label: 'Select' },
  { value: 'radio', label: 'Radio' },
  { value: 'checkbox', label: 'Checkbox' },
  { value: 'boolean', label: 'Booleano' },
];

export const FormFieldEditor: React.FC<FormFieldEditorProps> = ({
  fields,
  onChange,
}) => {
  const [expandedFieldId, setExpandedFieldId] = useState<string | null>(
    fields[0]?.id ?? null
  );
  const [fieldToDelete, setFieldToDelete] = useState<FormFieldDefinition | null>(
    null
  );

  // Ordenar campos pela propriedade 'order'
  const sortedFields = [...fields].sort((a, b) => a.order - b.order);

  // Adicionar novo campo
  const handleAddField = () => {
    const newOrder = sortedFields.length + 1;
    const newId = `field_${Date.now()}`;
    const newField: FormFieldDefinition = {
      id: newId,
      name: `campo_${newOrder}`,
      label: `Novo Campo ${newOrder}`,
      type: 'text',
      required: false,
      placeholder: '',
      helpText: '',
      order: newOrder,
    };

    const updated = [...fields, newField];
    onChange(updated);
    setExpandedFieldId(newId);
  };

  // Atualizar campo
  const handleUpdateField = (id: string, updates: Partial<FormFieldDefinition>) => {
    const updated = fields.map((f) => {
      if (f.id === id) {
        const next = { ...f, ...updates };

        // Se o tipo foi mudado para select ou radio e não possui opções, inicializar opções padrão
        if (
          (next.type === 'select' || next.type === 'radio') &&
          (!next.options || next.options.length === 0)
        ) {
          next.options = [
            { value: 'opcao_1', label: 'Opção 1' },
            { value: 'opcao_2', label: 'Opção 2' },
          ];
        }
        return next;
      }
      return f;
    });
    onChange(updated);
  };

  // Mover campo para cima
  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const reordered = [...sortedFields];
    const temp = reordered[index - 1];
    reordered[index - 1] = reordered[index];
    reordered[index] = temp;

    // Recalcular ordens 1-indexed
    const updated = reordered.map((f, i) => ({ ...f, order: i + 1 }));
    onChange(updated);
  };

  // Mover campo para baixo
  const handleMoveDown = (index: number) => {
    if (index === sortedFields.length - 1) return;
    const reordered = [...sortedFields];
    const temp = reordered[index + 1];
    reordered[index + 1] = reordered[index];
    reordered[index] = temp;

    // Recalcular ordens 1-indexed
    const updated = reordered.map((f, i) => ({ ...f, order: i + 1 }));
    onChange(updated);
  };

  // Duplicar campo
  const handleDuplicateField = (field: FormFieldDefinition) => {
    const newId = `field_${Date.now()}_dup`;
    const newOrder = sortedFields.length + 1;
    const duplicated: FormFieldDefinition = {
      ...field,
      id: newId,
      name: `${field.name}_copia`,
      label: `${field.label} (Cópia)`,
      order: newOrder,
      options: field.options ? [...field.options.map((o) => ({ ...o }))] : undefined,
    };

    const updated = [...fields, duplicated];
    onChange(updated);
    setExpandedFieldId(newId);
  };

  // Confirmar exclusão do campo
  const handleConfirmDelete = () => {
    if (!fieldToDelete) return;
    const remaining = fields
      .filter((f) => f.id !== fieldToDelete.id)
      .sort((a, b) => a.order - b.order)
      .map((f, i) => ({ ...f, order: i + 1 }));

    onChange(remaining);
    setFieldToDelete(null);
    if (expandedFieldId === fieldToDelete.id) {
      setExpandedFieldId(remaining[0]?.id ?? null);
    }
  };

  // Gestão de Opções para Select e Radio
  const handleAddOption = (fieldId: string) => {
    const field = fields.find((f) => f.id === fieldId);
    if (!field) return;

    const currentOptions = field.options ?? [];
    const optionNumber = currentOptions.length + 1;
    const newOption: FormFieldOption = {
      value: `opcao_${optionNumber}`,
      label: `Opção ${optionNumber}`,
    };

    handleUpdateField(fieldId, { options: [...currentOptions, newOption] });
  };

  const handleUpdateOption = (
    fieldId: string,
    optionIndex: number,
    updates: Partial<FormFieldOption>
  ) => {
    const field = fields.find((f) => f.id === fieldId);
    if (!field || !field.options) return;

    const updatedOptions = field.options.map((opt, i) => {
      if (i === optionIndex) {
        const next = { ...opt, ...updates };
        // Se atualizou o label e o value é gerado automaticamente, sincronizar slug
        if (updates.label && (!opt.value || opt.value.startsWith('opcao_'))) {
          next.value = generateSlug(updates.label);
        }
        return next;
      }
      return opt;
    });

    handleUpdateField(fieldId, { options: updatedOptions });
  };

  const handleRemoveOption = (fieldId: string, optionIndex: number) => {
    const field = fields.find((f) => f.id === fieldId);
    if (!field || !field.options) return;

    const updatedOptions = field.options.filter((_, i) => i !== optionIndex);
    handleUpdateField(fieldId, { options: updatedOptions });
  };

  const handleMoveOption = (
    fieldId: string,
    index: number,
    direction: 'up' | 'down'
  ) => {
    const field = fields.find((f) => f.id === fieldId);
    if (!field || !field.options) return;

    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= field.options.length) return;

    const reordered = [...field.options];
    const temp = reordered[targetIndex];
    reordered[targetIndex] = reordered[index];
    reordered[index] = temp;

    handleUpdateField(fieldId, { options: reordered });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-sm font-bold text-stone-900">
            Campos do Formulário
          </h4>
          <p className="text-xs text-stone-500">
            Adicione, ordene e configure os campos que os visitantes preencherão.
          </p>
        </div>

        <button
          id="btn-add-form-field"
          type="button"
          onClick={handleAddField}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-stone-900 text-white rounded-lg text-xs font-medium hover:bg-stone-800 transition-colors cursor-pointer shadow-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Adicionar campo</span>
        </button>
      </div>

      {sortedFields.length === 0 ? (
        <div className="text-center py-8 px-4 border-2 border-dashed border-stone-200 rounded-xl bg-stone-50 text-stone-500">
          <p className="text-sm font-medium">Nenhum campo adicionado ainda.</p>
          <p className="text-xs text-stone-400 mt-1">
            Clique em "+ Adicionar campo" para começar a estruturar o formulário.
          </p>
          <button
            type="button"
            onClick={handleAddField}
            className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 bg-stone-900 text-white rounded-lg text-xs font-medium hover:bg-stone-800"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Adicionar primeiro campo</span>
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {sortedFields.map((field, index) => {
            const isExpanded = expandedFieldId === field.id;
            const hasOptions =
              field.type === 'select' || field.type === 'radio';

            return (
              <div
                key={field.id}
                id={`field-row-${field.id}`}
                className={`border rounded-xl transition-all ${
                  isExpanded
                    ? 'border-stone-400 bg-white shadow-xs'
                    : 'border-stone-200 bg-stone-50/60 hover:border-stone-300'
                }`}
              >
                {/* Cabeçalho do Campo (Compacto/Resumo) */}
                <div
                  className="flex items-center justify-between p-3 cursor-pointer select-none"
                  onClick={() =>
                    setExpandedFieldId(isExpanded ? null : field.id)
                  }
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="w-6 h-6 rounded-md bg-stone-200 text-stone-700 text-xs font-mono font-bold flex items-center justify-center shrink-0">
                      {index + 1}
                    </span>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-stone-900 truncate">
                          {field.label || '(Campo sem rótulo)'}
                        </span>
                        {field.required && (
                          <span className="text-[10px] font-bold text-rose-600 bg-rose-50 border border-rose-200 px-1.5 py-0.2 rounded shrink-0">
                            Obrigatório
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-stone-500 mt-0.5">
                        <span className="font-mono text-[11px] text-stone-400">
                          {field.name}
                        </span>
                        <span>•</span>
                        <span className="px-1.5 py-0.2 rounded bg-stone-100 text-stone-600 font-medium">
                          {getFieldTypeLabel(field.type)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Ações Rápidas no Cabeçalho */}
                  <div
                    className="flex items-center gap-1 shrink-0"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      type="button"
                      onClick={() => handleMoveUp(index)}
                      disabled={index === 0}
                      title="Mover para cima"
                      className="p-1 text-stone-400 hover:text-stone-700 disabled:opacity-30 disabled:hover:text-stone-400 transition-colors"
                    >
                      <ChevronUp className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleMoveDown(index)}
                      disabled={index === sortedFields.length - 1}
                      title="Mover para baixo"
                      className="p-1 text-stone-400 hover:text-stone-700 disabled:opacity-30 disabled:hover:text-stone-400 transition-colors"
                    >
                      <ChevronDown className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDuplicateField(field)}
                      title="Duplicar campo"
                      className="p-1 text-stone-400 hover:text-stone-700 transition-colors"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setFieldToDelete(field)}
                      title="Excluir campo"
                      className="p-1 text-stone-400 hover:text-rose-600 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Corpo de Configuração (Expandido) */}
                {isExpanded && (
                  <div className="p-4 pt-2 border-t border-stone-200 bg-white rounded-b-xl space-y-4 animate-in fade-in duration-100">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {/* Rótulo do Campo (Label) */}
                      <div>
                        <label className="block text-xs font-semibold text-stone-700 mb-1">
                          Rótulo do Campo (Label) *
                        </label>
                        <input
                          type="text"
                          value={field.label}
                          onChange={(e) => {
                            const newLabel = e.target.value;
                            handleUpdateField(field.id, {
                              label: newLabel,
                              // Se o name for padrão (campo_X), sugerir slug baseado no label
                              name:
                                field.name.startsWith('campo_') || !field.name
                                  ? generateSlug(newLabel) || field.name
                                  : field.name,
                            });
                          }}
                          placeholder="Ex: Nome Completo"
                          className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-sm text-stone-900 focus:bg-white focus:ring-2 focus:ring-stone-400 focus:outline-hidden"
                        />
                      </div>

                      {/* Nome Técnico (Identificador do Campo) */}
                      <div>
                        <label className="block text-xs font-semibold text-stone-700 mb-1">
                          Nome Técnico (name) *
                        </label>
                        <input
                          type="text"
                          value={field.name}
                          onChange={(e) =>
                            handleUpdateField(field.id, {
                              name: generateSlug(e.target.value),
                            })
                          }
                          placeholder="Ex: nome_completo"
                          className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-sm font-mono text-stone-900 focus:bg-white focus:ring-2 focus:ring-stone-400 focus:outline-hidden"
                        />
                        <span className="text-[10px] text-stone-400 mt-0.5 block">
                          Identificador canônico para o envio dos dados.
                        </span>
                      </div>

                      {/* Tipo do Campo */}
                      <div>
                        <label className="block text-xs font-semibold text-stone-700 mb-1">
                          Tipo de Campo *
                        </label>
                        <select
                          value={field.type}
                          onChange={(e) =>
                            handleUpdateField(field.id, {
                              type: e.target.value as FormFieldType,
                            })
                          }
                          className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-sm text-stone-900 focus:bg-white focus:ring-2 focus:ring-stone-400 focus:outline-hidden"
                        >
                          {FIELD_TYPES.map((t) => (
                            <option key={t.value} value={t.value}>
                              {t.label} ({t.value})
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Placeholder (exceto boolean/date) */}
                      {field.type !== 'boolean' && field.type !== 'date' && (
                        <div>
                          <label className="block text-xs font-semibold text-stone-700 mb-1">
                            Placeholder (Texto de Exemplo)
                          </label>
                          <input
                            type="text"
                            value={field.placeholder || ''}
                            onChange={(e) =>
                              handleUpdateField(field.id, {
                                placeholder: e.target.value,
                              })
                            }
                            placeholder="Ex: Digite seu nome..."
                            className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-sm text-stone-900 focus:bg-white focus:ring-2 focus:ring-stone-400 focus:outline-hidden"
                          />
                        </div>
                      )}
                    </div>

                    {/* Texto de Ajuda (helpText) */}
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        Texto de Ajuda / Instrução (helpText)
                      </label>
                      <input
                        type="text"
                        value={field.helpText || ''}
                        onChange={(e) =>
                          handleUpdateField(field.id, {
                            helpText: e.target.value,
                          })
                        }
                        placeholder="Ex: Preencha com o DDD incluso para facilitar o contato."
                        className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-sm text-stone-900 focus:bg-white focus:ring-2 focus:ring-stone-400 focus:outline-hidden"
                      />
                    </div>

                    {/* Campo Obrigatório */}
                    <div className="pt-1">
                      <label className="inline-flex items-center gap-2 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={Boolean(field.required)}
                          onChange={(e) =>
                            handleUpdateField(field.id, {
                              required: e.target.checked,
                            })
                          }
                          className="w-4 h-4 rounded text-stone-900 border-stone-300 focus:ring-stone-400"
                        />
                        <span className="text-xs font-semibold text-stone-800">
                          Preenchimento obrigatório pelo visitante
                        </span>
                      </label>
                    </div>

                    {/* Editor de Opções para Select e Radio */}
                    {hasOptions && (
                      <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200 space-y-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-xs font-bold text-stone-900 block">
                              Opções de Escolha ({field.options?.length ?? 0})
                            </span>
                            <span className="text-[11px] text-stone-500">
                              Configure os valores disponíveis para seleção.
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleAddOption(field.id)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 bg-white border border-stone-300 rounded-md text-xs font-medium text-stone-700 hover:bg-stone-100 transition-colors shadow-2xs cursor-pointer"
                          >
                            <Plus className="w-3 h-3" />
                            <span>Adicionar Opção</span>
                          </button>
                        </div>

                        {(!field.options || field.options.length === 0) ? (
                          <p className="text-xs text-stone-400 italic py-2">
                            Nenhuma opção configurada. Clique em "Adicionar Opção".
                          </p>
                        ) : (
                          <div className="space-y-2">
                            {field.options.map((option, optIdx) => (
                              <div
                                key={optIdx}
                                className="flex items-center gap-2 bg-white p-2 rounded-lg border border-stone-200"
                              >
                                <span className="text-xs font-mono text-stone-400 w-4 text-center">
                                  {optIdx + 1}
                                </span>

                                <input
                                  type="text"
                                  value={option.label}
                                  onChange={(e) =>
                                    handleUpdateOption(field.id, optIdx, {
                                      label: e.target.value,
                                    })
                                  }
                                  placeholder="Rótulo da opção (ex: Sim)"
                                  className="flex-1 px-2.5 py-1 text-xs border border-stone-200 rounded bg-stone-50 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-stone-400"
                                />

                                <input
                                  type="text"
                                  value={option.value}
                                  onChange={(e) =>
                                    handleUpdateOption(field.id, optIdx, {
                                      value: generateSlug(e.target.value),
                                    })
                                  }
                                  placeholder="Valor (ex: sim)"
                                  className="w-28 sm:w-36 px-2.5 py-1 text-xs font-mono border border-stone-200 rounded bg-stone-50 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-stone-400"
                                />

                                <div className="flex items-center gap-0.5">
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleMoveOption(field.id, optIdx, 'up')
                                    }
                                    disabled={optIdx === 0}
                                    className="p-1 text-stone-400 hover:text-stone-700 disabled:opacity-30"
                                  >
                                    <MoveUp className="w-3 h-3" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleMoveOption(field.id, optIdx, 'down')
                                    }
                                    disabled={
                                      optIdx === (field.options?.length ?? 0) - 1
                                    }
                                    className="p-1 text-stone-400 hover:text-stone-700 disabled:opacity-30"
                                  >
                                    <MoveDown className="w-3 h-3" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleRemoveOption(field.id, optIdx)
                                    }
                                    className="p-1 text-stone-400 hover:text-rose-600"
                                  >
                                    <X className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Modal de Confirmação de Exclusão de Campo */}
      {fieldToDelete && (
        <div className="fixed inset-0 z-50 bg-stone-900/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-sm w-full p-5 shadow-xl border border-stone-200">
            <h4 className="text-base font-bold text-stone-900 mb-2">
              Excluir campo?
            </h4>
            <p className="text-xs text-stone-600 mb-4">
              Esta ação remove o campo{' '}
              <strong className="text-stone-900">
                "{fieldToDelete.label}"
              </strong>{' '}
              do formulário durante esta sessão.
            </p>
            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setFieldToDelete(null)}
                className="px-3 py-1.5 text-xs font-medium text-stone-600 hover:bg-stone-100 rounded-lg"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-3 py-1.5 text-xs font-medium bg-rose-600 text-white rounded-lg hover:bg-rose-700"
              >
                Excluir campo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
