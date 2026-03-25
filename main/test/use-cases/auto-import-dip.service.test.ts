import { container } from 'tsyringe';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { TOKENS } from '../../src/infrastructure/tokens';
import { AutoImportDipService } from '../../src/use-cases/auto-import-dip.service';

describe('AutoImportDipService', () => {
  beforeEach(() => {
    container.clearInstances();
  });

  it('Lancia errore se non trova il DiPIndex', async () => {
    container.register(TOKENS.IFileService, {
      useValue: {
        findDipIndex: vi.fn().mockResolvedValue(null),
      }
    });

    container.register(TOKENS.IDipParserService, { useValue: {} });
    container.register(TOKENS.IRepositoryFactory, { useValue: {} });

    container.register(TOKENS.AppConfig, {  useValue: {} });

    container.register(TOKENS.AutoImportDipUseCase, {
      useClass: AutoImportDipService
    });

    const service = container.resolve(TOKENS.AutoImportDipUseCase);

    await expect(service.execute()).rejects.toThrow('DiPIndex mancante');
  });
});