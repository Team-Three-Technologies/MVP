import { inject, injectable } from 'tsyringe';
import Database from 'better-sqlite3';
import * as path from 'path';
import * as fs from 'fs';
import { TOKENS } from './tokens';
import type { AppConfig } from './app.config';

@injectable()
export class DatabaseProvider {
  private readonly databases = new Map<string, Database.Database>();

  constructor(
    @inject(TOKENS.AppConfig)
    private readonly config: AppConfig
  ) { }

  public getDb(dipUuid: string): Database.Database {
    if (this.databases.has(dipUuid)) {
      return this.databases.get(dipUuid)!;
    }

    const dbPath = this.getDbPath(dipUuid);
    const db = new Database(dbPath);
    db.pragma('journal_mode = WAL');
    db.pragma('foreign_keys = ON');
    this.runMigrations(db);
    this.databases.set(dipUuid, db);
    return db;
  }

  public close(dipUuid: string): void {
    const db = this.databases.get(dipUuid);
    if (db) {
      db.close();
      this.databases.delete(dipUuid);
    }
  }

  public closeAll(): void {
    for (const [dipUuid] of this.databases) {
      this.close(dipUuid);
    }
  }

  public delete(dipUuid: string): void {
    this.close(dipUuid);
    const dbPath = this.getDbPath(dipUuid);
    if (fs.existsSync(dbPath)) {
      fs.unlinkSync(dbPath);
    }
  }

  private getDbPath(dipUuid: string): string {
    return path.join(this.config.documentsPath, dipUuid, `${dipUuid}.db`);
  }

  private runMigrations(db: Database.Database): void {
    const files = fs.readdirSync(this.config.migrationsPath).sort();

    db.exec(`
      CREATE TABLE IF NOT EXISTS migrations (
        name TEXT PRIMARY KEY,
        run_at TEXT NOT NULL
      )
    `);

    for (const file of files) {
      const already = db
        .prepare('SELECT name FROM migrations WHERE name = ?')
        .get(file);

      if (!already) {
        const sql = fs.readFileSync(path.join(this.config.migrationsPath, file), 'utf-8');
        db.exec(sql);
        db
          .prepare('INSERT INTO migrations (name, run_at) VALUES (?, ?)')
          .run(file, new Date().toISOString());
      }
    }
  }
}