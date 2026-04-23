import { container } from 'tsyringe';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { TOKENS } from '../../src/infrastructure/di/tokens';
import { DocumentHandler } from '../../src/presentation/document.handler';
import { DocumentDetailsResponseDTO } from '../../../shared/response/document-details.response.dto';
import { ExportFileResponseDTO } from '../../../shared/response/export-file.response';

describe('DocumentHandler', () => {
  beforeEach(() => {
    container.clearInstances();
    container.register(TOKENS.GetDocumentDetailsUseCase, { useValue: {} });
    container.register(TOKENS.ExportFileUseCase, { useValue: {} });
    container.register(TOKENS.FileInternalPreviewUseCase, { useValue: {} });
    container.register(TOKENS.FileExternalPreviewUseCase, { useValue: {} });
  });

  it('getDocumentDetails() restituisce IpcResponse con data = DocumentDetailsResponseDTO e error = null se GetDocumentDetailsUseCase.execute() termina correttamente', async () => {
    container.register(TOKENS.GetDocumentDetailsUseCase, {
      useValue: {
        execute: vi.fn().mockResolvedValue({
          uuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
          name: 'DocumentoDiProva',
          extension: '.pdf',
          registrationType: 'Nessuno',
          registrationDate: '17-07-2026',
          registrationTime: '12:00:00',
          content: 'Oggetto',
          version: '1.0.1',
          filesCount: 3,
          totalSize: '768 bytest',
          attachmentsCount: 2,
          attachments: [
            {
              uuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
              path: 'Allegato1',
              extension: '.png',
            },
            {
              uuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
              path: 'Allegato2',
              extension: '.pdf',
            },
          ],
        }),
      },
    });

    const handler = container.resolve(DocumentHandler);
    const result = await handler.getDocumentDetails({
      documentUuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
    });

    expect(result.data).toStrictEqual({
      uuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
      name: 'DocumentoDiProva',
      extension: '.pdf',
      registrationType: 'Nessuno',
      registrationDate: '17-07-2026',
      registrationTime: '12:00:00',
      content: 'Oggetto',
      version: '1.0.1',
      filesCount: 3,
      totalSize: '768 bytest',
      attachmentsCount: 2,
      attachments: [
        {
          uuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
          path: 'Allegato1',
          extension: '.png',
        },
        {
          uuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
          path: 'Allegato2',
          extension: '.pdf',
        },
      ],
    } as DocumentDetailsResponseDTO);
    expect(result.error).toBeNull();
  });

  it('getDocumentDetails() restituisce IpcResponse con data = null e error = string se GetDocumentDetailsUseCase.execute() lancia errore', async () => {
    container.register(TOKENS.GetDocumentDetailsUseCase, {
      useValue: {
        execute: vi
          .fn()
          .mockThrow(
            new Error(
              'Non esiste un documento con questo UUID: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
            ),
          ),
      },
    });

    const handler = container.resolve(DocumentHandler);
    const result = await handler.getDocumentDetails({
      documentUuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
    });

    expect(result.data).toBe(null);
    expect(result.error).toEqual(
      'Non esiste un documento con questo UUID: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
    );
  });

  it('exportFile() restituisce IpcResponse con data = ExportFileResponseDTO e error = null se ExportFileUseCase.execute() termina correttamente', async () => {
    container.register(TOKENS.ExportFileUseCase, {
      useValue: {
        execute: vi.fn().mockResolvedValue({
          path: '/path/to/test.pdf',
        }),
      },
    });

    const handler = container.resolve(DocumentHandler);
    const result = await handler.exportFile({
      documentUuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
      fileUuid: undefined,
    });

    expect(result.data).toStrictEqual({
      path: '/path/to/test.pdf',
    } as ExportFileResponseDTO);
    expect(result.error).toBeNull();
  });

  it('exportFile() restituisce IpcResponse con data = null e error = string se ExportFileUseCase.execute() lancia errore (#1)', async () => {
    container.register(TOKENS.ExportFileUseCase, {
      useValue: {
        execute: vi
          .fn()
          .mockThrow(
            new Error(
              'Non esiste un documento con questo UUID: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
            ),
          ),
      },
    });

    const handler = container.resolve(DocumentHandler);
    const result = await handler.exportFile({
      documentUuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
      fileUuid: undefined,
    });

    expect(result.data).toBeNull();
    expect(result.error).toBe(
      'Non esiste un documento con questo UUID: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
    );
  });

  it('exportFile() restituisce IpcResponse con data = null e error = string se ExportFileUseCase.execute() lancia errore (#2)', async () => {
    container.register(TOKENS.ExportFileUseCase, {
      useValue: {
        execute: vi
          .fn()
          .mockThrow(
            new Error(
              'Non esiste un file con UUID: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx associato al documento con UUID: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
            ),
          ),
      },
    });

    const handler = container.resolve(DocumentHandler);
    const result = await handler.exportFile({
      documentUuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
      fileUuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
    });

    expect(result.data).toBeNull();
    expect(result.error).toBe(
      'Non esiste un file con UUID: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx associato al documento con UUID: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
    );
  });

  it('exportFile() restituisce IpcResponse con data = null e error = string se ExportFileUseCase.execute() lancia errore (#3)', async () => {
    container.register(TOKENS.ExportFileUseCase, {
      useValue: {
        execute: vi.fn().mockThrow(new Error('Selezione cancellata')),
      },
    });

    const handler = container.resolve(DocumentHandler);
    const result = await handler.exportFile({
      documentUuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
      fileUuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
    });

    expect(result.data).toBeNull();
    expect(result.error).toBe('Selezione cancellata');
  });

  it('exportFile() restituisce IpcResponse con data = null e error = string se ExportFileUseCase.execute() lancia errore (#4)', async () => {
    container.register(TOKENS.ExportFileUseCase, {
      useValue: {
        execute: vi
          .fn()
          .mockThrow(
            new Error(
              'Esportazione file con UUID: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx a /path/to/test.pdf',
            ),
          ),
      },
    });

    const handler = container.resolve(DocumentHandler);
    const result = await handler.exportFile({
      documentUuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
      fileUuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
    });

    expect(result.data).toBeNull();
    expect(result.error).toBe(
      'Esportazione file con UUID: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx a /path/to/test.pdf',
    );
  });
});
