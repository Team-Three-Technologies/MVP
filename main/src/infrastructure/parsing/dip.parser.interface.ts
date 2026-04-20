import { Buffer } from 'node:buffer';
import { DiPIndexXml } from './dip-index.xml';
import { AiPInfoXml } from './aip-info.xml';
import { DocumentParsingResult } from './document-parsing.result';

export interface DipParser {
  parseDipIndex(dipIndexBuffer: Buffer): Promise<DiPIndexXml>;
  parseAipInfo(aipInfoBuffer: Buffer): Promise<AiPInfoXml>;
  parseDocumentsStream(dipIndex: DiPIndexXml, dir: string): AsyncIterable<DocumentParsingResult>;
}
