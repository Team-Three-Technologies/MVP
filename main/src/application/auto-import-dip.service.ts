import { inject, injectable } from 'tsyringe';
import { TOKENS } from '../infrastructure/di/tokens';
import { AutoImportDipUseCase } from './auto-import-dip.use-case';
import { AutoImportDipResponseDTO } from '../../../shared/response/auto-import-dip.response.dto';
import { FileFinder } from '../infrastructure/fs/file.finder.interface';
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
    @inject(TOKENS.FileFinder)
    private readonly fileFinder: FileFinder,
    @inject(TOKENS.DipParser)
    private readonly dipParser: DipParser,
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
    // leggero: 'D:\\filip\\Downloads\\dip.20251112.cd6f28d2-d4aa-4f5e-89fe-cfe92f1df403';
    // 4gb: 'D:\\filip\\Downloads\\dip.2026115.d7a27175-16b3-4a7d-877d-26f2b1baadda';
    const dir = 'D:\\filip\\Downloads\\dip.20251112.cd6f28d2-d4aa-4f5e-89fe-cfe92f1df403'; // this.fileFinder.getStartDir();
    const dipIndexPath = await this.fileFinder.findDipIndex(dir);

    // se non trova il dip index
    if (!dipIndexPath) {
      throw new Error('DiPIndex mancante');
    }

    const dipIndex = await this.dipParser.parseDipIndex(dipIndexPath);

    const dipMapper = new DipMapper();
    const dip = dipMapper.toDomain(dipIndex.DiPIndex.PackageInfo);

    if (!(await this.dipRepository.findByUuid(dip.getProcessUuid()))) {
      this.dipRepository.save(dip);
    } else {
      throw new Error('DiP già importato in precedenza');
    }

    const documentClassMapper = new DocumentClassMapper();
    const conservationProcessMapper = new ConservationProcessMapper();
    for (const dc of dipIndex.DiPIndex.PackageContent.DiPDocuments.DocumentClass) {
      const documentClass = documentClassMapper.toDomain(dc, dip.getProcessUuid());
      this.documentClassRepository.save(documentClass);

      for (const cp of dc.AiP) {
        const aipInfoPath = await this.fileFinder.findAipInfo(path.join(dir, cp.AiPRoot));

        if (!aipInfoPath) {
          throw new Error('AipInfo mancante');
        }

        const aipInfo = await this.dipParser.parseAipInfo(aipInfoPath);
        const conservationProcess = conservationProcessMapper.toDomain(aipInfo);
        this.conservationProcessRepository.save(conservationProcess);
      }
    }

    const documentMapper = new DocumentMapper();
    for await (const doc of this.dipParser.parseDocumentsStream(dipIndex, dir)) {
      const document = documentMapper.toDomain(doc);
      this.documentRepository.save(document);
    }

    return { dipUuid: dip.getProcessUuid() };
  }
}
