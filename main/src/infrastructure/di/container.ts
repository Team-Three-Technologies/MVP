import { container, Lifecycle } from 'tsyringe';
import { TOKENS } from './tokens';
import { AppConfig } from '../app.config';
import * as path from 'node:path';
import { app } from 'electron';
import { LocalFileSystemProvider } from '../fs/file-system.provider.local';
import { ElectronDialogProvider } from '../dialog/dialog.provider.electron';
import { DatabaseProvider } from '../database/database.provider';
import { Base64ProviderImpl } from '../../infrastructure/base64/base64.provider.impl';
import { CryptoHashProvider } from '../hash/hash.provider.crypto';
import { DipParserImpl } from '../../infrastructure/parsing/dip.parser.impl';
import { DipIndexParserImpl } from '../../infrastructure/parsing/dip-index.parser.impl';
import { AipInfoParserImpl } from '../../infrastructure/parsing/aip-info.parser.impl';
import { MetadataParserImpl } from '../../infrastructure/parsing/metadata.parser.impl';
import { SQLiteDipRepository } from '../../repositories/dip.repository.sqlite';
import { SQLiteDocumentClassRepository } from '../../repositories/document-class.repository.sqlite';
import { SQLiteConservationProcessRepository } from '../../repositories/conservation-process.repository.sqlite';
import { SQLiteDocumentRepository } from '../../repositories/document.repository.sqlite';
import { MetadataFlattener } from '../../mappers/metadata.flattener';
import { SubjectMapper } from '../../mappers/subject.mapper';
import { DocumentMapper } from '../../mappers/document.mapper';
import { ConservationProcessMapper } from '../../mappers/conservation-process.mapper';
import { DocumentClassMapper } from '../../mappers/document-class.mapper';
import { DipMapper } from '../../mappers/dip.mapper';
import { AutoImportDipService } from '../../application/auto-import-dip.service';
import { GetDipContentService } from '../../application/get-dip-content.service';
import { CheckDipIntegrityService } from '../../application/check-dip-integrity.service';
import { GetDocumentDetailsService } from '../../application/get-document-details.service';
import { ExportFileService } from '../../application/export-file.service';
import { DipHandler } from '../../presentation/dip.handler';
import { DocumentHandler } from '../../presentation/document.handler';

function getLaunchDir(): string {
  const dirFromEnv = process.env.PORTABLE_EXECUTABLE_DIR;
  if (dirFromEnv) return dirFromEnv;

  const fileFromEnv = process.env.PORTABLE_EXECUTABLE_FILE;
  if (fileFromEnv) return path.dirname(fileFromEnv);

  return path.dirname(process.execPath);
}

export function registerDependencies(): void {
  container.register(TOKENS.AppConfig, {
    useValue: {
      migrationsPath: path.join(
        app.getAppPath(),
        'dist/main/main/src/infrastructure/database/migrations',
      ),
      documentsPath: path.join(app.getPath('userData'), 'documents'),
      appDir: getLaunchDir(),
    } as AppConfig,
  });

  // infrastructure
  // fs
  container.register(
    TOKENS.FileSystemProvider,
    { useClass: LocalFileSystemProvider },
    { lifecycle: Lifecycle.Singleton },
  );
  // db
  container.register(
    TOKENS.DatabaseProvider,
    { useClass: DatabaseProvider },
    { lifecycle: Lifecycle.Singleton },
  );
  // dialog
  container.register(
    TOKENS.DialogProvider,
    { useClass: ElectronDialogProvider },
    { lifecycle: Lifecycle.Singleton },
  );
  // base64
  container.register(
    TOKENS.Base64Provider,
    { useClass: Base64ProviderImpl },
    { lifecycle: Lifecycle.Singleton },
  );
  // hash
  container.register(
    TOKENS.HashProvider,
    { useClass: CryptoHashProvider },
    { lifecycle: Lifecycle.Singleton },
  );
  // parsing
  container.register(
    TOKENS.DipParser,
    { useClass: DipParserImpl },
    { lifecycle: Lifecycle.Singleton },
  );
  container.register(
    TOKENS.DipIndexParser,
    { useClass: DipIndexParserImpl },
    { lifecycle: Lifecycle.Singleton },
  );
  container.register(
    TOKENS.AipInfoParser,
    { useClass: AipInfoParserImpl },
    { lifecycle: Lifecycle.Singleton },
  );
  container.register(
    TOKENS.MetadataParser,
    { useClass: MetadataParserImpl },
    { lifecycle: Lifecycle.Singleton },
  );

  // repositories
  container.register(
    TOKENS.DipRepository,
    {
      useClass: SQLiteDipRepository,
    },
    { lifecycle: Lifecycle.Singleton },
  );
  container.register(
    TOKENS.DocumentClassRepository,
    {
      useClass: SQLiteDocumentClassRepository,
    },
    { lifecycle: Lifecycle.Singleton },
  );
  container.register(
    TOKENS.ConservationProcessRepository,
    {
      useClass: SQLiteConservationProcessRepository,
    },
    { lifecycle: Lifecycle.Singleton },
  );
  container.register(
    TOKENS.DocumentRepository,
    {
      useClass: SQLiteDocumentRepository,
    },
    { lifecycle: Lifecycle.Singleton },
  );

  // mappers
  container.register(
    TOKENS.MetadataFlattener,
    { useClass: MetadataFlattener },
    { lifecycle: Lifecycle.Singleton },
  );
  container.register(
    TOKENS.SubjectMapper,
    { useClass: SubjectMapper },
    { lifecycle: Lifecycle.Singleton },
  );
  container.register(
    TOKENS.DocumentMapper,
    { useClass: DocumentMapper },
    { lifecycle: Lifecycle.Singleton },
  );
  container.register(
    TOKENS.ConservationProcessMapper,
    { useClass: ConservationProcessMapper },
    { lifecycle: Lifecycle.Singleton },
  );
  container.register(
    TOKENS.DocumentClassMapper,
    { useClass: DocumentClassMapper },
    { lifecycle: Lifecycle.Singleton },
  );
  container.register(TOKENS.DipMapper, { useClass: DipMapper }, { lifecycle: Lifecycle.Singleton });

  // use cases
  container.register(
    TOKENS.AutoImportDipUseCase,
    { useClass: AutoImportDipService },
    { lifecycle: Lifecycle.Singleton },
  );
  container.register(
    TOKENS.GetDocumentDetailsUseCase,
    { useClass: GetDocumentDetailsService },
    { lifecycle: Lifecycle.Singleton },
  );
  container.register(
    TOKENS.CheckDipIntegrityUseCase,
    { useClass: CheckDipIntegrityService },
    { lifecycle: Lifecycle.Singleton },
  );
  container.register(
    TOKENS.GetDipContentUseCase,
    { useClass: GetDipContentService },
    { lifecycle: Lifecycle.Singleton },
  );
  container.register(
    TOKENS.ExportFileUseCase,
    { useClass: ExportFileService },
    { lifecycle: Lifecycle.Singleton },
  );

  // handlers
  container.registerSingleton(DipHandler);
  container.registerSingleton(DocumentHandler);
}
