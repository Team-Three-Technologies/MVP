import { container } from 'tsyringe';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { TOKENS } from '../../src/infrastructure/di/tokens';

import { SQLiteDocumentRepository } from '../../src/repositories/document.repository.sqlite';
import { Document } from '../../src/domain/document.model';
import { File } from '../../src/domain/file.model';
import { Metadata } from '../../src/domain/metadata.model';
import { MetadataTypeEnum } from '../../src/domain/metadata-type.enum';
import { MetadataFilter } from '../../src/domain/metadata-filter.model';

describe('SQLiteDocumentRepository', () => {
  beforeEach(() => {
    container.clearInstances();
  });

  function createMockDb() {
    const run = vi.fn();
    const all = vi.fn();

    const prepare = vi.fn(() => ({
      run,
      all,
    }));

    const transaction = vi.fn((fn) => fn);

    return {
      instance: {
        prepare,
        transaction,
      },
      mocks: { run, all, prepare, transaction },
    };
  }

  it('saveMany() salva correttamente i documenti', async () => {
    const { instance } = createMockDb();

    container.register(TOKENS.DatabaseProvider, {
      useValue: { instance },
    });

    container.register(TOKENS.SearchQueryBuilder, {
      useValue: {},
    });

    const repo = container.resolve(SQLiteDocumentRepository);

    const document = new Document(
      'doc-1',
      'path',
      new File('file-1', 'path', '100 bytes'),
      [new File('file-2', 'path2', '200 bytes')],
      [new Metadata('name', 'value', MetadataTypeEnum.DATE)],
      'proc-1',
    );

    await repo.saveMany([document]);

    expect(instance.prepare).toHaveBeenCalled();
  });

  it('findByUuid ritorna un Document', async () => {
    const { instance, mocks } = createMockDb();

    mocks.all
      .mockReturnValueOnce([
        {
          uuid: 'doc-1',
          percorso: 'path',
          uuid_processo_conservazione: 'proc',
          file_uuid: 'file-1',
          file_percorso: 'path',
          file_dimensione: '100 bytes',
        },
      ])
      .mockReturnValueOnce([])
      .mockReturnValueOnce([]);

    container.register(TOKENS.DatabaseProvider, {
      useValue: { instance },
    });

    container.register(TOKENS.SearchQueryBuilder, {
      useValue: {},
    });

    const repo = container.resolve(SQLiteDocumentRepository);

    const result = await repo.findByUuid('doc-1', true);

    expect(result).toBeInstanceOf(Document);
  });

  it('findAllByDipUuid ritorna array di Document', async () => {
    const { instance, mocks } = createMockDb();

    mocks.all
      .mockReturnValueOnce([{ uuid_documento: 'doc-1' }])
      .mockReturnValueOnce([
        {
          uuid: 'doc-1',
          percorso: 'path',
          uuid_processo_conservazione: 'proc',
          file_uuid: 'file-1',
          file_percorso: 'path',
          file_dimensione: '100 bytes',
        },
      ])
      .mockReturnValueOnce([])
      .mockReturnValueOnce([]);

    container.register(TOKENS.DatabaseProvider, {
      useValue: { instance },
    });

    container.register(TOKENS.SearchQueryBuilder, {
      useValue: {},
    });

    const repo = container.resolve(SQLiteDocumentRepository);

    const result = await repo.findAllByDipUuid('dip-1', true);

    expect(Array.isArray(result)).toBe(true);
    expect(result[0]).toBeInstanceOf(Document);
  });

  it('findAllByMetadata funziona e gestisce array vuoto', async () => {
    const { instance, mocks } = createMockDb();

    const searchQueryBuilderMock = {
      withFilter: vi.fn(),
      buildQuery: vi.fn().mockReturnValue({
        query: 'SELECT ...',
        params: [],
      }),
    };

    mocks.all
      .mockReturnValueOnce([{ uuid_documento: 'doc-1' }])
      .mockReturnValueOnce([
        {
          uuid: 'doc-1',
          percorso: 'path',
          uuid_processo_conservazione: 'proc',
          file_uuid: 'file-1',
          file_percorso: 'path',
          file_dimensione: '100 bytes',
        },
      ])
      .mockReturnValueOnce([])
      .mockReturnValueOnce([]);

    container.register(TOKENS.DatabaseProvider, {
      useValue: { instance },
    });

    container.register(TOKENS.SearchQueryBuilder, {
      useValue: searchQueryBuilderMock,
    });

    const repo = container.resolve(SQLiteDocumentRepository);

    const result = await repo.findAllByMetadata([new MetadataFilter('Formato', '.pdf')], true);

    const resultEmpty = await repo.findAllByMetadata([], true);

    expect(resultEmpty).toEqual([]);
    expect(Array.isArray(result)).toBe(true);
    expect(result[0]).toBeInstanceOf(Document);
  });
});
