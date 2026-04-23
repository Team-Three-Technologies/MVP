import { inject, injectable } from 'tsyringe';
import { TOKENS } from '../infrastructure/di/tokens';
import { AutoImportDipUseCase } from './auto-import-dip.use-case';
import { AutoImportDipResponseDTO } from '../../../shared/response/auto-import-dip.response.dto';
import { FileSystemProvider } from '../infrastructure/fs/file-system.provider.interface';
import { FILE_NAME_PATTERNS } from '../domain/file-name-patterns';
import { DipParser } from '../infrastructure/parsing/dip.parser.interface';
import { DipRepository } from '../repositories/dip.repository.interface';
import { DocumentClassRepository } from '../repositories/document-class.repository.interface';
import { ConservationProcessRepository } from '../repositories/conservation-process.repository.interface';
import { DocumentRepository } from '../repositories/document.repository.interface';
import { DipMapper } from '../mappers/dip.mapper';
import { DocumentClassMapper } from '../mappers/document-class.mapper';
import { ConservationProcessMapper } from '../mappers/conservation-process.mapper';
import { DocumentMapper } from '../mappers/document.mapper';
import * as path from 'node:path';

@injectable()
export class AutoImportDipService implements AutoImportDipUseCase {
  constructor(
    @inject(TOKENS.FileSystemProvider)
    private readonly fileSystemProvider: FileSystemProvider,
    @inject(TOKENS.DipParser)
    private readonly dipParser: DipParser,
    @inject(TOKENS.DipMapper)
    private readonly dipMapper: DipMapper,
    @inject(TOKENS.DocumentClassMapper)
    private readonly documentClassMapper: DocumentClassMapper,
    @inject(TOKENS.ConservationProcessMapper)
    private readonly conservationProcessMapper: ConservationProcessMapper,
    @inject(TOKENS.DocumentMapper)
    private readonly documentMapper: DocumentMapper,
    @inject(TOKENS.DipRepository)
    private readonly dipRepository: DipRepository,
    @inject(TOKENS.DocumentClassRepository)
    private readonly documentClassRepository: DocumentClassRepository,
    @inject(TOKENS.ConservationProcessRepository)
    private readonly conservationProcessRepository: ConservationProcessRepository,
    @inject(TOKENS.DocumentRepository)
    private readonly documentRepository: DocumentRepository,
  ) {}

  public async execute(): Promise<AutoImportDipResponseDTO> {
    // 1GB: 'D:\\filip\\Downloads\\dip.2026115.cbe221f9-becc-41d4-b5fb-76e701fa5eac'; // TODO: da fixare i soggetti
    // 4GB: 'D:\\filip\\Downloads\\dip.2026115.d7a27175-16b3-4a7d-877d-26f2b1baadda';
    // 3MB: 'D:\\filip\\Downloads\\dip.20251111.0413d8ee-8e82-4331-864e-7f8098bcc419'; // TODO: da fixare i soggetti
    // 176kB: 'D:\\filip\\Downloads\\dip.20251111.ec276d29-f80c-4693-b3c9-1cb650e23114';
    // 1MB: 'D:\\filip\\Downloads\\dip.20251112.cd6f28d2-d4aa-4f5e-89fe-cfe92f1df403';
    const dir = 'D:\\filip\\Downloads\\dip.20251112.cd6f28d2-d4aa-4f5e-89fe-cfe92f1df403'; // this.fileSystemProvider.getStartDir();
    const dipIndexPath = await this.fileSystemProvider.findFile(dir, FILE_NAME_PATTERNS.DIP_INDEX);
    //TODO: per il db da capire se svuotarlo alla fine, molto sensato imo
    // se non trova il dip index
    if (!dipIndexPath) {
      throw new Error('DiPIndex mancante');
    }

    const dipIndexBuffer = await this.fileSystemProvider.readFile(dipIndexPath);
    const dipIndex = await this.dipParser.parseDipIndex(dipIndexBuffer);

    const dip = this.dipMapper.toDomain(dipIndex.DiPIndex.PackageInfo);

    if (!(await this.dipRepository.findByUuid(dip.getProcessUuid()))) {
      await this.dipRepository.save(dip);
    } else {
      throw new Error('DiP già importato in precedenza');
    }

    for (const dc of dipIndex.DiPIndex.PackageContent.DiPDocuments.DocumentClass) {
      const documentClass = this.documentClassMapper.toDomain(dc, dip.getProcessUuid());
      await this.documentClassRepository.save(documentClass);

      for (const cp of dc.AiP) {
        const aipInfoPath = await this.fileSystemProvider.findFile(
          path.join(dir, cp.AiPRoot),
          FILE_NAME_PATTERNS.AIP_INFO,
        );

        if (!aipInfoPath) {
          throw new Error('AipInfo mancante');
        }

        const aipInfoBuffer = await this.fileSystemProvider.readFile(aipInfoPath);
        const aipInfo = await this.dipParser.parseAipInfo(aipInfoBuffer);

        const conservationProcess = this.conservationProcessMapper.toDomain(aipInfo);
        await this.conservationProcessRepository.save(conservationProcess);
      }
    }

    for await (const doc of this.dipParser.parseDocumentsStream(dipIndex, dir)) {
      const document = this.documentMapper.toDomain(doc);
      await this.documentRepository.save(document);
    }

    return { dipUuid: dip.getProcessUuid() };
  }
}
