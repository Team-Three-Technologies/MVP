import { inject, injectable } from 'tsyringe';
import { ImportDiPUseCase } from './import-dip.use-case';
import { TOKENS } from '../infrastructure/tokens';
import { IZipService } from '../services/zip.service.interface';
import { IXmlService } from '../services/xml.service.interface';

@injectable()
export class ImportDiPService implements ImportDiPUseCase {
  constructor(
    @inject(TOKENS.ZipService)
    private readonly zipService: IZipService,
    @inject(TOKENS.XmlService)
    private readonly xmlService: IXmlService,
  ) { } 

  async execute(dipPath: string): Promise<void> {

  }
}