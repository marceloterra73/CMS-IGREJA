/**
 * CMS CORE — DOMÍNIO: BLOCKS (BLOCOS)
 * Responsabilidade Arquitetural:
 * Define a fronteira arquitetural dos blocos atômicos e protegidos do CMS.
 *
 * Regras Estruturais e de Proteção:
 * - Blocos operam exclusivamente com configurações estritas (BlockConfig) e dados tipados.
 * - Proibido o uso de CSS livre, classes arbitrárias (customClasses) ou HTML desestruturado.
 * - Os blocos mantêm independência arquitetural, não importando nem dependendo de Page ou Section.
 *
 * Fronteira estritamente declarativa.
 * Proibido implementar BlockEngine, renderizadores de componentes ou fábricas operacionais.
 */

export type {
  BlockInstance,
  BlockId,
  BlockType,
  BlockCategory,
  BlockDefinition,
  BlockConfig,
  BlockDataValue,
  BlockDataRecord,
  EditableFieldType,
  AllowedUrlProtocol,
  ButtonFieldData,
  ImageFieldData,
  RichTextFieldData,
  EditableFieldBase,
  TextEditableField,
  TextareaEditableField,
  RichTextEditableField,
  ImageEditableField,
  UrlEditableField,
  ButtonEditableField,
  BooleanEditableField,
  NumberEditableField,
  ListEditableField,
  GroupEditableField,
  EditableField,
  BlockDataSchema,
} from '../types';
export {
  BLOCK_CATALOG,
  BLOCK_DEFINITIONS,
  HERO_DATA_SCHEMA,
  ABOUT_DATA_SCHEMA,
  CONTACT_DATA_SCHEMA,
  FOOTER_DATA_SCHEMA,
} from '../constants';


