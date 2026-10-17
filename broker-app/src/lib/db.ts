import fs from "node:fs";
import path from "node:path";
import type { DatabaseSync as DatabaseSyncType } from "node:sqlite";

// node:sqlite is loaded at runtime so the bundler never tries to resolve it.
const { DatabaseSync } = process.getBuiltinModule("node:sqlite") as typeof import("node:sqlite");

export const DATA_DIR = path.resolve(process.env.DATA_DIR || "./data");
export const PDF_DIR = path.join(DATA_DIR, "pdfs");

const SCHEMA = `
CREATE TABLE IF NOT EXISTS offices (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  company_id TEXT,
  address TEXT,
  phone TEXT,
  default_fee_pct REAL NOT NULL DEFAULT 2,
  fee_includes_vat INTEGER NOT NULL DEFAULT 0,
  auto_send_copy INTEGER NOT NULL DEFAULT 1,
  created_at INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  office_id TEXT REFERENCES offices(id),
  role TEXT NOT NULL DEFAULT 'manager',
  name TEXT,
  phone TEXT NOT NULL UNIQUE,
  email TEXT,
  license TEXT,
  signature TEXT,
  created_at INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS otps (
  key TEXT PRIMARY KEY,
  code_hash TEXT NOT NULL,
  expires_at INTEGER NOT NULL,
  attempts INTEGER NOT NULL DEFAULT 0
);
CREATE TABLE IF NOT EXISTS sessions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id),
  expires_at INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS clients (
  id TEXT PRIMARY KEY,
  office_id TEXT NOT NULL REFERENCES offices(id),
  owner_id TEXT REFERENCES users(id),
  name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  id_number TEXT,
  address TEXT,
  kind TEXT NOT NULL DEFAULT 'buyer',
  temperature TEXT NOT NULL DEFAULT 'warm',
  source TEXT,
  wants TEXT,
  notes TEXT,
  created_at INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS properties (
  id TEXT PRIMARY KEY,
  office_id TEXT NOT NULL REFERENCES offices(id),
  agent_id TEXT REFERENCES users(id),
  address TEXT NOT NULL,
  city TEXT,
  parcel TEXT,
  kind TEXT NOT NULL DEFAULT 'דירה',
  deal_type TEXT NOT NULL DEFAULT 'sale',
  rooms REAL,
  sqm REAL,
  floor TEXT,
  price INTEGER,
  owner_client_id TEXT REFERENCES clients(id),
  exclusive_from TEXT,
  exclusive_to TEXT,
  marketing TEXT NOT NULL DEFAULT '{}',
  interest TEXT,
  disclosure TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  created_at INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS documents (
  id TEXT PRIMARY KEY,
  office_id TEXT NOT NULL REFERENCES offices(id),
  agent_id TEXT NOT NULL REFERENCES users(id),
  template TEXT NOT NULL,
  title TEXT NOT NULL,
  property_id TEXT REFERENCES properties(id),
  data TEXT NOT NULL DEFAULT '{}',
  annex TEXT,
  status TEXT NOT NULL DEFAULT 'sent',
  agent_signature TEXT,
  pdf_sha256 TEXT,
  share_token TEXT UNIQUE,
  share_expires INTEGER,
  created_at INTEGER NOT NULL,
  completed_at INTEGER,
  cancelled_at INTEGER
);
CREATE TABLE IF NOT EXISTS signers (
  id TEXT PRIMARY KEY,
  document_id TEXT NOT NULL REFERENCES documents(id),
  client_id TEXT REFERENCES clients(id),
  position INTEGER NOT NULL DEFAULT 0,
  name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  token TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'pending',
  values_json TEXT NOT NULL DEFAULT '{}',
  signature TEXT,
  annex_signature TEXT,
  annex_signed_at INTEGER,
  viewed_at INTEGER,
  signed_at INTEGER,
  otp_verified_at INTEGER,
  ip TEXT,
  user_agent TEXT,
  geo TEXT
);
CREATE TABLE IF NOT EXISTS audit (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  document_id TEXT NOT NULL REFERENCES documents(id),
  actor TEXT NOT NULL,
  action TEXT NOT NULL,
  meta TEXT,
  at INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS deals (
  id TEXT PRIMARY KEY,
  office_id TEXT NOT NULL REFERENCES offices(id),
  agent_id TEXT NOT NULL REFERENCES users(id),
  property_id TEXT REFERENCES properties(id),
  client_id TEXT REFERENCES clients(id),
  title TEXT NOT NULL,
  stage TEXT NOT NULL DEFAULT 'lead',
  price INTEGER,
  commission INTEGER,
  due_date TEXT,
  paid_at INTEGER,
  notes TEXT,
  created_at INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS tasks (
  id TEXT PRIMARY KEY,
  office_id TEXT NOT NULL REFERENCES offices(id),
  user_id TEXT NOT NULL REFERENCES users(id),
  client_id TEXT REFERENCES clients(id),
  property_id TEXT REFERENCES properties(id),
  title TEXT NOT NULL,
  due TEXT,
  done INTEGER NOT NULL DEFAULT 0,
  created_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_clients_office ON clients(office_id);
CREATE INDEX IF NOT EXISTS idx_properties_office ON properties(office_id);
CREATE INDEX IF NOT EXISTS idx_documents_office ON documents(office_id, created_at);
CREATE INDEX IF NOT EXISTS idx_signers_doc ON signers(document_id);
CREATE INDEX IF NOT EXISTS idx_audit_doc ON audit(document_id);
CREATE INDEX IF NOT EXISTS idx_deals_office ON deals(office_id);
CREATE INDEX IF NOT EXISTS idx_tasks_user ON tasks(user_id, done);
`;

