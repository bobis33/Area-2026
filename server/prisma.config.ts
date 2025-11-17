import path from 'node:path';
import { config } from 'dotenv';
import dotenvExpand from 'dotenv-expand';

// Charger et expanser les variables AVANT l'import de prisma/config
const myEnv = config();
dotenvExpand.expand(myEnv);

import { defineConfig } from 'prisma/config';

export default defineConfig({
  schema: path.join('prisma', 'schema.prisma'),
  migrations: {
    path: path.join('prisma', 'migrations'),
  },
  engine: 'classic',
  datasource: {
    url: process.env.POSTGRES_URL || '',
  },
});
