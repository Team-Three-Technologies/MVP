import { container } from 'tsyringe';
import { beforeEach, describe, expect, expectTypeOf, it, vi } from 'vitest';
import { TOKENS } from '../../src/infrastructure/di/tokens';
import { Document } from '../../src/domain/document.model';
import { File } from '../../src/domain/file.model';
import { Metadata } from '../../src/domain/metadata.model';
import { MetadataTypeEnum } from '../../src/domain/metadata-type.enum';
import { FileInternalPreviewService } from '../../src/application/file-internal-preview.service';

describe('FileInternalPreviewService', () => {
  beforeEach(() => {
    container.clearInstances();
    container.register(TOKENS.DocumentRepository, { useValue: {} });
  });

  it('Test con sia documento che allegato presente', () => {
    container.register(TOKENS.DocumentRepository, {
      useValue: {
        findByUuid: vi
          .fn()
          .mockReturnValue(
            new Document(
              'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
              'path',
              new File('', '', ''),
              [new File('uuid', '', '')],
              [new Metadata('', '', MetadataTypeEnum.DATE)],
              '',
            ),
          ),
      },
    });

    const preview = container.resolve(FileInternalPreviewService);
    expectTypeOf(preview.execute('uuid', 'uuid')).toBeString;
  });
  it('Test con documento non presente', () => {
    container.register(TOKENS.DocumentRepository, {
      useValue: {
        findByUuid: vi.fn(),
      },
    });
    const preview = container.resolve(FileInternalPreviewService);
    expect(preview.execute('uuid', 'uuid')).rejects.toThrow(
      `Non esiste un documento con questo UUID: uuid`,
    );
  });

  it('Test con allegato non trovato', () => {
    container.register(TOKENS.DocumentRepository, {
      useValue: {
        findByUuid: vi
          .fn()
          .mockReturnValue(
            new Document(
              'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
              'path',
              new File('', '', ''),
              [new File('uuid-sbagliato', '', '')],
              [new Metadata('', '', MetadataTypeEnum.DATE)],
              '',
            ),
          ),
      },
    });

    const preview = container.resolve(FileInternalPreviewService);
    expect(preview.execute('uuid', 'uuid')).rejects.toThrow(
      `Non esiste un file con UUID: uuid associato al documento con UUID: uuid`,
    );
  });
  it('Test con allegato mancante', () => {
    container.register(TOKENS.DocumentRepository, {
      useValue: {
        findByUuid: vi
          .fn()
          .mockReturnValue(
            new Document(
              'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
              'path',
              new File('', '', ''),
              [new File('uuid', '', '')],
              [new Metadata('', '', MetadataTypeEnum.DATE)],
              '',
            ),
          ),
      },
    });
    const preview = container.resolve(FileInternalPreviewService);
    expectTypeOf(preview.execute('uuid', '')).toBeString;
  });
});
