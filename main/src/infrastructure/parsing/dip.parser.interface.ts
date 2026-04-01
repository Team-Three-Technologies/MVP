import { DipParsingResult } from './dip-parsing-result';

export interface DipParser {
  parse(dipIndexPath: string): Promise<DipParsingResult>;
}