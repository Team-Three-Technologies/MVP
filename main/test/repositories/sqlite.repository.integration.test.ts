import { createReadStream } from 'node:fs';
import { copyFile, mkdir, mkdtemp, readFile, readdir, rm } from 'node:fs/promises';
import path from 'node:path';
import { tmpdir } from 'node:os';
import * as seed from '../../../e2e/fixtures/seed';

import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { AppConfig } from '../../src/infrastructure/app.config';
import { DatabaseProvider } from '../../src/infrastructure/database/database.provider';
import { FileSystemProvider } from '../../src/infrastructure/fs/file-system.provider.interface';
import { ConservationProcess } from '../../src/domain/conservation-process.model';
import { Dip } from '../../src/domain/dip.model';
import { DocumentClass } from '../../src/domain/document-class.model';
import { Document } from '../../src/domain/document.model';
import { File } from '../../src/domain/file.model';
import { MetadataFilter } from '../../src/domain/metadata-filter.model';
import { MetadataTypeEnum } from '../../src/domain/metadata-type.enum';
import { Metadata } from '../../src/domain/metadata.model';
import { SQLiteConservationProcessRepository } from '../../src/repositories/conservation-process.repository.sqlite';
import { SQLiteDipRepository } from '../../src/repositories/dip.repository.sqlite';
import { SQLiteDocumentClassRepository } from '../../src/repositories/document-class.repository.sqlite';
import { SQLiteDocumentRepository } from '../../src/repositories/document.repository.sqlite';
import { SearchQueryBuilder } from '../../src/repositories/search-query.builder';

const migrationsPath = path.resolve('main/src/infrastructure/database/migrations');

function createFileSystemProvider(rootDir: string): FileSystemProvider {
  const findFile = async (dir: string, namePattern: RegExp): Promise<string | null> => {
    const entries = await readdir(dir, { withFileTypes: true });

    for (const entry of entries) {
      const entryPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        const nested = await findFile(entryPath, namePattern);
        if (nested) return nested;
        continue;
      }

      if (namePattern.test(entry.name)) return entryPath;
    }

    return null;
  };

  return {
    getStartDir: () => rootDir,
    ensureDir: async (dir: string) => {
      await mkdir(dir, { recursive: true });
      return dir;
    },
    findFile,
    readFile,
    readDir: async (dir: string) => readdir(dir),
    createReadStream: (filePath: string) => createReadStream(filePath),
    copyFile: async (sourcePath: string, destPath: string) => {
      await copyFile(sourcePath, destPath);
    },
    createTempFile: async (sourcePath: string) => {
      const tempPath = path.join(rootDir, `tmp-${Date.now()}-${path.basename(sourcePath)}`);
      await copyFile(sourcePath, tempPath);
      return tempPath;
    },
  };
}

