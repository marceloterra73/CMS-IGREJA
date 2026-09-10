/**
 * CMS CORE — DOMÍNIO: NAVIGATION (NAVEGAÇÃO)
 * Responsabilidade Arquitetural:
 * Define a fronteira arquitetural de menus e navegação institucional da igreja.
 * Estrutura conceitualmente árvores de links em locais demarcados (header, footer, mobile drawer).
 *
 * Fronteira estritamente declarativa.
 * Proibido implementar roteadores, listeners de clique ou manipuladores de histórico.
 */

export type {
  NavigationMenu,
  NavigationMenuStatus,
  NavigationItem,
  NavigationMenuId,
  MenuLocation,
  NavigationTarget,
  NavigationTargetType,
  NavigationPageTarget,
  NavigationExternalTarget,
} from '../types';
