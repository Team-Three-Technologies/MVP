import { container, Lifecycle } from 'tsyringe';
import { TOKENS } from './tokens';
import type { AppConfig } from '../app.config';
import * as path from 'node:path';
import { app } from 'electron';
import { DatabaseProvider } from '../database/database.provider';
import { SQLiteDipRepository } from '../../repositories/dip.repository.sqlite';
import { SQLiteDocumentClassRepository } from '../../repositories/document-class.repository.sqlite';
import { SQLiteConservationProcessRepository } from '../../repositories/conservation-process.repository.sqlite';
import { SQLiteDocumentRepository } from '../../repositories/document.repository.sqlite';
import { FileServiceImpl } from '../../infrastructure/fs/file.service.impl';
import { SHA256HashServiceImpl } from '../../infrastructure/hash/hash.service.sha256.impl';
import { DipParserImpl } from '../../infrastructure/parsing/dip.parser.impl';
import { DipIndexParserImpl } from '../../infrastructure/parsing/dip-index.parser.impl';
import { MetadataParserImpl } from '../../infrastructure/parsing/metadata.parser.impl';
import { AutoImportDipService } from '../../application/auto-import-dip.service';
import { DipHandler } from '../../presentation/dip.handler';

export function registerDependencies(): void {
  container.register(TOKENS.AppConfig, {
    useValue: {
      migrationsPath: path.join(app.getAppPath(), 'dist/main/main/src/infrastructure/database/migrations'),
      documentsPath: path.join(app.getPath('userData'), 'documents'),
      appDir: path.dirname(process.execPath),
    } as AppConfig,
  });

  // infrastructure
  // db
  container.register(TOKENS.DatabaseProvider, { useClass: DatabaseProvider }, { lifecycle: Lifecycle.Singleton });
  // fs
  container.register(TOKENS.FileService, { useClass: FileServiceImpl }, { lifecycle: Lifecycle.Singleton });
  // hash
  container.register(TOKENS.HashService, { useClass: SHA256HashServiceImpl }, { lifecycle: Lifecycle.Singleton });
  // parsing
  container.register(TOKENS.DipParser, { useClass: DipParserImpl }, { lifecycle: Lifecycle.Singleton });
  container.register(TOKENS.DipIndexParser, { useClass: DipIndexParserImpl }, { lifecycle: Lifecycle.Singleton });
  container.register(TOKENS.MetadataParser, { useClass: MetadataParserImpl }, { lifecycle: Lifecycle.Singleton });

  // repositories
  container.register(TOKENS.DipRepository, { useClass: SQLiteDipRepository });
  container.register(TOKENS.DocumentClassRepository, { useClass: SQLiteDocumentClassRepository });
  container.register(TOKENS.ConservationProcessRepository, { useClass: SQLiteConservationProcessRepository });
  container.register(TOKENS.DocumentRepository, { useClass: SQLiteDocumentRepository });

  // use cases
  container.register(TOKENS.AutoImportDipUseCase, { useClass: AutoImportDipService }, { lifecycle: Lifecycle.Singleton });

  // handlers
  container.registerSingleton(DipHandler);
}