import { inject, injectable } from 'tsyringe';
import { TOKENS } from '../di/tokens';
import { DipParser } from './dip.parser.interface';
import { DipIndexParser } from './dip-index.parser.interface';
import { MetadataParser } from './metadata.parser.interface';
import { DipParsingResult } from './dip-parsing-result';
import { DocumentMetadataXml } from './document-metadata.xml';
import path from 'path';

@injectable()
export class DipParserImpl implements DipParser {
  constructor(
    @inject(TOKENS.DipIndexParser)
    private readonly dipIndexParser: DipIndexParser,
    @inject(TOKENS.MetadataParser)
    private readonly metadataParser: MetadataParser,
  ) { }

  public async parse(dipIndexPath: string): Promise<DipParsingResult> {
    const dir = path.dirname(dipIndexPath);
    const dipIndex = await this.dipIndexParser.parseDipIndex(dipIndexPath);
    
    const documentsMetadata: DocumentMetadataXml[] = [];

    for (const dc of dipIndex.DiPIndex.PackageContent.DiPDocuments.DocumentClass) {
      for (const aip of dc.AiP) {
        for (const doc of aip.Document) {
          const metadataFile = path.join(dir, aip.AiPRoot, doc.DocumentPath, doc.Files.Metadata['#text']);
          const metadata = await this.metadataParser.parseMetadata(metadataFile);
          documentsMetadata.push(metadata);
        }
      }
    }

    return { dipIndex, documentsMetadata };
  }
}