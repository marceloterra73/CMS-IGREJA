# ARCHITECTURE.md — ARQUITETURA OFICIAL DO PROJETO

Este documento estabelece a arquitetura estrutural oficial do **CMS VISUAL PARA IGREJAS**, concebido como uma plataforma SaaS multi-tenant focada na criação, edição visual protegida e publicação de sites para igrejas e ministérios.

---

## 1. VISÃO GERAL DAS CAMADAS

O projeto é estruturado em camadas claras com responsabilidades bem delimitadas, favorecendo manutenção cirúrgica e escalabilidade modular sem complexidade desnecessária:

```
┌─────────────────────────────────────────────────────────────┐
│                       SITE PÚBLICO                          │
│        (Renderização rápida, responsiva e otimizada)        │
├─────────────────────────────────────────────────────────────┤
│                     PAINEL ADM & EDITOR                     │
│    (Interface do usuário, edição visual e configurações)    │
├─────────────────────────────────────────────────────────────┤
│                       MÓDULOS ECLESIAIS                     │
│  (Cultos, Ministérios, Eventos, Orações, Notícias, etc.)    │
├─────────────────────────────────────────────────────────────┤
│                          CMS CORE                           │
│ (Motor de Páginas, Motor de Blocos, Mídia, Temas, Publicador│
├─────────────────────────────────────────────────────────────┤
│                   REGRAS DE NEGÓCIO & RBAC                  │
│    (Permissões, validações estruturais, isolamento)         │
├─────────────────────────────────────────────────────────────┤
│                     CAMADA MULTI-TENANT                     │
│      (Isolamento por tenantId, resolução de domínios)       │
├─────────────────────────────────────────────────────────────┤
│                       DADOS & STORAGE                       │
│    (Modelos estruturados, schemas JSON protegidos, persistência) │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. PRINCÍPIO ESTRUTURAL DE CONTEÚDO

O sistema de conteúdo opera sob a hierarquia estrita:

```
PÁGINAS
   ↓
SEÇÕES
   ↓
BLOCOS
   ↓
CONFIGURAÇÕES
   ↓
DADOS
```

### Regra Fundamental de Imutabilidade Estrutural:
- **O CMS não deverá depender de páginas salvas como grandes blocos de HTML livre.**
- Os componentes estruturais são imutáveis e protegidos contra edição de código-fonte arbitrário.
- O usuário e o administrador alteram exclusivamente **configurações permitidas** e **dados tipados** dos blocos.

---

## 3. AS GRANDES CAMADAS DO SISTEMA

### 3.1. CMS CORE
O núcleo operacional do sistema responsável por:
- Registro e ciclo de vida de componentes.
- Validação estrutural de páginas e blocos.
- Motor de renderização e orquestração de layouts.
- Pipeline de publicação e geração de visualizações.

### 3.2. MULTI-TENANT
- Cada igreja ou congregação é uma entidade **Tenant** com identificador exclusivo (`tenantId`).
- Isolamento absoluto de banco de dados e camadas de acesso: dados de um tenant nunca são visíveis ou acessíveis por outro.
- Resolução dinâmica de subdomínios (ex.: `igrejaexemplo.plataforma.com`) e domínios personalizados (ex.: `igrejabatista.com.br`).

### 3.3. USERS (USUÁRIOS)
- Cadastro de usuários vinculados obrigatoriamente a um `tenantId` (exceto superadministradores de plataforma).
- Perfis de membros, obreiros, pastores e administradores locais.

### 3.4. ROLES (PAPÉIS)
- Definição estruturada de papéis de acesso:
  - `superadmin`: Gestão da plataforma global.
  - `tenant_admin`: Administrador geral da congregação.
  - `pastor`: Acesso a conteúdos, mensagens pastorais e orações.
  - `editor`: Criação e edição de páginas e notícias.
  - `media_volunteer`: Gestão de uploads e fotos.

### 3.5. PERMISSIONS (PERMISSÕES / RBAC)
- Sistema granular de permissões (leitura, escrita, publicação, exclusão).
- Validação obrigatória em cada rota, mutação e consulta.

### 3.6. PAGES (MOTOR DE PÁGINAS)
- Gestão de ciclo de vida das páginas (`draft`, `published`, `archived`).
- Propriedades estruturais: `id`, `tenantId`, `title`, `slug`, `order`, `seo` e lista ordenada de `blocks`.
- Roteamento e metadados de SEO protegidos.

### 3.7. BLOCKS (MOTOR DE BLOCOS)
- Instâncias tipadas de blocos pré-construídos e seguros.
- Propriedades de cada bloco: `id`, `type`, `order`, `isVisible`, `config` (estilos/espaçamentos permitidos) e `data` (conteúdo textual e mídias).
- Proibição de injeção direta de scripts ou HTML malicioso.

### 3.8. MEDIA (BIBLIOTECA DE MÍDIA)
- Upload, armazenamento e indexação de imagens, logotipos, banners e documentos.
- Vinculação estrita por `tenantId` para evitar acesso cruzado a arquivos privados.
- Otimização automática de resolução e formatos para web.

### 3.9. TEMPLATES (SISTEMA DE TEMPLATES)
- Modelos pré-configurados de páginas e sites voltados para diferentes estilos eclesiais (tradicional, contemporâneo, jovem, conferência).
- Aplicação de temas sem sobrescrever dados e conteúdos já cadastrados pela igreja.

### 3.10. PUBLIC SITE (SITE PÚBLICO)
- Aplicação pública otimizada para visitantes e membros da congregação.
- Renderização rápida, responsiva e com excelente pontuação em SEO e acessibilidade.
- Consumo estrito dos dados publicados pelo tenant correspondente.

### 3.11. MODULES (MÓDULOS ESPECÍFICOS PARA IGREJAS)
Arquitetura modular plugável planejada para receber:
1. **Notícias:** Avisos, cartas pastorais e artigos da comunidade.
2. **Eventos:** Calendário de conferências, retiros e inscrições.
3. **Agenda de Cultos:** Dias, horários e locais dos cultos semanais.
4. **Cultos Gravados:** Integração com transmissões e mensagens gravadas.
5. **Transmissão ao Vivo:** Player de transmissão em tempo real com status ativo.
6. **Liderança:** Apresentação de pastores, diáconos e líderes ministeriais.
7. **Ministérios:** Páginas dedicadas (Infantil, Jovens, Louvor, Casais, etc.).
8. **Células / Pequenos Grupos:** Localização geográfica e horários de reunião.
9. **Pedidos de Oração:** Formulário pastoral seguro com opção de anonimato.
10. **Testemunhos:** Histórias de fé moderadas e aprovadas pela liderança.
11. **Doações:** Informações seguras de dízimos, ofertas e chaves PIX.
12. **Galeria:** Álbuns de fotos de batismos, conferências e eventos sociais.
13. **Redes Sociais:** Centralização de canais oficiais e contatos da igreja.

---

## 4. PORTABILIDADE E INDEPENDÊNCIA DE AMBIENTE

- O projeto foi arquitetado em TypeScript padrão, com frontend React/Vite e backend modular Express/Node.
- Não há dependência proprietária de interfaces de nuvem: o sistema pode ser empacotado em container Docker e executado em qualquer VPS, servidor dedicado ou provedor de nuvem (Cloud Run, AWS, DigitalOcean).
