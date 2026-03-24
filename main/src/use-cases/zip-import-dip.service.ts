import { inject, injectable } from 'tsyringe';
import { ZipImportDipUseCase } from './zip-import-dip.use-case';
import { TOKENS } from '../infrastructure/tokens';
import { IDipRepository } from '../repositories/dip.repository.interface';
import { IHashService } from '../services/hash.service.interface';
import { IZipService } from '../services/zip.service.interface';
import * as path from 'path';
import type { AppConfig } from '../infrastructure/app.config';

@injectable()
export class ZipImportDipService implements ZipImportDipUseCase {
  constructor(
    @inject(TOKENS.IHashService)
    private readonly hashService: IHashService,
    @inject(TOKENS.IZipService)
    private readonly zipService: IZipService,
    @inject(TOKENS.IDipRepository)
    private readonly dipRepository: IDipRepository,
    @inject(TOKENS.AppConfig)
    private readonly config: AppConfig
  ) { } 

  // Verrà implementato se c'è tempo, permette di importare un Dip in formato .zip, comprende unzip
  public async execute(dipPath: string): Promise<void> {
    const hash = await this.hashService.compute(dipPath);

    const destPath = path.join(this.config.documentsPath, hash);
    await this.zipService.extract(dipPath, destPath);
  }
}