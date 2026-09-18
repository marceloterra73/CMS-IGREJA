# Church SaaS — Arquitetura de Implementação

## Produto
**ChurchFlow — Gestão Integrada para Igrejas**

SaaS multi-tenant para gestão de pessoas, grupos, ensino, financeiro, patrimônio, agenda e mídia.

## Stack adotada
- React + TypeScript + Vite
- Node.js + Express
- PostgreSQL + Drizzle ORM
- JWT em cookie HttpOnly, com expiração e rotação planejadas
- RBAC por tenant e por módulo
- Uploads em storage compatível com S3

## Princípios
1. Todo registro de negócio possui `tenant_id`.
2. Nenhuma rota retorna dados sem verificar o tenant do usuário autenticado.
3. Permissões são avaliadas no backend; a interface apenas reflete as permissões.
4. Auditoria para alterações financeiras, membros, permissões e documentos.
5. Dados pessoais devem observar minimização, consentimento quando aplicável e LGPD.
6. Uploads passam por validação de extensão, MIME, tamanho e nome seguro.

## Domínios
- **Pessoas:** people, member_cards, roles, permissions, custom_fields, categories.
- **Grupos:** groups, group_leaders, group_members, meetings, attendance, meeting_media.
- **Ensino:** biblical_studies, schools, classes, enrollments, lessons, discipleship_tracks, followups.
- **Financeiro:** accounts, transactions, cost_centers, vendors, financial_categories, recurring_entries.
- **Patrimônio:** assets, asset_categories, locations, asset_movements.
- **Agenda:** events, recurring_schedules, announcements, notifications, private_notes.
- **Mídias:** albums, media_items, downloadable_files, document_templates.

## Perfis padrão
- `owner`: acesso integral ao tenant.
- `admin`: administração operacional, sem gestão da titularidade.
- `finance_manager`: financeiro.
- `people_manager`: pessoas e cargos.
- `group_leader`: grupos atribuídos e relatórios de suas reuniões.
- `teacher`: escolas, turmas e frequências atribuídas.
- `member`: acesso ao próprio perfil, turmas, agenda, mural e mídias publicadas.

## Regras de negócio essenciais
- Um grupo pode ter no máximo quatro líderes ativos.
- Líderes só gerenciam grupos aos quais foram vinculados.
- Professores só gerenciam turmas atribuídas.
- Alunos só visualizam turmas nas quais estão matriculados.
- Notas particulares são sempre privadas por usuário.
- Relatórios financeiros devem permitir filtro por período, conta, categoria e centro de custo.
- Cartões de membro devem ser gerados por modelos configuráveis, sem HTML arbitrário.

## Contratos de API planejados
- `/api/auth/*`
- `/api/tenants/*`
- `/api/people/*`
- `/api/groups/*`
- `/api/education/*`
- `/api/finance/*`
- `/api/assets/*`
- `/api/calendar/*`
- `/api/media/*`
- `/api/reports/*`
- `/api/admin/*`

## Critérios de produção
- Validação de entrada no servidor.
- Rate limiting em autenticação e endpoints públicos.
- Logs estruturados sem senhas ou tokens.
- Migrações versionadas.
- Testes de autorização cross-tenant.
- Backup e restauração documentados.
- Variáveis secretas apenas em ambiente, nunca no repositório.
