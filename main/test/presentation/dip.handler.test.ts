import { container } from 'tsyringe';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { TOKENS } from '../../src/infrastructure/di/tokens';
import { DipHandler } from '../../src/presentation/dip.handler';

describe('DipHandler', () => {
  beforeEach(() => {
    container.clearInstances();
  });

  it('Restituisce data vuoto se va tutto bene', async () => {
    container.register(TOKENS.AutoImportDipUseCase, {
      useValue: {
        execute: vi.fn().mockResolvedValue(null),
      }
    });

    const handler = container.resolve(DipHandler);
    const result = await handler.autoImport();
    
    expect(result.data).toBe(undefined);
    expect(result.error).toBeNull();
  });

  it('Restituisce error se UseCase da errore', async () => {
    container.register(TOKENS.AutoImportDipUseCase,{
      useValue: {
        execute: vi.fn().mockThrow(new Error('DiPIndex mancante')),
      }
    });

    const handler = container.resolve(DipHandler);
    const result = await handler.autoImport();
    
    expect(result.data).toBeNull();
    expect(result.error).toEqual('DiPIndex mancante');
  });
});