import { container } from 'tsyringe';
import * as path from 'path';
import { app } from 'electron';
import { TOKENS } from './tokens';
import { DatabaseProvider } from './database.provider';
import { SQLiteDipRepository } from '../repositories/dip.repository.sqlite';
import { FileServiceImpl } from '../services/file.service.impl';
import { SHA256HashServiceImpl } from '../services/hash.service.sha256.impl';
import { ZipServiceImpl } from '../services/zip.service.impl';
import { DipParserServiceImpl } from '../services/dip-parser.service.impl';
import { OpenZipDialogService } from '../use-cases/open-zip-dialog.service';
import { AutoImportDipService } from '../use-cases/auto-import-dip.service';
import { ZipImportDipService } from '../use-cases/zip-import-dip.service';
import { DialogHandler } from '../ipc/dialog.handler';
import { DipHandler } from '../ipc/dip.handler';
import type { AppConfig } from './app.config';

export function registerDependencies(): void {
  container.register(TOKENS.AppConfig, {
    useValue: {
      appDir: path.dirname(process.execPath),
      dbPath: path.join(app.getPath('userData'), 'app.db'),
      migrationsPath: path.join(app.getAppPath(), 'dist/main/main/src/infrastructure/migrations'),
      documentsPath: path.join(app.getPath('userData'), 'documents'),
    } as AppConfig,
  });

  // infrastructure
  container.registerSingleton(DatabaseProvider);

  // repositories
  container.register(TOKENS.IDipRepository, { useClass: SQLiteDipRepository });

  // services
  container.register(TOKENS.IFileService, { useClass: FileServiceImpl });
  container.register(TOKENS.IHashService, { useClass: SHA256HashServiceImpl });
  container.register(TOKENS.IZipService, { useClass: ZipServiceImpl });
  container.register(TOKENS.IDipParserService, { useClass: DipParserServiceImpl });

  // use cases
  container.register(TOKENS.OpenZipDialogUseCase, { useClass: OpenZipDialogService });
  container.register(TOKENS.AutoImportDipUseCase, { useClass: AutoImportDipService });
  container.register(TOKENS.ZipImportDipUseCase, { useClass: ZipImportDipService });

  // handlers
  container.registerSingleton(DialogHandler);
  container.registerSingleton(DipHandler);
}