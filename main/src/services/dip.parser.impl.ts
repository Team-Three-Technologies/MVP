import { inject, injectable } from 'tsyringe';
import { TOKENS } from '../infrastructure/tokens';
import { DipParser } from './dip.parser.interface';
import { DipIndexParser } from './dip-index.parser.interface';
import { MetadataParser } from './metadata.parser.interface';
import { DiPIndexXml } from './dip-index.xml';
import path from 'path';

@injectable()
export class DipParserImpl implements DipParser {
  constructor(
    @inject(TOKENS.DipIndexParser)
    private readonly dipIndexParser: DipIndexParser,
    @inject(TOKENS.MetadataParser)
    private readonly metadataParser: MetadataParser,
  ) { }

  public async parse(dipIndexPath: string): Promise<DiPIndexXml> {
    const dipIndex = await this.dipIndexParser.parseDipIndex(dipIndexPath);
    console.log(dipIndex);

    dipIndex.DiPIndex.PackageContent.DiPDocuments.DocumentClass.forEach(async dc => {
      dc.AiP.forEach(async aip => {
        aip.Document.forEach(async doc => {
          const metadataFile = path.join(path.dirname(dipIndexPath), aip.AiPRoot, doc.DocumentPath, doc.Files.Metadata['#text']);
          const metadata = await this.metadataParser.parseMetadata(metadataFile);
          console.log(metadata);
        });
      });
    });

    return dipIndex;
  }
}