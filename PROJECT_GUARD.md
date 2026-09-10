# PROJECT_GUARD.md — GUARDIÃO DE ÁREAS CRÍTICAS

Este documento mapeia e protege as áreas críticas do projeto **CMS VISUAL PARA IGREJAS**. Qualquer alteração realizada em áreas demarcadas como críticas exige **avaliação formal de impacto prévio** e aprovação ou solicitação explícita.

---

## 1. ÁREAS CRÍTICAS MAPEADAS

As 9 áreas críticas do sistema são:

| Área Crítica | Descrição do Escopo | Risco Principal | Requisito Obrigatório |
| :--- | :--- | :--- | :--- |
| **1. Autenticação** | Login, sessões, recuperação de senha, emissão e validação de tokens. | Vazamento de credenciais, perda de sessão ou brechas de segurança. | Análise prévia de impacto e testes de regressão obrigatórios. |
| **2. Multi-tenant** | Isolamento lógico e de banco por igreja (`tenantId`), resolução de domínio/subdomínio. | Vazamento cruzado de dados entre congregações (risco máximo). | Análise prévia de impacto e testes de regressão obrigatórios. |
| **3. Permissões (RBAC)** | Controle de papéis (Admin Geral, Pastor/Líder, Editor de Mídia, etc.) e capacidades. | Acesso não autorizado a configurações sensíveis e dados de membros. | Análise prévia de impacto e testes de regressão obrigatórios. |
| **4. Banco de Dados** | Modelos de dados, schemas, migrations e camadas de repositório. | Corrupção de dados estruturados, inconsistência relacional ou perda de integridade. | Análise prévia de impacto e testes de regressão obrigatórios. |
| **5. Motor de Páginas** | Composição estrutural da página (`Páginas → Seções → Blocos → Configs → Dados`). | Quebra de renderização de páginas no ar e falhas de SEO. | Análise prévia de impacto e testes de regressão obrigatórios. |
| **6. Motor de Blocos** | Definição dos tipos de blocos, schemas de configuração e renderizadores imutáveis. | Quebra de compatibilidade com sites já publicados ao alterar contratos de blocos. | Análise prévia de impacto e testes de regressão obrigatórios. |
| **7. Editor Visual** | Canvas de visualização, árvore de nós, painel de propriedades, histórico de alterações. | Corrupção de layouts, falhas de sincronização de estado e perda de edição. | Análise prévia de impacto e testes de regressão obrigatórios. |
| **8. Biblioteca de Mídia** | Upload, armazenamento de imagens/vídeos, otimização e vinculação por tenant. | Quebra de links de mídia, links órfãos e consumo indevido de recursos. | Análise prévia de impacto e testes de regressão obrigatórios. |
| **9. Publicação** | Processo de build de página estática/dinâmica, cache e deploy de sites públicos. | Queda de disponibilidade do site público da congregação. | Análise prévia de impacto e testes de regressão obrigatórios. |

---

## 2. PROTOCOLO OBRIGATÓRIO PARA ALTERAÇÕES CRÍTICAS

Qualquer intervenção em qualquer uma das áreas críticas acima deve seguir rigorosamente:

1. **Declaração Explícita de Impacto:** O agente ou desenvolvedor deve responder previamente:
   - Qual área crítica está sendo tocada?
   - Os schemas de dados ou contratos de props sofrerão alteração?
   - O isolamento multi-tenant foi verificado?
   - Como os dados antigos serão mantidos compatíveis?
2. **Aprovação de Escopo:** Não alterar áreas críticas de forma tangencial ou oportunista enquanto resolve outro problema de escopo reduzido.
3. **Validação de Regressão Obrigatória:** Nenhuma alteração pode ser dada como concluída sem validação formal de não-regressão nas áreas adjacentes.
