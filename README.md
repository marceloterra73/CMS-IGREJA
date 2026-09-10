# CMS VISUAL PARA IGREJAS

Plataforma web SaaS multi-tenant para criação, gerenciamento, edição visual protegida e publicação de sites profissionais para igrejas, ministérios e congregações.

---

## 1. OBJETIVO DO PROJETO

O objetivo principal é democratizar a presença digital de igrejas de qualquer porte com um construtor visual intuitivo e robusto:
- **Painel Administrativo Próprio:** Cada igreja gerencia sua identidade, páginas, cultos, eventos e líderes.
- **Edição Visual Sem Código:** Construtor baseado em blocos (`Páginas → Seções → Blocos → Configurações → Dados`) que permite alterar textos, fotos e configurações sem riscos de quebrar o layout.
- **Proteção dos Componentes:** Os blocos são padronizados e protegidos contra injeções de HTML livre ou corrupção de código.
- **Multi-Tenant Nativo:** Isolamento completo de dados por congregação (`tenantId`), com suporte a subdomínios e domínios personalizados.

---

## 2. ARQUITETURA GERAL

O sistema é dividido em camadas modulares:
1. **Interface:** Painel Administrativo, Editor Visual WYSIWYG e Site Público responsivo.
2. **Módulos Eclesiais:** Notícias, Eventos, Cultos, Transmissões, Ministérios, Células, Pedidos de Oração, Doações, etc.
3. **CMS Core:** Motor de Páginas, Motor de Blocos, Catálogo de Componentes, Biblioteca de Mídia e Publicador.
4. **Regras de Negócio e RBAC:** Permissões por papel (Administrador, Líder, Editor de Mídia).
5. **Multi-Tenant:** Isolamento lógico absoluto baseado em `tenantId`.
6. **Dados e Persistência:** Schemas de configuração tipados e dados estruturados em JSON.

---

## 3. ESTRUTURA INICIAL DO PROJETO

```text
├── AGENTS.md             # Instruções permanentes para agentes de IA e Modo Cirúrgico
├── PROJECT_GUARD.md      # Mapeamento das 9 áreas críticas do sistema
├── ARCHITECTURE.md       # Arquitetura oficial detalhada e fluxo de dados
├── DEVELOPMENT_RULES.md  # Processo obrigatório de 8 etapas de desenvolvimento
├── TESTING.md            # Checklist mandatório de validação e não-regressão
├── CHANGELOG.md          # Histórico formal de versões e fases
├── README.md             # Este documento
├── metadata.json         # Metadados da aplicação no AI Studio
├── index.html            # Ponto de entrada HTML do cliente
├── vite.config.ts        # Configurações do Vite e plugins
├── package.json          # Dependências e scripts de automação
└── src/
    ├── types/            # Contratos de tipos TypeScript (Tenant, Page, Block, etc.)
    ├── main.tsx          # Bootstrap da aplicação React
    ├── App.tsx           # Ponto de visualização principal
    └── index.css         # Estilos globais e Tailwind CSS
```

---

## 4. TECNOLOGIAS UTILIZADAS

O projeto utiliza um stack moderno, estável e portável:
- **Linguagem:** TypeScript (~5.8) com tipagem estrita.
- **Frontend:** React 19 com Vite 6 para build rápido e bundling modular.
- **Estilização:** Tailwind CSS v4 para utilitários de design atômicos e responsivos.
- **Backend / Servidor:** Node.js com Express para serviços modulares e rotas de API protegidas.
- **Ícones:** Lucide React para representações visuais consistentes.
- **Portabilidade:** Estrutura agnóstica a nuvens proprietárias, executável localmente, em containers Docker ou VPS.

---

## 5. COMO EXECUTAR

1. Instalar as dependências:
   ```bash
   npm install
   ```

2. Iniciar o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```
   A aplicação estará disponível em `http://localhost:3000`.

---

## 6. COMO TESTAR

Para executar a validação estática de tipos e compilação de produção:

```bash
npm run build
```

Para checagem de tipos estáticos sem emissão de arquivos:
```bash
npx tsc --noEmit
```

Consulte o arquivo `TESTING.md` para a checklist de aceitação de 8 itens antes de cada entrega ou mudança de fase.

---

## 7. DESENVOLVIMENTO POR FASES

O projeto é planejado para avançar estritamente em fases sequenciais sem antecipação prematura:
- **Fase 0 (Atual):** Fundação Documental, Arquitetura e Proteção (Concluída e Auditada).
- **Fase 1:** Fundação Multi-Tenant & Modelos de Dados Eclesiais.
- **Fase 2:** Motor de Blocos & Proteção de Componentes.
- **Fase 3:** Motor de Páginas & Roteamento Eclesial.
- **Fase 4:** Editor Visual WYSIWYG & Painel de Configurações.
- **Fase 5:** Módulos Específicos para Igrejas (Cultos, Eventos, Orações, Notícias, etc.).
- **Fase 6:** Biblioteca de Mídia, Temas & Publicador Final.

---

## 8. REGRAS DE PROTEÇÃO

- Todo desenvolvimento deve obedecer estritamente às regras de `DEVELOPMENT_RULES.md` e `AGENTS.md`.
- Qualquer intervenção em uma das 9 áreas críticas demarcadas em `PROJECT_GUARD.md` requer análise de impacto prévia e testes de regressão.
- Trabalhe sempre em **Modo Cirúrgico**: alterações pontuais, preservando 100% das funcionalidades existentes e sem refatoração não solicitada.
