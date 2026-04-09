import { DiPIndexXml } from './dip-index.xml';
import { DocumentParsingResult } from './dip-parsing-result';

export interface DipParser {
  parseDipIndex(dipIndexPath: string): Promise<DiPIndexXml>;
  parseDocumentsStream(dipIndex: DiPIndexXml, dir: string): AsyncIterable<DocumentParsingResult>;
  // parse(dipIndexPath: string): Promise<DipParsingResult>;
}