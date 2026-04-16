import { inject, injectable } from 'tsyringe';
import { TOKENS } from '../di/tokens';
import { DipParser } from './dip.parser.interface';
import { DipIndexParser } from './dip-index.parser.interface';
import { AipInfoParser } from './aip-info.parser.interface';
import { MetadataParser } from './metadata.parser.interface';
import { DiPIndexXml } from './dip-index.xml';
import { AiPInfoXml } from './aip-info.xml';
import { DocumentParsingResult } from './document-parsing.result';
import * as path from 'node:path';

@injectable()
export class DipParserImpl implements DipParser {
  constructor(
    @inject(TOKENS.DipIndexParser)
    private readonly dipIndexParser: DipIndexParser,
    @inject(TOKENS.AipInfoParser)
    private readonly aipInfoParser: AipInfoParser,
    @inject(TOKENS.MetadataParser)
    private readonly metadataParser: MetadataParser,
  ) {}

  public async parseDipIndex(dipIndexPath: string): Promise<DiPIndexXml> {
    try {
      return await this.dipIndexParser.parseDipIndex(dipIndexPath);
    } catch (e) {
      throw e;
    }
  }

  public async parseAipInfo(aipInfoPath: string): Promise<AiPInfoXml> {
    try {
      return await this.aipInfoParser.parseAipInfo(aipInfoPath);
    } catch (e) {
      throw e;
    }
  }

  public async *parseDocumentsStream(
    dipIndex: DiPIndexXml,
    dir: string,
  ): AsyncIterable<DocumentParsingResult> {
    for (const dc of dipIndex.DiPIndex.PackageContent.DiPDocuments.DocumentClass) {
      for (const aip of dc.AiP) {
        for (const doc of aip.Document) {
          const documentPath = path.join(dir, aip.AiPRoot, doc.DocumentPath);

          const metadataFile = path.join(documentPath, doc.Files.Metadata['#text']);
          const metadata = await this.metadataParser.parseMetadata(metadataFile);

          yield {
            uuid: doc['@_uuid'],
            conservationProcessUuid: aip['@_uuid'],
            documentPath: documentPath,
            primaryFilePath: doc.Files.Primary['#text'],
            attachmentsFilesPath: (doc.Files.Attachments ?? []).map((a) => {
              return [a['@_uuid'], a['#text']];
            }),
            documentMetadata: metadata,
          };
        }
      }
    }
  }
}
