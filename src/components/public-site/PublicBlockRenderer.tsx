import React from 'react';
import { PublicBlockFallback } from './PublicBlockFallback';
import {
  PUBLIC_BLOCK_REGISTRY,
  PublicBlockRendererProps,
} from './PublicBlockRegistry';

/**
 * Renderizador canônico de um bloco público do CMS (Fase 50).
 *
 * Princípio Arquitetural:
 * PÁGINAS -> SEÇÕES -> BLOCOS -> CONFIGURAÇÕES -> DADOS
 *
 * Tratamento de erros e segurança:
 * - Se o bloco for invisível (isVisible === false), não é renderizado.
 * - Se o tipo de bloco for desconhecido, aciona PublicBlockFallback.
 * - Se os dados do bloco forem inválidos, apresenta fallback seguro sem derrubar o site.
 */
export const PublicBlockRenderer: React.FC<PublicBlockRendererProps> = (props) => {
  const { block } = props;

  // Respeito à visibilidade canônica
  if (!block || block.isVisible === false) {
    return null;
  }

  // Resolução do componente através do registry
  const BlockComponent = PUBLIC_BLOCK_REGISTRY[block.type];

  if (!BlockComponent) {
    return (
      <PublicBlockFallback
        block={block}
        reason={`O tipo de bloco "${block.type}" não possui renderizador público disponível.`}
      />
    );
  }

  try {
    return <BlockComponent {...props} />;
  } catch (err) {
    return (
      <PublicBlockFallback
        block={block}
        reason={`Falha ao interpretar os dados deste bloco (${
          err instanceof Error ? err.message : 'Dados estruturais inválidos'
        }).`}
      />
    );
  }
};
