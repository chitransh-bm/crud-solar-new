import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "src/server/drizzle/schema.ts",
  out: "src/server/drizzle/migrations",
  dialect: "mysql",
  dbCredentials: {
    url: process.env.DATABASE_URL as string,
  },
  verbose: true,
  strict: true,
});
