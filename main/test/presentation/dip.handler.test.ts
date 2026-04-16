import { container } from 'tsyringe';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { TOKENS } from '../../src/infrastructure/di/tokens';
import { DipHandler } from '../../src/presentation/dip.handler';
import { AutoImportResponseDTO } from '../../../shared/auto-import.response.dto';

describe('DipHandler', () => {
  beforeEach(() => {
    container.clearInstances();
  });

  it('Restituisce data = AutoImportResponseDTO con uuid del DiP se va tutto bene', async () => {
    container.register(TOKENS.AutoImportDipUseCase, {
      useValue: {
        execute: vi.fn().mockResolvedValue('xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'),
      },
    });

    const handler = container.resolve(DipHandler);
    const result = await handler.autoImport();

    expect(result.data).toStrictEqual({
      dipUuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
    } as AutoImportResponseDTO);
    expect(result.error).toBeNull();
  });

  it('Restituisce error = e.message se UseCase throwa Error', async () => {
    container.register(TOKENS.AutoImportDipUseCase, {
      useValue: {
        execute: vi.fn().mockThrow(new Error('DiPIndex mancante')),
      },
    });

    const handler = container.resolve(DipHandler);
    const result = await handler.autoImport();

    expect(result.data).toBe(null);
    expect(result.error).toEqual('DiPIndex mancante');
  });
});
