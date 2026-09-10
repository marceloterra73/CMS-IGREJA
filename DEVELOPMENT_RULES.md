# DEVELOPMENT_RULES.md — REGRAS E PROCESSO DE DESENVOLVIMENTO

Este documento estabelece o fluxo de trabalho obrigatório e as regras de desenvolvimento para todas as fases de construção do **CMS VISUAL PARA IGREJAS**.

---

## 1. O PROCESSO OBRIGATÓRIO (PASSO A PASSO)

Qualquer implementação, correção ou ajuste no projeto deve seguir sequencialmente as 8 etapas abaixo:

```
      1. SOLICITAÇÃO
            ↓
       2. ANÁLISE
            ↓
3. IDENTIFICAÇÃO DO ESCOPO
            ↓
        4. PLANO
            ↓
  5. ALTERAÇÃO MÍNIMA
            ↓
       6. TESTES
            ↓
7. VERIFICAÇÃO DE REGRESSÃO
            ↓
      8. RELATÓRIO
```

### Detalhamento das Etapas:

1. **SOLICITAÇÃO:**
   - Ler integralmente o pedido recebido, sem assumir funcionalidades não descritas.
   - Compreender exatamente o objetivo final pretendido pelo usuário.

2. **ANÁLISE:**
   - Mapear e inspecionar todos os arquivos existentes que interagem com o pedido.
   - Verificar as regras de proteção em `PROJECT_GUARD.md` e `AGENTS.md`.

3. **IDENTIFICAÇÃO DO ESCOPO:**
   - Delimitar rigorosamente o que FAZ parte da tarefa e o que NÃO FAZ parte.
   - Rejeitar a tentação de "aproveitar" o momento para refatorar ou adicionar extras.

4. **PLANO:**
   - Traçar um plano objetivo de execução (no máximo 3 a 4 passos diretos).
   - Identificar exatamente quais arquivos serão criados ou editados.

5. **ALTERAÇÃO MÍNIMA:**
   - Aplicar a menor intervenção de código suficiente para atender à solicitação.
   - Manter a compatibilidade com todos os contratos e tipagens existentes.

6. **TESTES:**
   - Executar compilação do projeto e validação de tipos TypeScript.
   - Verificar a ausência de erros de sintaxe ou execução.

7. **VERIFICAÇÃO DE REGRESSÃO:**
   - Confirmar que as telas, rotas e módulos construídos em fases anteriores continuam íntegros e funcionando.
   - Assegurar que o isolamento multi-tenant e a proteção dos blocos não foram violados.

8. **RELATÓRIO:**
   - Apresentar um resumo claro, objetivo e sem jargões desnecessários, informando:
     - O que foi realizado;
     - Arquivos criados, alterados ou removidos;
     - Status da validação.

---

## 2. REGRAS DE OURO DE ENGENHARIA

1. **Nunca quebre o que já funciona:** A estabilidade da aplicação tem prioridade máxima.
2. **Proibição de Código Fantasma:** Não crie arquivos ou rotas sem propósito claro e imediato.
3. **Imutabilidade de Componentes Estruturais:** No CMS, o usuário edita *propriedades e conteúdos*; o código-fonte dos blocos é imutável em tempo de execução.
4. **Sem Secrets no Código:** Chaves, senhas e configurações de ambiente devem permanecer estritamente em variáveis de ambiente documentadas em `.env.example`.
