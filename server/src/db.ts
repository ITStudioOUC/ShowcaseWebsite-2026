import initSqlJs, { Database as SqlJsDatabase, SqlJsStatic } from 'sql.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH = path.join(__dirname, '..', 'data', 'showcase.db');

const dataDir = path.dirname(DB_PATH);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

/**
 * sql.js 包装器，提供类似 better-sqlite3 的同步 API
 */
class Database {
  private db: SqlJsDatabase | null = null;

  async init() {
    const SQL: SqlJsStatic = await initSqlJs();
    if (fs.existsSync(DB_PATH)) {
      const buffer = fs.readFileSync(DB_PATH);
      this.db = new SQL.Database(buffer);
    } else {
      this.db = new SQL.Database();
    }
  }

  private ensureReady(): SqlJsDatabase {
    if (!this.db) throw new Error('Database not initialized. Call init() first.');
    return this.db;
  }

  /** 执行多条 SQL（DDL 等），自动保存 */
  exec(sql: string) {
    const d = this.ensureReady();
    d.exec(sql);
    this.save();
  }

  /** 准备一个语句，返回 { all, get, run } */
  prepare(sql: string) {
    const d = this.ensureReady();
    const self = this;
    return {
      all: (...params: any[]): any[] => {
        try {
          const stmt = d.prepare(sql);
          if (params.length > 0) stmt.bind(params);
          const rows: any[] = [];
          while (stmt.step()) {
            rows.push(stmt.getAsObject());
          }
          stmt.free();
          return rows;
        } catch (e) {
          console.error('[DB] all error:', sql, params, e);
          return [];
        }
      },
      get: (...params: any[]): any | undefined => {
        try {
          const stmt = d.prepare(sql);
          if (params.length > 0) stmt.bind(params);
          let row: any = undefined;
          if (stmt.step()) {
            row = stmt.getAsObject();
          }
          stmt.free();
          return row;
        } catch (e) {
          console.error('[DB] get error:', sql, params, e);
          return undefined;
        }
      },
      run: (...params: any[]) => {
        try {
          const stmt = d.prepare(sql);
          if (params.length > 0) stmt.bind(params);
          while (stmt.step()) { /* execute */ }
          stmt.free();
          // 查询 last_insert_rowid
          const idStmt = d.prepare('SELECT last_insert_rowid() as id');
          let lastInsertRowid = 0;
          if (idStmt.step()) {
            lastInsertRowid = idStmt.getAsObject().id as number;
          }
          idStmt.free();
          const changes = d.getRowsModified();
          self.save(); // 写操作后自动持久化
          return { changes, lastInsertRowid };
        } catch (e) {
          console.error('[DB] run error:', sql, params, e);
          return { changes: 0, lastInsertRowid: 0 };
        }
      }
    };
  }

  /** 创建事务 */
  transaction(fn: () => void) {
    const self = this;
    return () => {
      const d = self.ensureReady();
      d.exec('BEGIN');
      try {
        fn();
        d.exec('COMMIT');
        self.save();
      } catch (e) {
        // sql.js 可能在错误时已自动回滚，吞掉二次回滚的错误
        try { d.exec('ROLLBACK'); } catch { /* already rolled back */ }
        throw e;
      }
    };
  }

  save() {
    if (!this.db) return;
    const data = this.db.export();
    fs.writeFileSync(DB_PATH, Buffer.from(data));
  }
}

const db = new Database();

async function initDB() {
  await db.init();
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS members (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      year TEXT NOT NULL,
      dept TEXT NOT NULL,
      title TEXT DEFAULT '',
      name TEXT NOT NULL,
      avatar TEXT DEFAULT '',
      dest TEXT DEFAULT '',
      badge TEXT DEFAULT '',
      tech TEXT DEFAULT '',
      sort_order INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS achievements (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      year TEXT NOT NULL,
      depth TEXT NOT NULL,
      title TEXT NOT NULL,
      "desc" TEXT DEFAULT '',
      tags TEXT DEFAULT '[]',
      link TEXT DEFAULT '',
      img TEXT DEFAULT '',
      sort_order INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS faqs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      question TEXT NOT NULL,
      answer TEXT NOT NULL,
      sort_order INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS activities (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      "desc" TEXT DEFAULT '',
      link TEXT DEFAULT '',
      svg_d TEXT DEFAULT '',
      sort_order INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS articles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      slug TEXT UNIQUE NOT NULL,
      title TEXT NOT NULL,
      content TEXT DEFAULT '',
      published INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS stats (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      key TEXT UNIQUE NOT NULL,
      value TEXT NOT NULL,
      description TEXT DEFAULT ''
    );

    CREATE TABLE IF NOT EXISTS org_leaders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      dept TEXT NOT NULL,
      title TEXT DEFAULT '',
      name TEXT NOT NULL,
      avatar TEXT DEFAULT '',
      tag TEXT DEFAULT '',
      sort_order INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS mentors (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT DEFAULT '',
      name TEXT NOT NULL,
      avatar TEXT DEFAULT '',
      research TEXT DEFAULT '',
      sort_order INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);
  console.log('[DB] 数据库初始化完成');
}

export { initDB, db };
export default db;
