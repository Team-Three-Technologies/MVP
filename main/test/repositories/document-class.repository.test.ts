import { container } from 'tsyringe';
import { beforeEach, describe, expect, expectTypeOf, it, vi } from 'vitest';
import { TOKENS } from '../../src/infrastructure/di/tokens';

import { SQLiteDocumentClassRepository } from '../../src/repositories/document-class.repository.sqlite';
import { DocumentClass } from '../../src/domain/document-class.model';

describe('SQLiteDocumentClassRepository', () => {
  beforeEach(() => {
    container.clearInstances();
    container.register(TOKENS.DatabaseProvider, { useValue: {} });
  });

  it('save(documentClass), se avviene con successo restituisce la documentClass passata', async () => {
    const mockContainer = {
      prepare: vi.fn().mockReturnValue({
        run: vi.fn(),
      }),
    };
    const mockDatabaseProvider = {
      instance: mockContainer,
    };
    container.register(TOKENS.DatabaseProvider, {
      useValue: mockDatabaseProvider,
    });

    const docClassRepo = container.resolve(SQLiteDocumentClassRepository);

    const resultComplete = await docClassRepo.save(
      new DocumentClass(
        'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
        'name',
        'v1.0',
        new Date(),
        new Date(),
        'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
      ),
    );
    const resultUncomplete = await docClassRepo.save(
      new DocumentClass(
        'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
        'name',
        'v1.0',
        new Date(),
        undefined,
        'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
      ),
    );
    expect(resultComplete).toBeInstanceOf(DocumentClass);
    expect(resultUncomplete).toBeInstanceOf(DocumentClass);
  });
});
