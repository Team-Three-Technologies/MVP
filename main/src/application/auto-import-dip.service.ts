import { inject, injectable } from 'tsyringe';
import { TOKENS } from '../infrastructure/di/tokens';
import { AutoImportDipUseCase } from './auto-import-dip.use-case';
import { FileService } from '../infrastructure/fs/file.service.interface';
import { DipParser } from '../infrastructure/parsing/dip.parser.interface';
import { DipRepository } from '../repositories/dip.repository.interface';
import type { AppConfig } from '../infrastructure/app.config';
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
    
    const parsed = await this.dipParser.parse(dipIndexPath);
    console.log(parsed);
    
    // TODO: mappare da risultato parsing -> dominio
    // TODO: usare repository per controllare se il DiP è stato importato e eventualmente salvare le informazioni    
  }
}