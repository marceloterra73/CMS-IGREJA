/**
 * CMS CORE — DOMÍNIO: FORMULÁRIOS E SUBMISSÕES DO SITE (FASE 22)
 * Responsabilidade Arquitetural:
 * Define a fronteira declarativa para formulários configuráveis do site e registros de submissões por Tenant.
 *
 * Arquitetura Oficial:
 * Tenant -> forms[] -> FormDefinition -> fields[] -> FormFieldDefinition
 * FormSubmission -> formId -> FormDefinition (relação desacomplada por identificador)
 *
 * Fronteira estritamente declarativa de contratos de dados.
 * Proibido implementar handlers de submissão, parsers, validadores, sanitizers,
 * envios reais (e-mail, WhatsApp, SMS, webhook), APIs, banco de dados ou renderizadores de formulário.
 */

export type {
  FormStatus,
  FormFieldType,
  FormFieldOption,
  FormFieldDefinition,
  FormDefinition,
  FormSubmissionStatus,
  FormSubmissionValue,
  FormSubmission,
} from '../types';
