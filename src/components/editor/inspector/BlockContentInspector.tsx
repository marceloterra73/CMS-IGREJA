import React from 'react';
import { BlockInstance, BlockDataRecord, BlockDataValue } from '../../../types';
import { BLOCK_CATALOG } from '../../../constants';
import { FieldRenderer } from './FieldRenderer';
import { FileText, AlertCircle } from 'lucide-react';

interface BlockContentInspectorProps {
  block: BlockInstance;
  onUpdateData: (newData: BlockDataRecord) => void;
}

/**
 * Inspetor visual de conteúdo estruturado do bloco.
 * Consome estritamente o BlockDataSchema registrado no BLOCK_CATALOG.
 * 
 * DIRETRIZES DA FASE 29:
 * - Não cria novo sistema de schema ou autoridade paralela.
 * - Conecta diretamente com BlockInstance.data.
 * - Para blocos sem dataSchema: exibe aviso canônico sem inventar campos.
 */
export const BlockContentInspector: React.FC<BlockContentInspectorProps> = ({
  block,
  onUpdateData,
}) => {
  const blockDef = BLOCK_CATALOG[block.type];
  const schema = blockDef?.dataSchema;
  const currentData = block.data || {};

  const handleFieldChange = (fieldId: string, newValue: BlockDataValue) => {
    const updatedData: BlockDataRecord = {
      ...currentData,
      [fieldId]: newValue,
    };
    onUpdateData(updatedData);
  };

  // Se o bloco possui schema oficial
  if (schema && schema.fields && schema.fields.length > 0) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-stone-100 pb-2">
          <div>
            <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-amber-600" />
              <span>{schema.title || 'Conteúdo do Bloco'}</span>
            </h4>
            {schema.description && (
              <p className="text-[11px] text-stone-500 mt-0.5">
                {schema.description}
              </p>
            )}
          </div>
        </div>

        <div className="space-y-3.5">
          {schema.fields.map((field) => (
            <FieldRenderer
              key={field.id}
              field={field}
              value={currentData[field.id]}
              onChange={handleFieldChange}
            />
          ))}
        </div>
      </div>
    );
  }

  // Caso o bloco NÃO possua dataSchema definido no catálogo
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-1.5 border-b border-stone-100 pb-2">
        <FileText className="w-3.5 h-3.5 text-stone-400" />
        <h4 className="text-xs font-bold text-stone-700 uppercase tracking-wider">
          Conteúdo Estruturado
        </h4>
      </div>

      <div className="p-3.5 rounded-xl border border-dashed border-stone-200 bg-stone-50/70 text-center space-y-1.5">
        <AlertCircle className="w-5 h-5 text-stone-400 mx-auto" />
        <p className="text-xs font-semibold text-stone-700">
          Este bloco ainda não possui campos editáveis definidos em seu schema.
        </p>
        <p className="text-[11px] text-stone-500 leading-relaxed">
          Os dados eclesiásticos deste módulo serão gerenciados na fase correspondente da sua respectiva área.
        </p>
      </div>

      {/* Exibe campos genéricos apenas se já existirem comprovadamente em block.data (ex: title, subtitle) */}
      {('title' in currentData || 'subtitle' in currentData) && (
        <div className="space-y-3 pt-2">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-stone-400 block">
            Campos Genéricos Básicos
          </span>
          {'title' in currentData && (
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-stone-600 block">
                Título Geral
              </label>
              <input
                type="text"
                value={(currentData.title as string) || ''}
                onChange={(e) => handleFieldChange('title', e.target.value)}
                className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-stone-200 bg-white text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          )}
          {'subtitle' in currentData && (
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-stone-600 block">
                Subtítulo / Mensagem
              </label>
              <input
                type="text"
                value={(currentData.subtitle as string) || ''}
                onChange={(e) => handleFieldChange('subtitle', e.target.value)}
                className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-stone-200 bg-white text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};
