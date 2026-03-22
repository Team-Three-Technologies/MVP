import { inject, injectable } from 'tsyringe';
import { ImportDipUseCase } from './import-dip.use-case';
import { TOKENS } from '../infrastructure/tokens';
import { AppConfig } from '../infrastructure/app.config';
import { IDipRepository } from '../repositories/dip.repository.interface';
import { IHashService } from '../services/hash.service.interface';
import { IZipService } from '../services/zip.service.interface';
import { IXmlService } from '../services/xml.service.interface';
import * as path from 'path';

@injectable()
export class ImportDipService implements ImportDipUseCase {
  constructor(
    @inject(TOKENS.IHashService)
    private readonly hashService: IHashService,
    @inject(TOKENS.IZipService)
    private readonly zipService: IZipService,
    @inject(TOKENS.IXmlService)
    private readonly xmlService: IXmlService,
    @inject(TOKENS.IDipRepository)
    private readonly dipRepository: IDipRepository,
    @inject(TOKENS.AppConfig)
    private readonly config: AppConfig
  ) { } 

  async execute(dipPath: string): Promise<void> {
    const hash = await this.hashService.compute(dipPath);

    // TODO: controllare se è già stato il Dip è importato
    const destPath = path.join(this.config.extractPath, hash);
    
    await this.zipService.extract(dipPath, destPath);

    // TODO: parsing
  }
}