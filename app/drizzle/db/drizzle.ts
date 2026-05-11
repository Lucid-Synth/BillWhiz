import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { sql } from "drizzle-orm";
import { AsyncLocalStorage } from "async_hooks";

const pool = new Pool({
  connectionString: process.env.NILEDB_URL,
  ssl: { rejectUnauthorized: false },
});

pool.on("error", (err) => {
  console.error("Unexpected PG error", err);
});

export const db = drizzle(pool);
export const tenantContext = new AsyncLocalStorage<string | undefined>();

export function tenantDB<T>(cb: (tx: any) => T | Promise<T>): Promise<T> {
  return db.transaction(async (tx) => {
    const tenantId = tenantContext.getStore();
    console.log("executing query with tenant:", tenantId);

    if (tenantId) {
      await tx.execute(
        sql`set local nile.tenant_id = ${tenantId}`
      );
    }

    return cb(tx);
  }) as Promise<T>;
}