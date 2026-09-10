# AGENTS.md — DIRETRIZES PARA AGENTES E IA

Este documento contém as regras fundamentais, obrigatórias e permanentes para qualquer agente de inteligência artificial ou desenvolvedor trabalhando no projeto **CMS VISUAL PARA IGREJAS**.

---

## 1. MODO CIRÚRGICO PERMANENTE

Todo agente deve operar em **Modo Cirúrgico**:

1. **Análise Prévia Obrigatória:** Antes de modificar qualquer linha de código, analise os arquivos existentes, compreenda o fluxo e identifique o impacto potencial.
2. **Preservação de Funcionalidades:** Preserve rigorosamente todas as funcionalidades que já estiverem funcionando. Nenhuma funcionalidade prévia pode ser quebrada.
3. **Alterações Mínimas e Localizadas:** Não reescreva arquivos inteiros quando uma edição cirúrgica ou pontual for suficiente.
4. **Proibição de Refatoração Não Solicitada:** Nunca refatore código estável, renomeie variáveis públicas, reestruture diretórios ou altere bibliotecas sem pedido explícito.
5. **Adesão Estrita ao Escopo:** Limite a atuação estritamente ao que foi solicitado na fase ou tarefa atual. Não adicione telas, botões, rotas ou módulos adicionais por iniciativa própria.
6. **Não Remoção:** Nunca remova funcionalidades existentes a menos que explicitamente ordenado pelo usuário.
7. **Estabilidade de Contratos:** Não altere contratos entre frontend, backend, banco de dados ou APIs sem necessidade explícita documentada.
8. **Segurança e Secrets:** Nunca exponha chaves de API, senhas, tokens ou dados sensíveis no código. Utilize variáveis de ambiente conforme `.env.example`.
9. **Transparência:** Informe sempre a lista exata de arquivos criados, modificados ou removidos após a execução de cada tarefa.

---

## 2. FLUXO OBRIGATÓRIO DE TRABALHO

Ao receber uma nova instrução, o agente deve seguir rigorosamente:

```
SOLICITAÇÃO
    ↓
ANÁLISE (inspecionar arquivos existentes)
    ↓
IDENTIFICAÇÃO DO ESCOPO (definir limites claros)
    ↓
PLANO CIRÚRGICO (no máximo 3 passos objetivos)
    ↓
ALTERAÇÃO MÍNIMA (edição cirúrgica sem inflação de código)
    ↓
TESTES E COMPILAÇÃO (verificar ausência de erros)
    ↓
VERIFICAÇÃO DE REGRESSÃO (garantir integridade do todo)
    ↓
RELATÓRIO CONCISO (listar alterações e status)
```

---

## 3. PROTEÇÃO DO MODELO MULTI-TENANT E DE DADOS

- O projeto é **multi-tenant**. Cada igreja é um tenant isolado.
- Nunca crie consultas, endpoints ou estados no frontend que misturem dados de diferentes tenants.
- Todo acesso futuro a dados deve conter o `tenantId` estritamente validado.

---

## 4. PROCESSO DE VALIDAÇÃO E TESTES

Antes de concluir qualquer tarefa:
1. Executar verificação de tipos e compilação do projeto (`compile_applet` / `npm run build`).
2. Verificar se o servidor inicializa sem erros em tempo de execução.
3. Validar se a nova funcionalidade atende estritamente à solicitação.
4. Confirmar que nenhuma regressão ocorreu nas telas ou rotas anteriores.
