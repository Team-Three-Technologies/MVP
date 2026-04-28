import { container } from 'tsyringe';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { TOKENS } from '../../src/infrastructure/di/tokens';
import { DipHandler } from '../../src/presentation/dip.handler';
import { AutoImportDipResponseDTO } from '../../../shared/response/auto-import-dip.response.dto';
import { DipContentResponseDTO } from '../../../shared/response/dip-content.response.dto';
import { IpcMainEvent } from 'electron';
import { IPC_CHANNELS } from '../../../shared/ipc-channels';

describe('DipHandler', () => {
  beforeEach(() => {
    container.clearInstances();

    container.register(TOKENS.AutoImportDipUseCase, { useValue: {} });
    container.register(TOKENS.GetDipContentUseCase, { useValue: {} });
    container.register(TOKENS.CheckDipIntegrityUseCase, { useValue: {} });
  });

  describe('autoImport', () => {
    it('restituisce data e error = null se ok', async () => {
      container.register(TOKENS.AutoImportDipUseCase, {
        useValue: {
          execute: vi.fn().mockResolvedValue({
            dipUuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
          }),
        },
      });

      const handler = container.resolve(DipHandler);
      const result = await handler.autoImport();

      expect(result.data).toStrictEqual({
        dipUuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
      } as AutoImportDipResponseDTO);
      expect(result.error).toBeNull();
    });

    it('errore (#1)', async () => {
      container.register(TOKENS.AutoImportDipUseCase, {
        useValue: {
          execute: vi.fn().mockRejectedValue(new Error('DiPIndex mancante')),
        },
      });

      const handler = container.resolve(DipHandler);
      const result = await handler.autoImport();

      expect(result.data).toBeNull();
      expect(result.error).toBe('DiPIndex mancante');
    });

    it('errore (#2)', async () => {
      container.register(TOKENS.AutoImportDipUseCase, {
        useValue: {
          execute: vi.fn().mockRejectedValue(new Error('DiP già importato in precedenza')),
        },
      });

      const handler = container.resolve(DipHandler);
      const result = await handler.autoImport();

      expect(result.data).toBeNull();
      expect(result.error).toBe('DiP già importato in precedenza');
    });

    it('errore (#3)', async () => {
      container.register(TOKENS.AutoImportDipUseCase, {
        useValue: {
          execute: vi.fn().mockRejectedValue(new Error('AipInfo mancante')),
        },
      });

      const handler = container.resolve(DipHandler);
      const result = await handler.autoImport();

      expect(result.data).toBeNull();
      expect(result.error).toBe('AipInfo mancante');
    });
  });

  describe('getDipContent', () => {
    it('restituisce data e error = null se ok', async () => {
      container.register(TOKENS.GetDipContentUseCase, {
        useValue: {
          execute: vi.fn().mockResolvedValue({
            uuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
            creationDate: new Date('2026-07-17'),
            documentNumber: 5,
            aipNumber: 3,
            documentsList: [
              {
                documentUuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
                documentName: 'DocumentoDiProva',
                documentAttachments: [
                  {
                    uuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
                    name: 'AllegatoDiProva',
                  },
                ],
              },
            ],
          }),
        },
      });

      const handler = container.resolve(DipHandler);
      const result = await handler.getDipContent({
        dipUuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
      });

      expect(result.data).toStrictEqual({
        uuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
        creationDate: new Date('2026-07-17'),
        documentNumber: 5,
        aipNumber: 3,
        documentsList: [
          {
            documentUuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
            documentName: 'DocumentoDiProva',
            documentAttachments: [
              {
                uuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
                name: 'AllegatoDiProva',
              },
            ],
          },
        ],
      } as DipContentResponseDTO);

      expect(result.error).toBeNull();
    });

    it('restituisce errore se fallisce', async () => {
      container.register(TOKENS.GetDipContentUseCase, {
        useValue: {
          execute: vi
            .fn()
            .mockRejectedValue(
              new Error('Non esiste un DiP con questo UUID: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'),
            ),
        },
      });

      const handler = container.resolve(DipHandler);
      const result = await handler.getDipContent({
        dipUuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
      });

      expect(result.data).toBeNull();
      expect(result.error).toBe(
        'Non esiste un DiP con questo UUID: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
      );
    });
  });

  describe('checkDipIntegrity', () => {
    it('invia risultati e DONE', async () => {
      const mockSend = vi.fn();

      const mockEvent = {
        sender: {
          send: mockSend,
        },
      } as unknown as IpcMainEvent;

      async function* generator() {
        yield {
          documents: [
            {
              integrity: {
                uuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
                status: true,
              },
              attachments: [
                {
                  uuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
                  status: true,
                },
              ],
            },
          ],
        };
      }

      container.register(TOKENS.CheckDipIntegrityUseCase, {
        useValue: {
          execute: vi.fn().mockReturnValue(generator()),
        },
      });

      const handler = container.resolve(DipHandler);

      await handler.checkDipIntegrity(mockEvent, {
        dipUuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
      });

      expect(mockSend).toHaveBeenCalledWith(
        IPC_CHANNELS.DIP_CHECK_INTEGRITY_RESULT,
        expect.objectContaining({
          data: expect.anything(),
          error: null,
        }),
      );

      expect(mockSend).toHaveBeenCalledWith(IPC_CHANNELS.DIP_CHECK_INTEGRITY_DONE);
    });

    it('invia ERROR se fallisce', async () => {
      const mockSend = vi.fn();

      const mockEvent = {
        sender: {
          send: mockSend,
        },
      } as unknown as IpcMainEvent;

      container.register(TOKENS.CheckDipIntegrityUseCase, {
        useValue: {
          execute: vi.fn().mockImplementation(async function* () {
            throw new Error('errore');
          }),
        },
      });

      const handler = container.resolve(DipHandler);

      await handler.checkDipIntegrity(mockEvent, {
        dipUuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
      });

      expect(mockSend).toHaveBeenCalledWith(
        IPC_CHANNELS.DIP_CHECK_INTEGRITY_ERROR,
        expect.objectContaining({
          error: 'errore',
        }),
      );
    });
  });
});