describe('SQLite repository integration', () => {
  let tempRoot: string;
  let dbProvider: DatabaseProvider;
  let dipRepository: SQLiteDipRepository;
  let documentClassRepository: SQLiteDocumentClassRepository;
  let conservationProcessRepository: SQLiteConservationProcessRepository;
  let documentRepository: SQLiteDocumentRepository;

  beforeEach(async () => {
    tempRoot = await mkdtemp(path.join(tmpdir(), 'mvp-sqlite-repo-'));

    const config: AppConfig = {
      appDir: tempRoot,
      documentsPath: path.join(tempRoot, 'documents'),
      migrationsPath,
    };

    const fileSystemProvider = createFileSystemProvider(tempRoot);
    dbProvider = new DatabaseProvider(config, fileSystemProvider);

    await dbProvider.init();

    dipRepository = new SQLiteDipRepository(dbProvider);
    documentClassRepository = new SQLiteDocumentClassRepository(dbProvider);
    conservationProcessRepository = new SQLiteConservationProcessRepository(dbProvider);
    documentRepository = new SQLiteDocumentRepository(dbProvider, new SearchQueryBuilder());
  });

  afterEach(async () => {
    try {
      dbProvider?.instance.close();
    } catch {
      // ignore close errors during cleanup
    }

    if (tempRoot) {
      await rm(tempRoot, { recursive: true, force: true });
    }
  });

  async function seedDocumentGraph() {
    const dip = await dipRepository.save(
      new Dip(seed.TEST_DIP_UUID, new Date('2024-01-01T00:00:00.000Z'), 1, 1),
    );

    const documentClass = await documentClassRepository.save(
      new DocumentClass(
        seed.TEST_CLASS_UUID,
        'Classe di prova',
        seed.TEST_CLASS_VERSION,
        new Date('2024-01-02T00:00:00.000Z'),
        undefined,
        dip.getProcessUuid(),
      ),
    );

    const process = await conservationProcessRepository.save(
      new ConservationProcess(
        seed.TEST_PROCESS_UUID,
        new Date('2024-01-03T00:00:00.000Z'),
        '2048 KB',
        1,
        1,
        2,
        documentClass.getUuid(),
        documentClass.getVersion(),
      ),
    );

    return { dip, documentClass, process };
  }

  function createDocument(processUuid: string) {
    return new Document(
      seed.TEST_DOCUMENT_UUID,
      'documents/doc-1',
      new File(seed.TEST_FILE_UUID, 'documents/doc-1/main.pdf', '512 KB'),
      [new File(seed.TEST_FILE_ATTACHMENT_UUID, 'documents/doc-1/attachment.txt', '16 KB')],
      [
        new Metadata('Foo.IdentificativoDelFormato.Formato', 'pdf', MetadataTypeEnum.STRING),
        new Metadata(
          'Foo.ChiaveDescrittiva.Oggetto',
          'Documento di prova',
          MetadataTypeEnum.STRING,
        ),
      ],
      processUuid,
    );
  }

  it('salva e rilegge un documento con allegati e metadata reali', async () => {
    const { process } = await seedDocumentGraph();
    const original = createDocument(process.getUuid());

    await documentRepository.saveMany([original]);

    const loaded = await documentRepository.findByUuid(seed.TEST_DOCUMENT_UUID, true);

    expect(loaded).not.toBeNull();
    expect(loaded?.getUuid()).toBe(seed.TEST_DOCUMENT_UUID);
    expect(loaded?.getPath()).toBe('documents/doc-1');
    expect(loaded?.getConservationProcessUuid()).toBe(seed.TEST_PROCESS_UUID);
    expect(loaded?.getMain().getUuid()).toBe(seed.TEST_FILE_UUID);
    expect(loaded?.getMain().getPath()).toBe('documents/doc-1/main.pdf');
    expect(loaded?.getAttachments()).toHaveLength(1);
    expect(loaded?.getAttachments()[0].getUuid()).toBe(seed.TEST_FILE_ATTACHMENT_UUID);
    expect(loaded?.getMetadata()).toHaveLength(2);
    expect(loaded?.getMetadataValueByName('Foo.IdentificativoDelFormato.Formato')).toBe('pdf');
    expect(loaded?.getMetadataValueByName('Foo.ChiaveDescrittiva.Oggetto')).toBe(
      'Documento di prova',
    );

    const withoutMetadata = await documentRepository.findByUuid(seed.TEST_DOCUMENT_UUID, false);
    expect(withoutMetadata?.getMetadata()).toEqual([]);
  });

  it('trova i documenti di un DIP attraverso le relazioni SQLite', async () => {
    const { dip, process } = await seedDocumentGraph();
    await documentRepository.saveMany([createDocument(process.getUuid())]);

    const documents = await documentRepository.findAllByDipUuid(dip.getProcessUuid(), true);

    expect(documents).toHaveLength(1);
    expect(documents[0].getUuid()).toBe(seed.TEST_DOCUMENT_UUID);
    expect(documents[0].getMetadataValueByName('Foo.ChiaveDescrittiva.Oggetto')).toBe(
      'Documento di prova',
    );
  });

  it('filtra i documenti per metadata usando la tabella metadata_filter_match reale', async () => {
    const { process } = await seedDocumentGraph();
    await documentRepository.saveMany([createDocument(process.getUuid())]);

    const documents = await documentRepository.findAllByMetadata(
      [new MetadataFilter('Formato', 'pdf')],
      true,
    );

    expect(documents).toHaveLength(1);
    expect(documents[0].getUuid()).toBe(seed.TEST_DOCUMENT_UUID);
    expect(documents[0].getMetadataValueByName('Foo.IdentificativoDelFormato.Formato')).toBe('pdf');
  });
});
