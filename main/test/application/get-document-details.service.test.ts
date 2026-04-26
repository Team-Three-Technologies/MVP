import { container } from 'tsyringe';
import { beforeEach, describe, expect, expectTypeOf, it, vi } from 'vitest';
import { TOKENS } from '../../src/infrastructure/di/tokens';
import { Document } from '../../src/domain/document.model';
import { File } from '../../src/domain/file.model';
import { Metadata } from '../../src/domain/metadata.model';
import { MetadataTypeEnum } from '../../src/domain/metadata-type.enum';
import { GetDocumentDetailsService } from '../../src/application/get-document-details.service';

describe('GetDocumentDetailsService', () => {
  beforeEach(() => {
    container.clearInstances();
    container.register(TOKENS.DocumentRepository, { useValue: {} });
  });

  it('Documento non presente', async () => {
    container.register(TOKENS.DocumentRepository, {
      useValue: {
        findByUuid: vi.fn().mockReturnValue(null)
      },
    });
    const getDocDetails = container.resolve(GetDocumentDetailsService);
    expect(getDocDetails.execute('')).rejects.toThrow(`Non esiste un documento con questo UUID: `);
  });

  it('Test con tutti i metadati vuoti', async () => {
    container.register(TOKENS.DocumentRepository, {
      useValue: {
        findByUuid: vi
          .fn()
          .mockReturnValue(
            new Document(
              'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
              'path',
              new File('', '', ''),
              [new File('', '', '')],
              [new Metadata('', '', MetadataTypeEnum.DATE)],
              '',
            ),
          ),
      },
    });
    const getDocDetails = container.resolve(GetDocumentDetailsService);
    const result = await getDocDetails.execute('');
    expect(result).toEqual({
      uuid: expect.any(String),
      name: expect.any(String),
      extension: expect.any(String),
      registrationType: expect.any(String),
      registrationDate: expect.any(String),
      registrationTime: expect.any(String),
      content: expect.any(String),
      version: expect.any(String),
      filesCount: expect.any(Number),
      totalSize: expect.any(String),
      attachmentsCount: expect.any(Number),
      attachments: expect.any(Array),
    });

    result.attachments.forEach((att) => {
      expect(att).toEqual({
        uuid: expect.any(String),
        path: expect.any(String),
        extension: expect.any(String),
      });
    });
  });
});
