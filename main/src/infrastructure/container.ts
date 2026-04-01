import { container, Lifecycle } from 'tsyringe';
import { TOKENS } from './tokens';
import type { AppConfig } from './app.config';
import * as path from 'path';
import { app } from 'electron';
import { DatabaseProvider } from './database.provider';
import { SQLiteDipRepository } from '../repositories/dip.repository.sqlite';
import { FileServiceImpl } from '../services/file.service.impl';
import { SHA256HashServiceImpl } from '../services/hash.service.sha256.impl';
import { DipParserImpl } from '../services/dip.parser.impl';
import { DipIndexParserImpl } from '../services/dip-index.parser.impl';
import { MetadataParserImpl } from '../services/metadata.parser.impl';
import { AutoImportDipService } from '../application/auto-import-dip.service';
import { DipHandler } from '../presentation/dip.handler';

export function registerDependencies(): void {
  container.register(TOKENS.AppConfig, {
    useValue: {
      migrationsPath: path.join(app.getAppPath(), 'dist/main/main/src/infrastructure/migrations'),
      documentsPath: path.join(app.getPath('userData'), 'documents'),
      appDir: path.dirname(process.execPath),
    } as AppConfig,
  });

  // infrastructure
  container.register(TOKENS.DatabaseProvider, { useClass: DatabaseProvider }, { lifecycle: Lifecycle.Singleton });

  // repositories
  container.register(TOKENS.DipRepository, { useClass: SQLiteDipRepository });

  // services
  container.register(TOKENS.FileService, { useClass: FileServiceImpl });
  container.register(TOKENS.HashService, { useClass: SHA256HashServiceImpl });
  container.register(TOKENS.DipParser, { useClass: DipParserImpl });
  container.register(TOKENS.DipIndexParser, { useClass: DipIndexParserImpl });
  container.register(TOKENS.MetadataParser, { useClass: MetadataParserImpl });

  // use cases
  container.register(TOKENS.AutoImportDipUseCase, { useClass: AutoImportDipService });

  // handlers
  container.registerSingleton(DipHandler);
}