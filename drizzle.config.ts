import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  // Mantém o índice canônico e inclui os módulos incrementais ainda não exportados nele.
  schema: ['./server/db/schema/index.ts', './server/db/schema/people.ts'],
  out: './server/db/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/cms_igrejas',
  },
  verbose: true,
  strict: true,
});