// Columns added after the first release. SQLite has no "ADD COLUMN IF NOT EXISTS", so check first.
const COLUMNS: [table: string, column: string, definition: string][] = [
  ["users", "google_email", "TEXT"],
  ["users", "google_refresh", "TEXT"],
  ["users", "drive_folder_id", "TEXT"],
  ["users", "drive_auto", "INTEGER NOT NULL DEFAULT 1"],
  ["documents", "drive_file_id", "TEXT"],
  ["documents", "drive_link", "TEXT"],
];

function migrate(d: DatabaseSyncType) {
  for (const [table, column, definition] of COLUMNS) {
    const cols = d.prepare(`PRAGMA table_info(${table})`).all() as { name: string }[];
    if (!cols.some((c) => c.name === column)) d.exec(`ALTER TABLE ${table} ADD COLUMN ${column} ${definition}`);
  }
}

const g = globalThis as unknown as { __db?: DatabaseSyncType };

export function db(): DatabaseSyncType {
  if (!g.__db) {
    fs.mkdirSync(PDF_DIR, { recursive: true });
    const d = new DatabaseSync(path.join(DATA_DIR, "app.db"));
    d.exec("PRAGMA journal_mode = WAL; PRAGMA foreign_keys = ON;");
    d.exec(SCHEMA);
    migrate(d);
    g.__db = d;
  }
  return g.__db;
}

type Param = string | number | null | undefined;
const clean = (p: Param[]) => p.map((v) => (v === undefined ? null : v)) as (string | number | null)[];

// node:sqlite returns null-prototype rows; spread them into plain objects so they can cross to client components.
export function all<T>(sql: string, ...params: Param[]): T[] {
  return db().prepare(sql).all(...clean(params)).map((r) => ({ ...r })) as T[];
}

export function get<T>(sql: string, ...params: Param[]): T | undefined {
  const r = db().prepare(sql).get(...clean(params));
  return r ? ({ ...r } as T) : undefined;
}

export function run(sql: string, ...params: Param[]) {
  return db().prepare(sql).run(...clean(params));
}

export function tx<T>(fn: () => T): T {
  const d = db();
  d.exec("BEGIN");
  try {
    const out = fn();
    d.exec("COMMIT");
    return out;
  } catch (e) {
    d.exec("ROLLBACK");
    throw e;
  }
}
