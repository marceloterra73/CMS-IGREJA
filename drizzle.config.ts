import { defineConfig } from 'drizzle-kit';

// Schemas incrementais são listados explicitamente até serem consolidados no índice.
export default defineConfig({
  schema: [
    './server/db/schema/index.ts',
    './server/db/schema/people.ts',
    './server/db/schema/groups.ts',
    './server/db/schema/finance.ts',
    './server/db/schema/education.ts',
    './server/db/schema/assets.ts',
    './server/db/schema/calendar.ts',
    './server/db/schema/churchMedia.ts',
  ],
  out: './server/db/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/cms_igrejas',
  },
  verbose: true,
  strict: true,
});
