import { container } from 'tsyringe';
import * as path from 'path';
import { app } from 'electron';
import { TOKENS } from './tokens';
import { DatabaseProvider } from './database.provider';
import { SqliteDocumentRepository } from '../repositories/document.sqlite.repository';
import { DocumentService } from '../use-cases/document.service';
import { DocumentHandler } from '../ipc/document.handler';
import type { DbConfig } from './database.config';

export function registerDependencies(): void {
  container.register(TOKENS.DbConfig, {
    useValue: {
      dbPath: path.join(app.getPath('userData'), 'app.db'),
      migrationsPath: path.join(
        app.getAppPath(), 'dist/main/main/infrastructure/migrations'
      ),
    } as DbConfig,
  });

  container.registerSingleton(DatabaseProvider);

  container.register(TOKENS.DocumentRepository, {
    useClass: SqliteDocumentRepository,
  });

  container.register(TOKENS.DocumentUseCase, {
    useClass: DocumentService,
  });

  container.registerSingleton(DocumentHandler);
}