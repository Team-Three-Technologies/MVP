import { Buffer } from 'node:buffer';
import { DocumentParsingResult } from './document-parsing.result';

export interface DipParser {
  parseDipIndex(dipIndexBuffer: Buffer): Promise<any>;
  parseAipInfo(aipInfoBuffer: Buffer): Promise<any>;
  parseDocumentsStream(dipIndex: any, dir: string): AsyncIterable<DocumentParsingResult>;
}
