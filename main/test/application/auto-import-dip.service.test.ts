import { container } from 'tsyringe';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { TOKENS } from '../../src/infrastructure/di/tokens';
import { AutoImportDipUseCase } from '../../src/application/auto-import-dip.use-case';
import { AutoImportDipService } from '../../src/application/auto-import-dip.service';

describe('AutoImportDipService', () => {
  beforeEach(() => {
    container.clearInstances();
    container.register(TOKENS.FileSystemProvider, { useValue: {} });
    container.register(TOKENS.DipParser, { useValue: {} });
    container.register(TOKENS.DipMapper, { useValue: {} });
    container.register(TOKENS.DocumentClassMapper, { useValue: {} });
    container.register(TOKENS.ConservationProcessMapper, { useValue: {} });
    container.register(TOKENS.DocumentMapper, { useValue: {} });
    container.register(TOKENS.DipRepository, { useValue: {} });
    container.register(TOKENS.DocumentClassRepository, { useValue: {} });
    container.register(TOKENS.ConservationProcessRepository, { useValue: {} });
    container.register(TOKENS.DocumentRepository, { useValue: {} });

    container.register(TOKENS.AutoImportDipUseCase, {
      useClass: AutoImportDipService,
    });
  });

  it('execute() lancia errore se non trova il DiPIndex dentro la cartella', async () => {
    const fileSystemProvider = {
      getStartDir: vi.fn().mockReturnValue('/path/to/test'),
      findFile: vi.fn().mockReturnValue(null),
    };

    container.register(TOKENS.FileSystemProvider, {
      useValue: fileSystemProvider,
    });

    const service = container.resolve<AutoImportDipUseCase>(TOKENS.AutoImportDipUseCase);

    await expect(service.execute()).rejects.toThrow('DiPIndex mancante');
    expect(fileSystemProvider.getStartDir).toHaveBeenCalled();
    expect(fileSystemProvider.getStartDir).toHaveReturnedWith('/path/to/test');
    expect(fileSystemProvider.findFile).toHaveBeenCalled();
    expect(fileSystemProvider.findFile).toHaveReturnedWith(null);
  });

  // it('execute()', async () => {
  //   const fileSystemProvider = {
  //     getStartDir: vi.fn().mockReturnValue('/path/to/test'),
  //     findFile: vi
  //       .fn()
  //       .mockReturnValue(
  //         '/path/to/test/DiPIndex.YYYYMMDD.xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx.xml',
  //       ),
  //     readFile: vi.fn().mockReturnValue(Buffer.from('xml')),
  //   };

  //   container.register(TOKENS.FileSystemProvider, {
  //     useValue: fileSystemProvider,
  //   });

  //   const service = container.resolve<AutoImportDipUseCase>(TOKENS.AutoImportDipUseCase);

  //   expect(fileSystemProvider.getStartDir).toHaveBeenCalled();
  //   expect(fileSystemProvider.getStartDir).toHaveReturnedWith('/path/to/test');
  //   expect(fileSystemProvider.findFile).toHaveBeenCalled();
  //   expect(fileSystemProvider.findFile).toHaveReturnedWith(
  //     '/path/to/test/DiPIndex.YYYYMMDD.xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx.xml',
  //   );
  // });
});
