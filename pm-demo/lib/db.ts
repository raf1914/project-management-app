/**
 * @file SQLite data source (libsql), replacing the old in-memory store.
 *
 *       A single libsql Client is stashed on globalThis so it survives Hot
 *       Module Replacement during `next dev`. The connection points at the
 *       file db/pm.db built from db/schema.sql + db/seed.sql; if that file is
 *       empty (fresh checkout), it is bootstrapped from those scripts on first
 *       use. foreign_keys is enabled so ON DELETE CASCADE cleans up children.
 *
 *       ids are INTEGER PRIMARY KEYs in the DB but the rest of the app treats
 *       them as opaque strings, so the row mappers in lib/data.ts stringify
 *       them at this boundary — nothing downstream needs to change.
 */

import { createClient, type Client, type InArgs, type Row } from "@libsql/client";
import { readFileSync } from "node:fs";
import path from "node:path";

const DB_DIR = path.join(process.cwd(), "db");
const DB_FILE = path.join(DB_DIR, "pm.db");

declare global {
  var __PM_CLIENT__: Client | undefined;
  var __PM_INIT__: Promise<void> | undefined;
}

//* file: URL wants forward slashes, even on Windows.
const db: Client = (globalThis.__PM_CLIENT__ ??= createClient({
  url: `file:${DB_FILE.replace(/\\/g, "/")}`,
}));

//* Enable cascades and seed an empty database — runs at most once per process.
function init(): Promise<void> {
  return (globalThis.__PM_INIT__ ??= (async () => {
    await db.execute("PRAGMA foreign_keys = ON");
    const tables = await db.execute(
      "SELECT name FROM sqlite_master WHERE type = 'table' AND name = 'projects'",
    );
    if (tables.rows.length === 0) {
      await db.executeMultiple(readFileSync(path.join(DB_DIR, "schema.sql"), "utf8"));
      await db.executeMultiple(readFileSync(path.join(DB_DIR, "seed.sql"), "utf8"));
    }
  })());
}

//* Rows whose first job is to satisfy a typed interface — fetch many / one.
export async function all<T>(sql: string, args: InArgs = []): Promise<T[]> {
  await init();  
  const result = await db.execute({ sql, args });
  return result.rows as unknown as T[];
}

export async function one<T>(sql: string, args: InArgs = []): Promise<T | undefined> {
  return (await all<T>(sql, args))[0];
}

//* Raw rows, for callers that map columns themselves (e.g. aggregates).
export async function rows(sql: string, args: InArgs = []): Promise<Row[]> {
  await init();
  return (await db.execute({ sql, args })).rows;
}

//* Mutations — returns the libsql result (rowsAffected, lastInsertRowid).
export async function run(sql: string, args: InArgs = []) {
  await init();
  return db.execute({ sql, args });
}
