import { BlockType, SectionId, BlockId } from '../../types';

export type EditorViewport = 'desktop' | 'tablet' | 'mobile';

export type EditorMobileTab = 'structure' | 'canvas' | 'inspector';

export type SelectionTarget =
  | { type: 'page' }
  | { type: 'section'; sectionId: SectionId }
  | { type: 'block'; sectionId: SectionId; blockId: BlockId }
  | null;
