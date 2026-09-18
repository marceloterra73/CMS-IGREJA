# IgrejaOS — Escopo Funcional Oficial

## Objetivo
Evoluir o CMS para uma plataforma SaaS multi-tenant de gestão integral de igrejas, com painel administrativo, portal/app do membro, controle de permissões e módulos integrados.

## Módulos
- Pessoas: cadastro, cartão de membro, cargos, permissões, campos personalizados, aniversariantes e categorias.
- Grupos: células, ministérios e departamentos; até quatro líderes; frequência, selfie, visitantes, temas, anotações e relatórios.
- Ensino: estudos bíblicos com anexos, escolas, turmas, professores, alunos, frequência, acompanhamento e discipulado.
- Financeiro: receitas, despesas, contas/caixas, fornecedores, categorias, centros de custos, contas a pagar/receber, indicadores e relatórios.
- Patrimônio: bens, categorias, locais, vida útil, histórico e movimentações.
- Agenda: eventos, recorrências semanais/mensais/anuais, mural, notificações e anotações privadas.
- Mídias e documentos: álbuns, fotos, vídeos, documentos, modelos de cartas/certificados/declarações e arquivos para download.

## Regras de negócio essenciais
1. Isolamento obrigatório por `tenantId` em todas as entidades e consultas.
2. RBAC granular por módulo, ação e escopo.
3. Líderes de grupo limitados a quatro por grupo.
4. Notas particulares acessíveis exclusivamente ao autor.
5. Arquivos privados protegidos por autorização e arquivos públicos publicados explicitamente.
6. Auditoria de ações sensíveis: permissões, finanças, exclusões e movimentações patrimoniais.
7. Validação no cliente e no servidor, tratamento padronizado de erros e proteção contra acesso indevido.

## Stack de referência
- React + TypeScript + Vite + Tailwind.
- Node.js + Express.
- PostgreSQL + Drizzle ORM.
- JWT em cookie seguro, com expiração e rotação planejadas.
- Armazenamento de arquivos abstraído por provider.

## Critérios de aceite
- Frontend responsivo para desktop, tablet e celular.
- API autenticada e autorizada.
- Banco versionado por migrations.
- `.env.example` sem segredos.
- README com instalação, migração, execução e testes.
- Testes de integração para autenticação, isolamento de tenant, permissões, finanças e frequência.
- Nenhum módulo deve confiar apenas em restrições visuais do frontend.

## Entrega incremental técnica
A implementação deve preservar as áreas críticas existentes do CMS e adicionar os módulos acima por contratos estáveis, com testes de não-regressão e documentação de mudanças.
