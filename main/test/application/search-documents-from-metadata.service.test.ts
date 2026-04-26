import { container } from 'tsyringe';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { TOKENS } from '../../src/infrastructure/di/tokens';
import { SearchDocumentsFromMetadataUseCase } from '../../src/application/search-documents-from-metadata.use-case';
import { SearchDocumentsFromMetadataService } from '../../src/application/search-documents-from-metadata.service';
import { SQLiteDocumentRepository } from '../../src/repositories/document.repository.sqlite';
import { Document } from '../../src/domain/document.model';
import { File } from '../../src/domain/file.model';
import { Metadata } from '../../src/domain/metadata.model';
import { MetadataTypeEnum } from '../../src/domain/metadata-type.enum';
import { MetadataFilter } from '../../src/domain/metadata-filter.model';
import { SearchResponseDTO } from '../../../shared/response/search.response.dto';
import {
  DocumentEssentialsAttachmentDTO,
  DocumentEssentialsDTO,
} from '../../../shared/response/dip-content.response.dto';

describe('SearchDocumentsFromMetadataService', () => {
  beforeEach(() => {
    container.clearInstances();
    container.register(TOKENS.DocumentRepository, { useValue: {} });
  });

  it('execute()', async () => {
    container.register(TOKENS.DocumentRepository, {
      useValue: {
        findAllByMetadata: vi
          .fn()
          .mockReturnValueOnce([
            new Document(
              'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
              'path',
              new File('', '', ''),
              [new File('', '', ''), new File('', '', '')],
              [new Metadata('', '', MetadataTypeEnum.DATE)],
              '',
            ),
          ])
          .mockReturnValueOnce([]),
      },
    });
    const searchService = container.resolve(SearchDocumentsFromMetadataService);
    let result = await searchService.execute([{ type: '', value: '' }]);

    expect(Array.isArray(result.results)).toBe(true);
    result.results.forEach((doc) => {
      expect(doc).toEqual({
        documentUuid: expect.any(String),
        documentName: expect.any(String),
        documentAttachments: expect.arrayContaining([
          expect.objectContaining({
            uuid: expect.any(String),
            name: expect.any(String),
          }),
        ]),
      });
    });

    result = await searchService.execute([{ type: '', value: '' }]);
    expect(Array.isArray(result.results)).toBe(true);
    expect(result.results.length).toBe(0);
  });
});
