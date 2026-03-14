import { container } from 'tsyringe';
import { TOKENS } from './tokens';
import { SqliteDocumentRepository } from '../domains/documents/document.sqlite.repository';
import { DatabaseProvider } from './database.provider';
import { app } from 'electron';
import * as path from 'path';
import { DbConfig } from './database.config';

export function registerDependencies(): void {
  container.register(TOKENS.DbConfig, {
    useValue: {
      dbPath: path.join(app.getPath('userData'), 'app.db'),
      migrationsPath: path.join(app.getAppPath(), 'dist/main/main/infrastructure/migrations'),
    } as DbConfig,
  });

  container.registerSingleton(DatabaseProvider);

  container.register(TOKENS.DocumentRepository, {
    useClass: SqliteDocumentRepository,
  });
}