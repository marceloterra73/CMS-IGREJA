import React from 'react';
import { BlockType, SectionInstance, SectionId } from '../../types';
import { BlockLibraryModal } from './library/BlockLibraryModal';

export interface AddBlockModalProps {
  isOpen: boolean;
  sections?: SectionInstance[];
  defaultSectionId?: SectionId | null;
  sectionTitle?: string;
  onClose: () => void;
  onSelectBlockType: (type: BlockType, targetSectionId?: SectionId) => void;
}

/**
 * Ponto de entrada canônico e compatível da Biblioteca Visual de Blocos no Editor (Fase 28).
 * Encapsula BlockLibraryModal preservando 100% da compatibilidade regressiva.
 */
export const AddBlockModal: React.FC<AddBlockModalProps> = (props) => {
  return <BlockLibraryModal {...props} />;
};

export { BlockLibraryModal };
