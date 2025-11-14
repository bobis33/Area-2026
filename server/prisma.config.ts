import path from "node:path";
import "dotenv/config";

import { defineConfig, env } from "prisma/config";

export default defineConfig({
    schema: path.join("prisma", "schema.prisma"),
  migrations: {
      path: path.join("prisma", "migrations"),
  },
  engine: "classic",
  datasource: {
    url: env("POSTGRES_URL"),
  },
});
