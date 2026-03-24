import { inject, injectable } from 'tsyringe';
import { TOKENS } from '../infrastructure/tokens';
import { AutoImportDipUseCase } from './auto-import-dip.use-case';
import { IFileService } from '../services/file.service.interface';
import { IDipParserService } from '../services/dip-parser.service.interface';
import type { AppConfig } from '../infrastructure/app.config';

@injectable()
export class AutoImportDipService implements AutoImportDipUseCase {
  constructor(
    @inject(TOKENS.IFileService)
    private readonly fileService: IFileService,
    @inject(TOKENS.IDipParserService)
    private readonly dipParserService: IDipParserService,
    @inject(TOKENS.AppConfig)
    private readonly config: AppConfig
  ) { } 

  public async execute(): Promise<void> {
    const dipIndexPath = await this.fileService.findDipIndex(this.config.appDir);
    if (!dipIndexPath) {
      throw new Error("DiPIndex mancante");
    }

    const dipIndex = await this.dipParserService.parseDipIndex(dipIndexPath);
    console.log(dipIndex);
    // TODO: parsing del resto dei file (metadata, report, sip, aip e quello che serve)\
    // TODO: usare repository per salvare le informazioni
  }
}