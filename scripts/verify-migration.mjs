import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";

const migrationPath = path.resolve(
  "supabase/migrations/20260911000100_clean_order_architecture.sql"
);
const sql = await fs.readFile(migrationPath, "utf8");

const requiredFragments = [
  "create extension if not exists pgcrypto",
  "id uuid primary key default gen_random_uuid()",
  "create table if not exists public.orders",
  "create table if not exists public.order_items",
  "create table if not exists public.order_status_history",
  "create or replace function public.create_order",
  "create or replace function public.update_order_status",
  "alter table public.orders enable row level security",
  "create policy \"admins can read orders\"",
  "create policy \"public can read active products\"",
  "alter table public.orders rename to orders_legacy",
  "grant execute on function public.create_order",
];

for (const fragment of requiredFragments) {
  assert.ok(sql.includes(fragment), `Missing migration invariant: ${fragment}`);
}

assert.ok(
  !/create policy "public[^\n]*orders/i.test(sql),
  "Public users must not receive a direct orders read policy"
);

console.log(`Migration invariants valid: ${requiredFragments.length} checks.`);
