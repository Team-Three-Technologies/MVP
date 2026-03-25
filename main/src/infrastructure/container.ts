import { container } from 'tsyringe';
import * as path from 'path';
import { app } from 'electron';
import { TOKENS } from './tokens';
import { DatabaseProvider } from './database.provider';
import { SQLiteRepositoryFactory } from '../repositories/repository.factory.sqlite';
import { FileServiceImpl } from '../services/file.service.impl';
import { SHA256HashServiceImpl } from '../services/hash.service.sha256.impl';
import { DipParserServiceImpl } from '../services/dip-parser.service.impl';
import { AutoImportDipService } from '../use-cases/auto-import-dip.service';
import { DipHandler } from '../ipc/dip.handler';
import type { AppConfig } from './app.config';

export function registerDependencies(): void {
  container.register(TOKENS.AppConfig, {
    useValue: {
      migrationsPath: path.join(app.getAppPath(), 'dist/main/main/src/infrastructure/migrations'),
      documentsPath: path.join(app.getPath('userData'), 'documents'),
      appDir: path.dirname(process.execPath),
    } as AppConfig,
  });

  // infrastructure
  container.register(TOKENS.DatabaseProvider, { useClass: DatabaseProvider });

  // repositories
  container.register(TOKENS.IRepositoryFactory, { useClass: SQLiteRepositoryFactory });

  // services
  container.register(TOKENS.IFileService, { useClass: FileServiceImpl });
  container.register(TOKENS.IHashService, { useClass: SHA256HashServiceImpl });
  container.register(TOKENS.IDipParserService, { useClass: DipParserServiceImpl });

  // use cases
  container.register(TOKENS.AutoImportDipUseCase, { useClass: AutoImportDipService });

  // handlers
  container.registerSingleton(DipHandler);
}