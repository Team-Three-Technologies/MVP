import { inject, injectable } from 'tsyringe';
import { TOKENS } from '../di/tokens';
import { DipParser } from './dip.parser.interface';
import { DipIndexParser } from './dip-index.parser.interface';
import { AipInfoParser } from './aip-info.parser.interface';
import { MetadataParser } from './metadata.parser.interface';
import { FileSystemProvider } from '../fs/file-system.provider.interface';
import { DiPIndexXml } from './dip-index.xml';
import { AiPInfoXml } from './aip-info.xml';
import { DocumentParsingResult } from './document-parsing.result';
import * as path from 'node:path';
import { Buffer } from 'node:buffer';

@injectable()
export class DipParserImpl implements DipParser {
  constructor(
    @inject(TOKENS.DipIndexParser)
    private readonly dipIndexParser: DipIndexParser,
    @inject(TOKENS.AipInfoParser)
    private readonly aipInfoParser: AipInfoParser,
    @inject(TOKENS.MetadataParser)
    private readonly metadataParser: MetadataParser,
    @inject(TOKENS.FileSystemProvider)
    private readonly fileSystemProvider: FileSystemProvider,
  ) {}

  public async parseDipIndex(dipIndexBuffer: Buffer): Promise<DiPIndexXml> {
    return await this.dipIndexParser.parseDipIndex(dipIndexBuffer.toString('utf8'));
  }

  public async parseAipInfo(aipInfoBuffer: Buffer): Promise<AiPInfoXml> {
    return await this.aipInfoParser.parseAipInfo(aipInfoBuffer.toString('utf8'));
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

          const metadataBuffer = await this.fileSystemProvider.readFile(metadataFile);
          const metadata = await this.metadataParser.parseMetadata(metadataBuffer.toString('utf8'));

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
