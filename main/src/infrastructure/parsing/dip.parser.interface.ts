import { DiPIndexXml } from './dip-index.xml';
import { AiPInfoXml } from './aip-info.xml';
import { DocumentParsingResult } from './document-parsing.result';

export interface DipParser {
  parseDipIndex(dipIndexPath: string): Promise<DiPIndexXml>;
  parseAipInfo(aipInfoPath: string): Promise<AiPInfoXml>;
  parseDocumentsStream(dipIndex: DiPIndexXml, dir: string): AsyncIterable<DocumentParsingResult>;
}