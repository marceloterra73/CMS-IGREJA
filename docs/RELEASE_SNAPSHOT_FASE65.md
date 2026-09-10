# REGISTRO DE RELEASE E SNAPSHOT LOCAL (FASE 65)

- **Release ID:** `release-20260910-152700-fase65-v1.0.0`
- **Timestamp ISO:** `2026-09-10T15:27:00-07:00`
- **Ambiente de Origem:** Sandbox Cloud Run (AI Studio Build)
- **Git Status:** Workspace snapshot (Standalone / Zero .git versioning)
- **TypeScript Check (`npx tsc --noEmit`):** PASS (0 errors, 0 warnings)
- **Official Build (`npm run build`):** PASS (Vite 6.4.3 + esbuild bundle ESM)

## Identificação e Hashes SHA-256 dos Artefatos de Produção

| Artefato | Tamanho | SHA-256 Checksum |
| :--- | :---: | :--- |
| `dist/index.html` | 0.95 kB | `9a6242bea160a85e1f2de1af64d6d3e0f1a7ee347b365e1b7c2cedbbba856308` |
| `dist/server.mjs` | 81.9 kB | `1106bd6ab570979a68eb317accc6064720256e1f2bcca9b074d1a734389562c3` |
| `dist/assets/index-uzIuUviY.css` | 107.37 kB | `9757ac31009434baccead92daba4494eb85df53d2404f4f832d44dd0247595c5` |
| `dist/assets/index-DDv_9E1K.js` | 2,496.20 kB | `fe7cc0e075947d06c7978354be4e3c20b91225e36c5930496b039f3ce76075da` |

## Conformidade dos Artefatos

1. **Frontend:** Single Page Application compilada com caminhos relativos e pronto para fallback SPA no Nginx.
2. **Backend:** Pacote ESM autocontido (`dist/server.mjs`) executável diretamente via `node dist/server.mjs`, sem dependências de desenvolvimento (`tsx`, `vite`, `typescript`).
3. **Segurança:** Nenhum segredo, senha, credencial, chave privada ou string de conexão está presente no bundle.
