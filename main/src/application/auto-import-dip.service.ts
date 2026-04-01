import { inject, injectable } from 'tsyringe';
import { TOKENS } from '../infrastructure/tokens';
import { AutoImportDipUseCase } from './auto-import-dip.use-case';
import { FileService } from '../services/file.service.interface';
import { DipParser } from '../services/dip.parser.interface';
import { DipRepository } from '../repositories/dip.repository.interface';
import type { AppConfig } from '../infrastructure/app.config';
import { Dip } from '../domain/dip.model';
import { UUID } from '../domain/value-objects/uuid.value-object';

@injectable()
export class AutoImportDipService implements AutoImportDipUseCase {
  constructor(
    @inject(TOKENS.FileService)
    private readonly fileService: FileService,
    @inject(TOKENS.DipParser)
    private readonly dipParser: DipParser,
    @inject(TOKENS.DipRepository)
    private readonly dipRepository: DipRepository,
    @inject(TOKENS.AppConfig)
    private readonly config: AppConfig
  ) { } 

  public async execute(): Promise<void> {
    const dipIndexPath = await this.fileService.findDipIndex('D:\\filip\\Downloads\\dip.20251112.cd6f28d2-d4aa-4f5e-89fe-cfe92f1df403'/*this.config.appDir*/);
    
    if (!dipIndexPath) {
      throw new Error('DiPIndex mancante');
    }
    
    const dipIndex = (await this.dipParser.parse(dipIndexPath)).DiPIndex;

    // TODO: da sistemare, se teniamo i tipi XML probabilmente è meglio fare un mapper da quelli alle entità di dominio
    const dip = new Dip(UUID.from(dipIndex.PackageInfo.ProcessUUID), new Date(dipIndex.PackageInfo.CreationDate), Number(dipIndex.PackageInfo.DocumentsCount), Number(dipIndex.PackageInfo.AiPCount));
    if (!this.dipRepository.findByUuid(dip.getProcessUuid())) {
      this.dipRepository.save(dip);
    } else {
      console.log('Alredy imported');
      // TODO: decidere come gestire il caso in cui il DiP è già stato importato
    }
    // TODO: parsing del resto dei file (metadata, report, sip, aip e quello che serve)
    // Path = AiPRoot + DocumentPath + (metadata | primary | attachments)
    // TODO: usare repository per salvare le informazioni
    
  }
}