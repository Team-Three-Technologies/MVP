import { container } from 'tsyringe';
import { beforeEach, describe, expect, expectTypeOf, it, vi } from 'vitest';
import { TOKENS } from '../../src/infrastructure/di/tokens';
import { Document } from '../../src/domain/document.model';
import { File } from '../../src/domain/file.model';
import { Metadata } from '../../src/domain/metadata.model';
import { MetadataTypeEnum } from '../../src/domain/metadata-type.enum';
import { FileExternalPreviewService } from '../../src/application/file-external-preview.service';
import { ShellProvider } from '../../src/infrastructure/shell/shell.provider.interface';

describe('FileExternalPreviewService', () => {
  beforeEach(() => {
    container.clearInstances();
    container.register(TOKENS.DocumentRepository, { useValue: {} });
    container.register(TOKENS.ShellProvider, { useValue: {} });
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
    container.register(TOKENS.ShellProvider, {
      useValue: {
        openFile: vi.fn().mockReturnValue('path'),
      },
    });

    const preview = container.resolve(FileExternalPreviewService);
    expectTypeOf(preview.execute('uuid', 'uuid')).toBeString;
  });
  it('Test con documento non presente', () => {
    container.register(TOKENS.DocumentRepository, {
      useValue: {
        findByUuid: vi.fn(),
      },
    });
    container.register(TOKENS.ShellProvider, {
      useValue: {
        openFile: vi.fn().mockReturnValue('path'),
      },
    });
    const preview = container.resolve(FileExternalPreviewService);
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
    container.register(TOKENS.ShellProvider, {
      useValue: {
        openFile: vi.fn().mockReturnValue('path'),
      },
    });

    const preview = container.resolve(FileExternalPreviewService);
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
    container.register(TOKENS.ShellProvider, {
      useValue: {
        openFile: vi.fn().mockReturnValue('path'),
      },
    });
    const preview = container.resolve(FileExternalPreviewService);
    expectTypeOf(preview.execute('uuid', '')).toBeString;
  });
  it('Test con shell che fallisce', () => {
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
    container.register(TOKENS.ShellProvider, {
      useValue: {
        openFile: vi.fn().mockThrow('errore'),
      },
    });
    const preview = container.resolve(FileExternalPreviewService);
    expect(preview.execute('uuid', '')).rejects.toThrow('errore');
  });
});
