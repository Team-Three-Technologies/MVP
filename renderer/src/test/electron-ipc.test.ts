import { TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ElectronIpc } from '../app/services/electron-ipc';

const mockElectronAPI = {
  dip: {
    autoImport: vi.fn(),
    content: vi.fn(),
    checkIntegrity: vi.fn(),
  },
  document: {
    exportFile: vi.fn(),
    details: vi.fn(),
    fileInternalPreview: vi.fn(),
    fileExternalPreview: vi.fn(),
    searchDocuments: vi.fn(),
  },
  on: vi.fn(),
} satisfies Window['electronAPI'];

describe('ElectronIpc', () => {
  let service: ElectronIpc;

  beforeEach(() => {
    vi.resetAllMocks();
    window.electronAPI = mockElectronAPI;
    TestBed.configureTestingModule({
      providers: [ElectronIpc],
    });
    service = TestBed.inject(ElectronIpc);
  });

  describe('autoImport', () => {
    it('dovrebbe restituire la risposta di auto-import in caso di successo', async () => {
      mockElectronAPI.dip.autoImport.mockResolvedValue({
        data: { dipUuid: 'test-dip-uuid' },
        error: null,
      });
      const response = await service.autoImport();
      expect(response).toEqual({ dipUuid: 'test-dip-uuid' });
    });

    it("dovrebbe lanciare un errore in caso di fallimento dell'auto-import", async () => {
      mockElectronAPI.dip.autoImport.mockResolvedValue({ data: null, error: 'Auto import failed' });
      await expect(service.autoImport()).rejects.toThrow('Auto import failed');
    });

    it("dovrebbe lanciare un errore quando l'API fallisce", async () => {
      mockElectronAPI.dip.autoImport.mockRejectedValue(new Error('API error'));
      await expect(service.autoImport()).rejects.toThrow('API error');
    });
  });

  describe('content', () => {
    it('dovrebbe restituire il contenuto in caso di successo', async () => {
      const mockContentResponse = { documentsList: [] };
      mockElectronAPI.dip.content.mockResolvedValue({ data: mockContentResponse, error: null });
      const response = await service.content({ dipUuid: 'test-dip-uuid' } as any);
      expect(response).toEqual(mockContentResponse);
    });

    it('dovrebbe lanciare un errore in caso di fallimento del caricamento del contenuto', async () => {
      mockElectronAPI.dip.content.mockResolvedValue({
        data: null,
        error: 'Content loading failed',
      });
      await expect(service.content({ dipUuid: 'test-dip-uuid' } as any)).rejects.toThrow(
        'Content loading failed',
      );
    });
  });

  describe('checkIntegrity', () => {
    it("dovrebbe chiamare checkIntegrity sull'API", () => {
      const mockCheckIntegrity = { dipUuid: 'test-dip-uuid' } as any;
      service.checkIntegrity(mockCheckIntegrity);
      expect(mockElectronAPI.dip.checkIntegrity).toHaveBeenCalledWith({ dipUuid: 'test-dip-uuid' });
    });

    it('dovrebbe lanciare un errore in caso di fallimento del controllo integrità', () => {
      mockElectronAPI.dip.checkIntegrity.mockImplementation(() => {
        throw new Error('Integrity check failed');
      });
      expect(() => service.checkIntegrity({ dipUuid: 'test-dip-uuid' } as any)).toThrow(
        'Integrity check failed',
      );
    });
  });

  describe('getDocumentDetails', () => {
    it('dovrebbe restituire i dettagli del documento in caso di successo', async () => {
      const mockDetailsResponse = { uuid: 'doc-123', name: 'Documento test', attachments: [] };
      mockElectronAPI.document.details.mockResolvedValue({
        data: mockDetailsResponse,
        error: null,
      });
      const response = await service.getDocumentDetails({ documentUuid: 'doc-123' } as any);
      expect(response).toEqual(mockDetailsResponse);
    });

    it('dovrebbe lanciare un errore in caso di fallimento del recupero dettagli documento', async () => {
      mockElectronAPI.document.details.mockResolvedValue({
        data: null,
        error: 'Document details loading failed',
      });
      await expect(service.getDocumentDetails({ documentUuid: 'doc-123' } as any)).rejects.toThrow(
        'Document details loading failed',
      );
    });
  });

  describe('searchDocuments', () => {
    it('dovrebbe restituire i risultati di ricerca in caso di successo', async () => {
      const mockSearchResponse = { results: [{ uuid: 'search-1', name: 'Trovato' }] };
      mockElectronAPI.document.searchDocuments.mockResolvedValue({
        data: mockSearchResponse,
        error: null,
      });
      const response = await service.searchDocuments({ key: 'title', value: 'Trovato' } as any);
      expect(response).toEqual(mockSearchResponse);
    });

    it('dovrebbe lanciare un errore in caso di fallimento della ricerca documenti', async () => {
      mockElectronAPI.document.searchDocuments.mockResolvedValue({
        data: null,
        error: 'Document search failed',
      });
      await expect(
        service.searchDocuments({ key: 'title', value: 'Trovato' } as any),
      ).rejects.toThrow('Document search failed');
    });
  });

  describe('fileInternalPreview', () => {
    it("dovrebbe restituire l'anteprima interna del file in caso di successo", async () => {
      const mockPreviewResponse = { fileUrl: 'file:///Users/test-file.pdf' };
      mockElectronAPI.document.fileInternalPreview.mockResolvedValue({
        data: mockPreviewResponse,
        error: null,
      });
      const response = await service.fileInternalPreview({ documentUuid: 'doc-123' } as any);
      expect(response).toEqual(mockPreviewResponse);
    });

    it("dovrebbe lanciare un errore in caso di fallimento dell'anteprima interna", async () => {
      mockElectronAPI.document.fileInternalPreview.mockResolvedValue({
        data: null,
        error: 'File preview failed',
      });
      await expect(service.fileInternalPreview({ documentUuid: 'doc-123' } as any)).rejects.toThrow(
        'File preview failed',
      );
    });
  });

  describe('fileExternalPreview', () => {
    it("dovrebbe aprire l'anteprima esterna in caso di successo", async () => {
      mockElectronAPI.document.fileExternalPreview.mockResolvedValue({ data: null, error: null });
      await expect(
        service.fileExternalPreview({ documentUuid: 'doc-123' } as any),
      ).resolves.toBeUndefined();
    });

    it("dovrebbe lanciare un errore in caso di fallimento dell'anteprima esterna", async () => {
      mockElectronAPI.document.fileExternalPreview.mockResolvedValue({
        data: null,
        error: 'External preview failed',
      });
      await expect(service.fileExternalPreview({ documentUuid: 'doc-123' } as any)).rejects.toThrow(
        'External preview failed',
      );
    });
  });

  describe('exportFile', () => {
    it('dovrebbe restituire la risposta di esportazione file in caso di successo', async () => {
      mockElectronAPI.document.exportFile.mockResolvedValue({
        data: { success: true },
        error: null,
      });
      const response = await service.exportFile({ documentUuid: 'doc-123' } as any);
      expect(response).toEqual({ success: true });
    });

    it("dovrebbe lanciare un errore in caso di fallimento dell'esportazione file", async () => {
      mockElectronAPI.document.exportFile.mockResolvedValue({ data: null, error: 'Export failed' });
      await expect(service.exportFile({ documentUuid: 'doc-123' } as any)).rejects.toThrow(
        'Export failed',
      );
    });
  });
  it('dovrebbe essere creato', () => {
    expect(service).toBeTruthy();
  });
});
