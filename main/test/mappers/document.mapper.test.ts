import 'reflect-metadata';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { container } from 'tsyringe';
import { TOKENS } from '../../src/infrastructure/di/tokens';
import { DocumentMapper } from '../../src/mappers/document.mapper';
import { Document } from '../../src/domain/document.model';
import { File } from '../../src/domain/file.model';
import { Metadata } from '../../src/domain/metadata.model';
import { DocumentParsingResult } from '../../src/infrastructure/parsing/document-parsing.result';

describe('DocumentMapper', () => {
  let mapper: DocumentMapper;
  let flattenMock: ReturnType<typeof vi.fn>;
  const fakeMetadata = [{ name: 'fake' } as unknown as Metadata];

  beforeEach(() => {
    container.clearInstances();
    flattenMock = vi.fn().mockReturnValue(fakeMetadata);
    container.register(TOKENS.MetadataFlattener, {
      useValue: { flatten: flattenMock },
    });
    mapper = container.resolve(DocumentMapper);
  });

  const buildParsed = (overrides: Partial<DocumentParsingResult> = {}): DocumentParsingResult => ({
    uuid: 'doc-main-uuid',
    conservationProcessUuid: 'cp-uuid',
    documentPath: '/docs/doc1',
    primaryFilePath: '/docs/doc1/main.pdf',
    attachmentsFilesPath: [
      ['att-1', '/docs/doc1/att1.pdf'],
      ['att-2', '/docs/doc1/att2.pdf'],
    ],
    documentMetadata: {
      Document: {
        DocumentoInformatico: {
          IdDoc: { Identificativo: 'doc-id-from-meta' },
        },
        ArchimemoData: {
          DocumentInformation: { PreservationProcessUUID: 'preservation-uuid-1' },
          FileInformation: [
            {
              '@_isPrimary': true,
              FileUUID: 'doc-main-uuid',
              FileSize: { '#text': '100', '@_unit': 'KB' },
            },
            {
              FileUUID: 'att-1',
              FileSize: { '#text': '50', '@_unit': 'KB' },
            },
            {
              FileUUID: 'att-2',
              FileSize: { '#text': '25', '@_unit': 'MB' },
            },
          ],
        },
      },
    },
    ...overrides,
  });

  it('dovrebbe mappare un DocumentoInformatico in un Document', () => {
    const result = mapper.toDomain(buildParsed());

    expect(result).toBeInstanceOf(Document);
    expect(result.getUuid()).toBe('doc-id-from-meta');
    expect(result.getPath()).toBe('/docs/doc1');
    expect(result.getConservationProcessUuid()).toBe('preservation-uuid-1');
    expect(result.getMetadata()).toBe(fakeMetadata);
  });

  it('dovrebbe costruire il File principale con uuid, path e size del primary', () => {
    const result = mapper.toDomain(buildParsed());
    const main = result.getMain();

    expect(main).toBeInstanceOf(File);
    expect(main.getUuid()).toBe('doc-main-uuid');
    expect(main.getPath()).toBe('/docs/doc1/main.pdf');
    expect(main.getSize()).toBe('100 KB');
  });

  it('dovrebbe costruire gli allegati con le size corrispondenti da FileInformation', () => {
    const result = mapper.toDomain(buildParsed());
    const attachments = result.getAttachments();

    expect(attachments).toHaveLength(2);
    expect(attachments[0].getUuid()).toBe('att-1');
    expect(attachments[0].getPath()).toBe('/docs/doc1/att1.pdf');
    expect(attachments[0].getSize()).toBe('50 KB');
    expect(attachments[1].getUuid()).toBe('att-2');
    expect(attachments[1].getSize()).toBe('25 MB');
  });

  it('dovrebbe usare DocumentoAmministrativoInformatico come fallback quando DocumentoInformatico è mancante', () => {
    const parsed = buildParsed();
    delete (parsed.documentMetadata.Document as any).DocumentoInformatico;
    parsed.documentMetadata.Document.DocumentoAmministrativoInformatico = {
      IdDoc: { Identificativo: 'admin-doc-id' },
    };

    const result = mapper.toDomain(parsed);
    expect(result.getUuid()).toBe('admin-doc-id');
  });

  it('dovrebbe usare AggregazioneDocumentaliInformatiche come fallback quando gli altri sono mancanti', () => {
    const parsed = buildParsed();
    delete (parsed.documentMetadata.Document as any).DocumentoInformatico;
    parsed.documentMetadata.Document.AggregazioneDocumentaliInformatiche = {
      IdDoc: { Identificativo: 'aggregation-doc-id' },
    };

    const result = mapper.toDomain(parsed);
    expect(result.getUuid()).toBe('aggregation-doc-id');
  });

  it('dovrebbe produrre una stringa vuota per la size quando FileSize del primary è mancante', () => {
    const parsed = buildParsed();
    parsed.documentMetadata.Document.ArchimemoData.FileInformation = [
      { '@_isPrimary': true, FileUUID: 'doc-main-uuid' },
    ];
    const result = mapper.toDomain(parsed);
    expect(result.getMain().getSize()).toBe('');
  });

  it('dovrebbe produrre size vuote per gli allegati senza FileInformation corrispondente', () => {
    const parsed = buildParsed();
    parsed.documentMetadata.Document.ArchimemoData.FileInformation = [
      { '@_isPrimary': true, FileUUID: 'doc-main-uuid', FileSize: { '#text': '1', '@_unit': 'KB' } },
    ];
    const result = mapper.toDomain(parsed);
    const attachments = result.getAttachments();
    expect(attachments[0].getSize()).toBe('');
    expect(attachments[1].getSize()).toBe('');
  });

  it('dovrebbe gestire un array FileInformation mancante senza lanciare eccezioni', () => {
    const parsed = buildParsed();
    parsed.documentMetadata.Document.ArchimemoData.FileInformation = undefined;

    const result = mapper.toDomain(parsed);
    expect(result.getAttachments()).toHaveLength(2);
    expect(result.getAttachments()[0].getSize()).toBe('');
    expect(result.getMain().getSize()).toBe('');
  });

  it('dovrebbe gestire una lista di allegati vuota', () => {
    const parsed = buildParsed({ attachmentsFilesPath: [] });
    const result = mapper.toDomain(parsed);
    expect(result.getAttachments()).toEqual([]);
  });

  it('dovrebbe invocare MetadataFlattener.flatten con il nodo Document', () => {
    const parsed = buildParsed();
    mapper.toDomain(parsed);
    expect(flattenMock).toHaveBeenCalledTimes(1);
    expect(flattenMock).toHaveBeenCalledWith(parsed.documentMetadata.Document);
  });
});
