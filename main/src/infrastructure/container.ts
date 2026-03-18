import { container } from 'tsyringe';
import * as path from 'path';
import { app } from 'electron';
import { TOKENS } from './tokens';
import { DatabaseProvider } from './database.provider';
import { ZipServiceImpl } from '../services/zip.service.impl';
import { XmlServiceImpl } from '../services/xml.service.impl';
import { OpenDialogService } from '../use-cases/open-dialog.service';
import { AutoImportDiPService } from '../use-cases/auto-import-dip.service';
import { ImportDiPService } from '../use-cases/import-dip.service';
import { DialogHandler } from '../ipc/dialog.handler';
import { DiPHandler } from '../ipc/dip.handler';
import type { DatabaseConfig } from './database.config';

export function registerDependencies(): void {
  container.register(TOKENS.DatabaseConfig, {
    useValue: {
      dbPath: path.join(app.getPath('userData'), 'app.db'),
      migrationsPath: path.join(
        app.getAppPath(), 'dist/main/main/infrastructure/migrations'
      ),
    } as DatabaseConfig,
  });

  container.registerSingleton(DatabaseProvider);

  container.register(TOKENS.ZipService, { useClass: ZipServiceImpl });
  container.register(TOKENS.XmlService, { useClass: XmlServiceImpl });

  container.register(TOKENS.OpenDialogUseCase, { useClass: OpenDialogService });
  container.register(TOKENS.AutoImportDiPUseCase, { useClass: AutoImportDiPService });
  container.register(TOKENS.ImportDiPUseCase, { useClass: ImportDiPService });

  container.registerSingleton(DialogHandler);
  container.registerSingleton(DiPHandler);
}