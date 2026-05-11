import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./app/drizzle/schema/index.ts",
  out: "./app/drizzle/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.NILEDB_URL!,
  },
});