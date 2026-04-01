import { container } from 'tsyringe';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { TOKENS } from '../../src/infrastructure/di/tokens';
import { AutoImportDipService } from '../../src/application/auto-import-dip.service';

describe('AutoImportDipService', () => {
  beforeEach(() => {
    container.clearInstances();
  });

  it('Lancia errore se non trova il DiPIndex', async () => {
    container.register(TOKENS.FileService, {
      useValue: {
        findDipIndex: vi.fn().mockResolvedValue(null),
      }
    });

    container.register(TOKENS.DipParser, { useValue: {} });
    container.register(TOKENS.DipRepository, { useValue: {} });
    container.register(TOKENS.AppConfig, { useValue: {} });

    container.register(TOKENS.AutoImportDipUseCase, { useClass: AutoImportDipService });

    const service = container.resolve(TOKENS.AutoImportDipUseCase) as AutoImportDipService;
  
    await expect(service.execute()).rejects.toThrow('DiPIndex mancante');
  });
});