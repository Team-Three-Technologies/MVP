import { container } from 'tsyringe';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { TOKENS } from '../../src/infrastructure/di/tokens';
import { DipHandler } from '../../src/presentation/dip.handler';
import { AutoImportDipResponseDTO } from '../../../shared/response/auto-import-dip.response.dto';
import { DipContentResponseDTO } from '../../../shared/response/dip-content.response.dto';
import { DipIntegrityResponseDTO } from '../../../shared/response/dip-integrity.response.dto';

describe('DipHandler', () => {
  beforeEach(() => {
    container.clearInstances();
    container.register(TOKENS.AutoImportDipUseCase, { useValue: {} });
    container.register(TOKENS.GetDipContentUseCase, { useValue: {} });
    container.register(TOKENS.CheckDipIntegrityUseCase, { useValue: {} });
  });

  it('autoImport() restituisce IpcResponse con data = AutoImportDipResponseDTO e error = null se AutoImportDipUseCase.execute() termina correttamente', async () => {
    container.register(TOKENS.AutoImportDipUseCase, {
      useValue: {
        execute: vi.fn().mockResolvedValue({ dipUuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx' }),
      },
    });

    const handler = container.resolve(DipHandler);
    const result = await handler.autoImport();

    expect(result.data).toStrictEqual({
      dipUuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
    } as AutoImportDipResponseDTO);
    expect(result.error).toBeNull();
  });

  it('autoImport() restituisce IpcResponse con data = null e error = string se AutoImportDipUseCase.execute() lancia errore (#1)', async () => {
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

  it('autoImport() restituisce IpcResponse con data = null e error = string se AutoImportDipUseCase.execute() lancia errore (#2)', async () => {
    container.register(TOKENS.AutoImportDipUseCase, {
      useValue: {
        execute: vi.fn().mockThrow(new Error('DiP già importato in precedenza')),
      },
    });

    const handler = container.resolve(DipHandler);
    const result = await handler.autoImport();

    expect(result.data).toBe(null);
    expect(result.error).toEqual('DiP già importato in precedenza');
  });

  it('autoImport() restituisce IpcResponse con data = null e error = string se AutoImportDipUseCase.execute() lancia errore (#3)', async () => {
    container.register(TOKENS.AutoImportDipUseCase, {
      useValue: {
        execute: vi.fn().mockThrow(new Error('AipInfo mancante')),
      },
    });

    const handler = container.resolve(DipHandler);
    const result = await handler.autoImport();

    expect(result.data).toBe(null);
    expect(result.error).toEqual('AipInfo mancante');
  });

  it('getDipContent() restituisce IpcResponse con data = DipContentResponseDTO e error = null se GetDipContentUseCase.execute() termina correttamente', async () => {
    container.register(TOKENS.GetDipContentUseCase, {
      useValue: {
        execute: vi.fn().mockResolvedValue({
          uuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
          creationDate: new Date('17-07-2026'),
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
      creationDate: new Date('17-07-2026'),
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

  it('getDipContent() restituisce IpcResponse con data = null e error = string se GetDipContentUseCase.execute() lancia errore', async () => {
    container.register(TOKENS.GetDipContentUseCase, {
      useValue: {
        execute: vi
          .fn()
          .mockThrow(
            new Error('Non esiste un DiP con questo UUID: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'),
          ),
      },
    });

    const handler = container.resolve(DipHandler);
    const result = await handler.getDipContent({
      dipUuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
    });

    expect(result.data).toBeNull();
    expect(result.error).toEqual(
      'Non esiste un DiP con questo UUID: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
    );
  });

  // it('checkDipIntegrity() restituisce IpcResponse con data = DipIntegrityResponseDTO e error = null se GetDipContentUseCase.execute() termina correttamente', async () => {
  //   container.register(TOKENS.CheckDipIntegrityUseCase, {
  //     useValue: {
  //       execute: vi.fn().mockResolvedValue({
  //         documents: [
  //           {
  //             integrity: {
  //               uuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
  //               status: true,
  //             },
  //             attachments: [
  //               {
  //                 uuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
  //                 status: true,
  //               },
  //             ],
  //           },
  //         ],
  //       }),
  //     },
  //   });

  //   const handler = container.resolve(DipHandler);
  //   const result = await handler.checkDipIntegrity({
  //     event:
  //     dipUuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
  //   });

  //   expect(result.data).toStrictEqual({
  //     documents: [
  //       {
  //         integrity: {
  //           uuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
  //           status: true,
  //         },
  //         attachments: [
  //           {
  //             uuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
  //             status: true,
  //           },
  //         ],
  //       },
  //     ],
  //   } as DipIntegrityResponseDTO);
  //   expect(result.error).toBeNull();
  // });

  // it('checkDipIntegrity() restituisce IpcResponse con data = null e error = string se GetDipContentUseCase.execute() lancia errore (#1)', async () => {
  //   container.register(TOKENS.CheckDipIntegrityUseCase, {
  //     useValue: {
  //       execute: vi.fn().mockThrow(new Error('errore')),
  //     },
  //   });

  //   const handler = container.resolve(DipHandler);
  //   const result = await handler.checkDipIntegrity({
  //     dipUuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
  //   });

  //   expect(result.data).toBeNull();
  //   expect(result.error).toBe('errore');
  // });
});
