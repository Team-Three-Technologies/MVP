import { container } from 'tsyringe';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { DialogHandler } from '../../src/ipc/dialog.handler';
import { TOKENS } from '../../src/infrastructure/tokens';

describe('DialogHandler', () => {
  beforeEach(() => {
    container.clearInstances();
  });

  it('Restituisce il path selezionato', async () => {
    container.register(TOKENS.OpenZipDialogUseCase, {
      useValue: {
        execute: vi.fn().mockResolvedValue('/path/to/file.zip'),
      },
    });

    const handler = container.resolve(DialogHandler);
    const result = await handler.openZipDialog();

    expect(result.data).toBe('/path/to/file.zip');
    expect(result.error).toBeNull();
  });

  it('Restituisce null se l\'utente annulla', async () => {
    container.register(TOKENS.OpenZipDialogUseCase, {
      useValue: {
        execute: vi.fn().mockResolvedValue(null),
      },
    });

    const handler = container.resolve(DialogHandler);
    const result = await handler.openZipDialog();

    expect(result.data).toBeNull();
    expect(result.error).toBeNull();
  });

  it('Restituisce errore se lo UseCase lancia eccezione', async () => {
    container.register(TOKENS.OpenZipDialogUseCase, {
      useValue: {
        execute: vi.fn().mockRejectedValue(new Error('Dialog fallito')),
      },
    });

    const handler = container.resolve(DialogHandler);
    const result = await handler.openZipDialog();

    expect(result.data).toBeNull();
    expect(result.error).toBe('Dialog fallito');
  });
});