import { container } from 'tsyringe';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { TOKENS } from '../../src/infrastructure/di/tokens';
import { DipHandler } from '../../src/presentation/dip.handler';
import { IpcMainEvent } from 'electron';
import { IPC_CHANNELS } from '../../../shared/ipc-channels';

describe('DipHandler', () => {
  beforeEach(() => {
    container.clearInstances();
    vi.restoreAllMocks();

    // registrazioni base (poi sovrascritte nei singoli test)
    container.register(TOKENS.AutoImportDipUseCase, { useValue: { execute: vi.fn() } });
    container.register(TOKENS.GetDipContentUseCase, { useValue: { execute: vi.fn() } });
    container.register(TOKENS.CheckDipIntegrityUseCase, { useValue: { execute: vi.fn() } });
  });

  describe('autoImport', () => {
    it('restituisce ok(data) se execute risolve', async () => {
      const execute = vi.fn().mockResolvedValue({
        dipUuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
      });

      container.register(TOKENS.AutoImportDipUseCase, { useValue: { execute } });

      const handler = container.resolve(DipHandler);
      const result = await handler.autoImport();

      expect(execute).toHaveBeenCalledTimes(1);
      expect(result).toEqual({
        data: { dipUuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx' },
        error: null,
      });
    });

    it.each(['DiPIndex mancante', 'DiP già importato in precedenza', 'AipInfo mancante'])(
      'restituisce fail(message) se execute rigetta: %s',
      async (msg) => {
        const execute = vi.fn().mockRejectedValue(new Error(msg));
        container.register(TOKENS.AutoImportDipUseCase, { useValue: { execute } });

        const handler = container.resolve(DipHandler);
        const result = await handler.autoImport();

        expect(execute).toHaveBeenCalledTimes(1);
        expect(result.data).toBeNull();
        expect(result.error).toBe(msg);
      },
    );
  });

  describe('getDipContent', () => {
    it('restituisce ok(data) e chiama execute con dipUuid', async () => {
      const execute = vi.fn().mockResolvedValue({
        uuid: 'dip-uuid',
        creationDate: new Date('2026-07-17'),
        documentNumber: 5,
        aipNumber: 3,
        documentsList: [],
      });

      container.register(TOKENS.GetDipContentUseCase, { useValue: { execute } });

      const handler = container.resolve(DipHandler);
      const result = await handler.getDipContent({ dipUuid: 'dip-uuid' });

      expect(execute).toHaveBeenCalledTimes(1);
      expect(execute).toHaveBeenCalledWith('dip-uuid');

      expect(result.error).toBeNull();
      expect(result.data).toStrictEqual({
        uuid: 'dip-uuid',
        creationDate: new Date('2026-07-17'),
        documentNumber: 5,
        aipNumber: 3,
        documentsList: [],
      });
    });

    it('restituisce fail(message) se execute rigetta', async () => {
      const execute = vi
        .fn()
        .mockRejectedValue(new Error('Non esiste un DiP con questo UUID: dip-uuid'));

      container.register(TOKENS.GetDipContentUseCase, { useValue: { execute } });

      const handler = container.resolve(DipHandler);
      const result = await handler.getDipContent({ dipUuid: 'dip-uuid' });

      expect(execute).toHaveBeenCalledTimes(1);
      expect(execute).toHaveBeenCalledWith('dip-uuid');

      expect(result.data).toBeNull();
      expect(result.error).toBe('Non esiste un DiP con questo UUID: dip-uuid');
    });
  });

  describe('checkDipIntegrity', () => {
    const makeEvent = () => {
      const send = vi.fn();
      const event = { sender: { send } } as unknown as IpcMainEvent;
      return { event, send };
    };

    it('invia 1..N RESULT (ok) e poi DONE, in ordine', async () => {
      const { event, send } = makeEvent();

      async function* generator() {
        yield { step: 1 };
        yield { step: 2 };
      }

      const execute = vi.fn().mockReturnValue(generator());
      container.register(TOKENS.CheckDipIntegrityUseCase, { useValue: { execute } });

      const handler = container.resolve(DipHandler);
      await handler.checkDipIntegrity(event, { dipUuid: 'dip-uuid' });

      expect(execute).toHaveBeenCalledTimes(1);
      expect(execute).toHaveBeenCalledWith('dip-uuid');

      // due result + done
      expect(send).toHaveBeenCalledTimes(3);

      expect(send).toHaveBeenNthCalledWith(1, IPC_CHANNELS.DIP_CHECK_INTEGRITY_RESULT, {
        data: { step: 1 },
        error: null,
      });

      expect(send).toHaveBeenNthCalledWith(2, IPC_CHANNELS.DIP_CHECK_INTEGRITY_RESULT, {
        data: { step: 2 },
        error: null,
      });

      expect(send).toHaveBeenNthCalledWith(3, IPC_CHANNELS.DIP_CHECK_INTEGRITY_DONE);
    });

    it('se il generator è vuoto invia solo DONE', async () => {
      const { event, send } = makeEvent();

      async function* generator() {
        // no yield
      }

      const execute = vi.fn().mockReturnValue(generator());
      container.register(TOKENS.CheckDipIntegrityUseCase, { useValue: { execute } });

      const handler = container.resolve(DipHandler);
      await handler.checkDipIntegrity(event, { dipUuid: 'dip-uuid' });

      expect(execute).toHaveBeenCalledWith('dip-uuid');

      expect(send).toHaveBeenCalledTimes(1);
      expect(send).toHaveBeenCalledWith(IPC_CHANNELS.DIP_CHECK_INTEGRITY_DONE);

      expect(send).not.toHaveBeenCalledWith(
        IPC_CHANNELS.DIP_CHECK_INTEGRITY_RESULT,
        expect.anything(),
      );
      expect(send).not.toHaveBeenCalledWith(
        IPC_CHANNELS.DIP_CHECK_INTEGRITY_ERROR,
        expect.anything(),
      );
    });

    it('invia ERROR (fail) se execute/generator fallisce e non invia DONE/RESULT', async () => {
      const { event, send } = makeEvent();

      // fallimento durante l'iterazione
      const execute = vi.fn().mockImplementation(async function* () {
        throw new Error('errore');
      });

      container.register(TOKENS.CheckDipIntegrityUseCase, { useValue: { execute } });

      const handler = container.resolve(DipHandler);
      await handler.checkDipIntegrity(event, { dipUuid: 'dip-uuid' });

      expect(execute).toHaveBeenCalledTimes(1);
      expect(execute).toHaveBeenCalledWith('dip-uuid');

      expect(send).toHaveBeenCalledTimes(1);
      expect(send).toHaveBeenCalledWith(IPC_CHANNELS.DIP_CHECK_INTEGRITY_ERROR, {
        data: null,
        error: 'errore',
      });

      expect(send).not.toHaveBeenCalledWith(IPC_CHANNELS.DIP_CHECK_INTEGRITY_DONE);
      expect(send).not.toHaveBeenCalledWith(
        IPC_CHANNELS.DIP_CHECK_INTEGRITY_RESULT,
        expect.anything(),
      );
    });
  });
});
