import { container } from 'tsyringe';
import * as path from 'path';
import { app } from 'electron';
import { TOKENS } from './tokens';
import { DatabaseProvider } from './database.provider';
import { SQLiteDipRepository } from '../repositories/dip.repository.sqlite';
import { SHA256HashServiceImpl } from '../services/hash.service.sha256.impl';
import { ZipServiceImpl } from '../services/zip.service.impl';
import { XmlServiceImpl } from '../services/xml.service.impl';
import { OpenZipDialogService } from '../use-cases/open-zip-dialog.service';
import { AutoImportDipService } from '../use-cases/auto-import-dip.service';
import { ImportDipService } from '../use-cases/import-dip.service';
import { DialogHandler } from '../ipc/dialog.handler';
import { DipHandler } from '../ipc/dip.handler';
import type { AppConfig } from './app.config';

export function registerDependencies(): void {
  container.register(TOKENS.AppConfig, {
    useValue: {
      dbPath: path.join(app.getPath('userData'), 'app.db'),
      migrationsPath: path.join(app.getAppPath(), 'dist/main/main/src/infrastructure/migrations'),
      extractPath: path.join(app.getPath('userData'), 'extract')
    } as AppConfig,
  });

  container.registerSingleton(DatabaseProvider);

  container.register(TOKENS.IDipRepository, { useClass: SQLiteDipRepository });

  container.register(TOKENS.IHashService, { useClass: SHA256HashServiceImpl });
  container.register(TOKENS.IZipService, { useClass: ZipServiceImpl });
  container.register(TOKENS.IXmlService, { useClass: XmlServiceImpl });

  container.register(TOKENS.OpenZipDialogUseCase, { useClass: OpenZipDialogService });
  container.register(TOKENS.AutoImportDipUseCase, { useClass: AutoImportDipService });
  container.register(TOKENS.ImportDipUseCase, { useClass: ImportDipService });

  container.registerSingleton(DialogHandler);
  container.registerSingleton(DipHandler);
}