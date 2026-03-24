import { inject, injectable } from 'tsyringe';
import Database from 'better-sqlite3';
import * as path from 'path';
import * as fs from 'fs';
import { TOKENS } from './tokens';
import type { AppConfig } from './app.config';

@injectable()
export class DatabaseProvider {
  private db: Database.Database;

  constructor(
    @inject(TOKENS.AppConfig)
    private readonly config: AppConfig
  ) {
    this.db = new Database(config.dbPath);
    this.db.pragma('journal_mode = WAL');
    this.db.pragma('foreign_keys = ON');
    this.runMigrations();
  }

  public get instance(): Database.Database {
    return this.db;
  }

  private runMigrations(): void {
    const files = fs.readdirSync(this.config.migrationsPath).sort();

    this.db.exec(`
      CREATE TABLE IF NOT EXISTS migrations (
        name TEXT PRIMARY KEY,
        run_at TEXT NOT NULL
      )
    `);

    for (const file of files) {
      const already = this.db
        .prepare('SELECT name FROM migrations WHERE name = ?')
        .get(file);

      if (!already) {
        const sql = fs.readFileSync(path.join(this.config.migrationsPath, file), 'utf-8');
        this.db.exec(sql);
        this.db
          .prepare('INSERT INTO migrations (name, run_at) VALUES (?, ?)')
          .run(file, new Date().toISOString());
      }
    }
  }
}