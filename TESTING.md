# TESTING.md — PROTOCOLO DE TESTES E VALIDAÇÃO

Este documento estabelece o checklist mandatório de testes para cada entrega e alteração no projeto **CMS VISUAL PARA IGREJAS**.

---

## 1. CHECKLIST MÍNIMA OBRIGATÓRIA

Antes de concluir qualquer tarefa ou liberar qualquer fase, todos os itens abaixo devem ser validados:

- [ ] **1. Aplicação inicia:** O servidor de desenvolvimento ou de produção sobe corretamente na porta 3000 sem travamentos.
- [ ] **2. Build funciona:** O comando de compilação do projeto (`npm run build` / `compile_applet`) executa com sucesso sem falhas de tipagem ou bundling.
- [ ] **3. Não existem erros críticos:** O console do navegador e os logs do terminal não apresentam exceções não tratadas ou avisos impeditivos.
- [ ] **4. A nova funcionalidade funciona:** O comportamento solicitado na tarefa foi testado e corresponde exatamente ao que foi especificado.
- [ ] **5. Funcionalidades anteriores continuam funcionando:** Nenhuma tela, componente, rota ou módulo preexistente sofreu regressão.
- [ ] **6. Não existem alterações fora do escopo:** Apenas os arquivos e linhas necessários para a demanda foram tocados; nenhuma alteração acidental foi incluída.
- [ ] **7. Não existem secrets expostos:** Nenhuma credencial, token ou chave privada foi escrita diretamente no código-fonte.
- [ ] **8. Multi-tenant não foi comprometido, quando aplicável:** Não existem dados, consultas ou estados que misturem congregações ou vazem informações de um tenant para outro.

---

## 2. PROCEDIMENTO DE VERIFICAÇÃO TÉCNICA

1. **Validação Estática:**
   ```bash
   npm run lint # quando configurado
   npx tsc --noEmit # checagem de integridade de tipos
   ```

2. **Validação de Build:**
   ```bash
   npm run build
   ```

3. **Validação de Execução e Interface:**
   - Acesso à rota raiz `/` no navegador.
   - Inspeção do layout e responsividade (Desktop, Tablet e Mobile).
   - Verificação das interações do usuário (botões, formulários, modais, etc.).
