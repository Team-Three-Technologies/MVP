import { inject, injectable } from 'tsyringe';
import { TOKENS } from '../di/tokens';
import Database from 'better-sqlite3';
import { AppConfig } from '../app.config';
import { FileSystemProvider } from '../fs/file-system.provider.interface';
import * as path from 'node:path';

@injectable()
export class DatabaseProvider {
  private db: Database.Database | null = null;

  constructor(
    @inject(TOKENS.AppConfig)
    private readonly config: AppConfig,
    @inject(TOKENS.FileSystemProvider)
    private readonly fileSystemProvider: FileSystemProvider,
  ) {}

  public async init(): Promise<void> {
    try {
      await this.fileSystemProvider.ensureDir(this.config.documentsPath);
    } catch (e) {
      console.log(e);
    }

    this.db = new Database(path.join(this.config.documentsPath, 'app.db'));
    this.db.pragma('journal_mode = WAL');
    this.db.pragma('foreign_keys = ON');

    await this.runMigrations();
  }

  public get instance(): Database.Database {
    if (!this.db) {
      throw new Error('DatabaseProvider non inizializzato');
    }
    return this.db;
  }

  private async runMigrations(): Promise<void> {
    try {
      this.fileSystemProvider.ensureDir(this.config.migrationsPath);
    } catch (e) {
      console.log(e);
    }

    const files = (await this.fileSystemProvider.readDir(this.config.migrationsPath)).sort();

    this.db?.exec(`
      CREATE TABLE IF NOT EXISTS migrations (
        name TEXT PRIMARY KEY,
        run_at TEXT NOT NULL
      );
    `);

    for (const file of files) {
      const already = this.db?.prepare('SELECT name FROM migrations WHERE name = ?;').get(file);

      if (!already) {
        const sql = (
          await this.fileSystemProvider.readFile(path.join(this.config.migrationsPath, file))
        ).toString('utf8');
        this.db?.exec(sql);
        this.db
          ?.prepare('INSERT INTO migrations (name, run_at) VALUES (?, ?);')
          .run(file, new Date().toISOString());
      }
    }
  }
}
