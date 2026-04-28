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
    container.register(TOKENS.SearchDocumentsFromMetadataUseCase, { useValue: {} });
    container.register(TOKENS.FileInternalPreviewUseCase, { useValue: {} });
    container.register(TOKENS.FileExternalPreviewUseCase, { useValue: {} });
    container.register(TOKENS.ExportFileUseCase, { useValue: {} });
  });

  describe('getDocumentDetails', () => {
    it('restituisce data e error = null se ok', async () => {
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

    it('restituisce errore se fallisce', async () => {
      container.register(TOKENS.GetDocumentDetailsUseCase, {
        useValue: {
          execute: vi
            .fn()
            .mockRejectedValue(
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

      expect(result.data).toBeNull();
      expect(result.error).toBe(
        'Non esiste un documento con questo UUID: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
      );
    });
  });

  describe('searchDocuments', () => {
    it('restituisce data e error = null se ok', async () => {
      container.register(TOKENS.SearchDocumentsFromMetadataUseCase, {
        useValue: {
          execute: vi.fn().mockResolvedValue({
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

      const handler = container.resolve(DocumentHandler);
      const result = await handler.searchDocuments({
        filters: [{ type: 'Tipo soggetto', value: 'PG' }],
      });

      expect(result.data).toStrictEqual({
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
      });

      expect(result.error).toBeNull();
    });

    it('restituisce errore se fallisce', async () => {
      container.register(TOKENS.SearchDocumentsFromMetadataUseCase, {
        useValue: {
          execute: vi.fn().mockRejectedValue(new Error('Errore')),
        },
      });

      const handler = container.resolve(DocumentHandler);
      const result = await handler.searchDocuments({
        filters: [{ type: 'Tipo soggetto', value: 'PG' }],
      });

      expect(result.data).toBeNull();
      expect(result.error).toBe('Errore');
    });
  });

  describe('fileInternalPreview', () => {
    it('restituisce data e error = null se ok', async () => {
      container.register(TOKENS.FileInternalPreviewUseCase, {
        useValue: {
          execute: vi.fn().mockResolvedValue({
            buffer: Buffer.from('test'),
            mimeType: 'application/pdf',
          }),
        },
      });

      const handler = container.resolve(DocumentHandler);
      const result = await handler.fileInternalPreview({
        documentUuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
        fileUuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
      });

      expect(result.data).toStrictEqual({
        buffer: Buffer.from('test'),
        mimeType: 'application/pdf',
      });

      expect(result.error).toBeNull();
    });

    it('restituisce errore se fallisce', async () => {
      container.register(TOKENS.FileInternalPreviewUseCase, {
        useValue: {
          execute: vi.fn().mockRejectedValue(new Error('Errore preview interna')),
        },
      });

      const handler = container.resolve(DocumentHandler);
      const result = await handler.fileInternalPreview({
        documentUuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
        fileUuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
      });

      expect(result.data).toBeNull();
      expect(result.error).toBe('Errore preview interna');
    });
  });

  describe('fileExternalPreview', () => {
    it('restituisce data = void e error = null se ok', async () => {
      container.register(TOKENS.FileExternalPreviewUseCase, {
        useValue: {
          execute: vi.fn().mockResolvedValue(undefined),
        },
      });

      const handler = container.resolve(DocumentHandler);
      const result = await handler.fileExternalPreview({
        documentUuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
        fileUuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
      });

      expect(result.data).toBeUndefined();
      expect(result.error).toBeNull();
    });

    it('restituisce errore se fallisce', async () => {
      container.register(TOKENS.FileExternalPreviewUseCase, {
        useValue: {
          execute: vi.fn().mockRejectedValue(new Error('Errore preview esterna')),
        },
      });

      const handler = container.resolve(DocumentHandler);
      const result = await handler.fileExternalPreview({
        documentUuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
        fileUuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
      });

      expect(result.data).toBeNull();
      expect(result.error).toBe('Errore preview esterna');
    });
  });

  describe('exportFile', () => {
    it('restituisce data e error = null se ok', async () => {
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

    it('errore (#1)', async () => {
      container.register(TOKENS.ExportFileUseCase, {
        useValue: {
          execute: vi
            .fn()
            .mockRejectedValue(
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

    it('errore (#2)', async () => {
      container.register(TOKENS.ExportFileUseCase, {
        useValue: {
          execute: vi
            .fn()
            .mockRejectedValue(
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

    it('errore (#3)', async () => {
      container.register(TOKENS.ExportFileUseCase, {
        useValue: {
          execute: vi.fn().mockRejectedValue(new Error('Selezione cancellata')),
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

    it('errore (#4)', async () => {
      container.register(TOKENS.ExportFileUseCase, {
        useValue: {
          execute: vi
            .fn()
            .mockRejectedValue(
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
});
