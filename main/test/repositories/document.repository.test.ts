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

  it('saveMany salva e ritorna i documenti', async () => {
    const { instance, mocks } = createMockDb();

    container.register(TOKENS.DatabaseProvider, {
      useValue: { instance },
    });

    container.register(TOKENS.SearchQueryBuilder, {
      useValue: {},
    });

    const repo = container.resolve(SQLiteDocumentRepository);

    const documents = [
      new Document(
        'doc-1',
        'path',
        new File('file-1', 'path', '100 bytes'),
        [new File('file-2', 'path2', '200 bytes')],
        [new Metadata('name', 'value', MetadataTypeEnum.DATE)],
        'proc-1',
      ),
    ];

    const result = await repo.saveMany(documents);

    expect(result).toHaveLength(1);
    expect(result[0]).toBeInstanceOf(Document);

    expect(instance.prepare).toHaveBeenCalledTimes(4);
    expect(mocks.run).toHaveBeenCalled();
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

  it('findByUuid ritorna null se non esiste', async () => {
    const { instance, mocks } = createMockDb();

    mocks.all.mockReturnValueOnce([]);
    mocks.all.mockReturnValueOnce([]);
    mocks.all.mockReturnValueOnce([]);

    container.register(TOKENS.DatabaseProvider, {
      useValue: { instance },
    });

    container.register(TOKENS.SearchQueryBuilder, {
      useValue: {},
    });

    const repo = container.resolve(SQLiteDocumentRepository);

    const result = await repo.findByUuid('missing', true);

    expect(result).toBeNull();
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

    expect(result).toHaveLength(1);
    expect(result[0]).toBeInstanceOf(Document);
  });

  it('findAllByDipUuid ritorna array vuoto se nessun documento', async () => {
    const { instance, mocks } = createMockDb();

    mocks.all.mockReturnValueOnce([]);

    container.register(TOKENS.DatabaseProvider, {
      useValue: { instance },
    });

    container.register(TOKENS.SearchQueryBuilder, {
      useValue: {},
    });

    const repo = container.resolve(SQLiteDocumentRepository);

    const result = await repo.findAllByDipUuid('dip-1', true);

    expect(result).toEqual([]);
  });

  it('findAllByMetadata funziona con filtri', async () => {
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

    expect(searchQueryBuilderMock.withFilter).toHaveBeenCalled();
    expect(Array.isArray(result)).toBe(true);
    expect(result[0]).toBeInstanceOf(Document);
  });

  it('findAllByMetadata ritorna array vuoto se filtri vuoti', async () => {
    const { instance } = createMockDb();

    container.register(TOKENS.DatabaseProvider, {
      useValue: { instance },
    });

    const searchQueryBuilderMock = {
      withFilter: vi.fn(),
      buildQuery: vi.fn(),
    };

    container.register(TOKENS.SearchQueryBuilder, {
      useValue: searchQueryBuilderMock,
    });

    const repo = container.resolve(SQLiteDocumentRepository);

    const result = await repo.findAllByMetadata([], true);

    expect(result).toEqual([]);
    expect(searchQueryBuilderMock.withFilter).not.toHaveBeenCalled();
  });

  it('findByUuid con withMetadata=false non carica i metadata', async () => {
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
      .mockReturnValueOnce([]); // attachments

    // metadata NON viene chiamato: prepare viene invocato solo 2 volte in hydrateDocs

    container.register(TOKENS.DatabaseProvider, { useValue: { instance } });
    container.register(TOKENS.SearchQueryBuilder, { useValue: {} });

    const repo = container.resolve(SQLiteDocumentRepository);
    const result = await repo.findByUuid('doc-1', false);

    expect(result).toBeInstanceOf(Document);
    expect(result?.getMetadata()).toEqual([]);
  });

  it('findByUuid popola allegati e metadata quando presenti', async () => {
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
      // allegati: due righe per lo stesso documento (copre il ?? [] e il push)
      .mockReturnValueOnce([
        { uuid_documento: 'doc-1', uuid: 'att-1', percorso: 'att-path-1', dimensione: '10 bytes' },
        { uuid_documento: 'doc-1', uuid: 'att-2', percorso: 'att-path-2', dimensione: '20 bytes' },
      ])
      // metadata: due righe per lo stesso documento (copre il ?? [] e il push)
      .mockReturnValueOnce([
        { uuid_documento: 'doc-1', nome: 'Formato', valore: 'pdf', tipo: MetadataTypeEnum.STRING },
        { uuid_documento: 'doc-1', nome: 'Anno', valore: '2024', tipo: MetadataTypeEnum.DATE },
      ]);

    container.register(TOKENS.DatabaseProvider, { useValue: { instance } });
    container.register(TOKENS.SearchQueryBuilder, { useValue: {} });

    const repo = container.resolve(SQLiteDocumentRepository);
    const result = await repo.findByUuid('doc-1', true);

    expect(result).toBeInstanceOf(Document);
    expect(result?.getAttachments()).toHaveLength(2);
    expect(result?.getMetadata()).toHaveLength(2);
  });

  it('findAllByDipUuid con withMetadata=false non carica i metadata', async () => {
    const { instance, mocks } = createMockDb();

    mocks.all
      .mockReturnValueOnce([{ uuid_documento: 'doc-1' }]) // uuid query
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
      .mockReturnValueOnce([]); // attachments

    container.register(TOKENS.DatabaseProvider, { useValue: { instance } });
    container.register(TOKENS.SearchQueryBuilder, { useValue: {} });

    const repo = container.resolve(SQLiteDocumentRepository);
    const result = await repo.findAllByDipUuid('dip-1', false);

    expect(result).toHaveLength(1);
    expect(result[0].getMetadata()).toEqual([]);
  });
});
