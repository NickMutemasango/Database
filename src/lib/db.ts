import { DatabaseSync } from "node:sqlite";
import path from "path";

const DB_PATH = path.join(process.cwd(), "church.db");

let db: DatabaseSync;

export default function getDb(): DatabaseSync {
  if (!db) {
    db = new DatabaseSync(DB_PATH);
    db.exec("PRAGMA journal_mode = WAL");
    db.exec("PRAGMA foreign_keys = ON");
    initSchema(db);
    migrate(db);
  }
  return db;
}

function initSchema(db: DatabaseSync) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS families (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      surname    TEXT    NOT NULL,
      address    TEXT    NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS members (
      id                 INTEGER PRIMARY KEY AUTOINCREMENT,
      family_id          INTEGER NOT NULL,
      full_name          TEXT    NOT NULL,
      phone              TEXT    NOT NULL,
      role               TEXT    NOT NULL,
      email              TEXT    DEFAULT NULL,
      member_type        TEXT    NOT NULL DEFAULT 'Regular Attender',
      custom_member_type TEXT    DEFAULT NULL,
      FOREIGN KEY (family_id) REFERENCES families(id) ON DELETE CASCADE
    );
  `);
}

// Idempotent column additions for existing databases
function migrate(db: DatabaseSync) {
  const cols = [
    "ALTER TABLE members ADD COLUMN email              TEXT DEFAULT NULL",
    "ALTER TABLE members ADD COLUMN member_type        TEXT NOT NULL DEFAULT 'Regular Attender'",
    "ALTER TABLE members ADD COLUMN custom_member_type TEXT DEFAULT NULL",
  ];
  for (const sql of cols) {
    try {
      db.exec(sql);
    } catch {
      // Column already exists — safe to ignore
    }
  }
}
