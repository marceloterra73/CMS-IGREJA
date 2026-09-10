/**
 * CMS CORE — DOMÍNIO: SECTIONS (SEÇÕES)
 * Responsabilidade Arquitetural:
 * Define a fronteira arquitetural das seções de agrupamento na página.
 * As seções atuam exclusivamente como contêineres lógicos e estruturais de blocos (SectionInstance.blocks).
 *
 * Fronteira estritamente declarativa.
 * Proibido implementar SectionEngine, renderizadores de seção ou manipuladores operacionais.
 */

export type { SectionInstance, SectionId, SectionConfig } from '../types';
