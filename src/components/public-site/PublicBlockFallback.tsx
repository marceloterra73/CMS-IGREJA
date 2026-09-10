import React from 'react';
import { AlertCircle } from 'lucide-react';
import { BlockInstance } from '../../types';

interface PublicBlockFallbackProps {
  block: BlockInstance;
  reason?: string;
}

/**
 * Fallback visual seguro e neutro para blocos desconhecidos ou dados inválidos (Fase 50).
 *
 * PROIBIÇÕES ARQUITETURAIS:
 * - Não derruba a renderização da página inteira.
 * - Não esconde silenciosamente o erro estrutural.
 * - Não altera os dados originais no CMS.
 */
export const PublicBlockFallback: React.FC<PublicBlockFallbackProps> = ({
  block,
  reason,
}) => {
  return (
    <div
      data-block-id={block.id}
      data-block-type={block.type}
      className="my-4 p-6 rounded-xl border border-dashed border-stone-300 bg-stone-50/80 text-stone-700 flex items-start gap-3.5 max-w-2xl mx-auto"
    >
      <div className="p-2 rounded-lg bg-stone-200/80 text-stone-600 shrink-0">
        <AlertCircle className="w-5 h-5" />
      </div>
      <div className="space-y-1">
        <h4 className="text-sm font-semibold text-stone-800">
          Bloco não disponível ({block.type})
        </h4>
        <p className="text-xs text-stone-500 leading-relaxed">
          {reason ||
            'O tipo de bloco especificado não possui renderizador público registrado ou sua estrutura não pôde ser interpretada. Os dados permanecem preservados no CMS.'}
        </p>
        <span className="inline-block text-[10px] font-mono text-stone-400 bg-stone-100 px-1.5 py-0.5 rounded border border-stone-200">
          ID: {block.id} • Ordem: {block.order}
        </span>
      </div>
    </div>
  );
};
