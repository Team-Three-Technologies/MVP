import { DiPIndexXml } from './dip-index.xml';

export interface DipParser {
  parse(dipIndexPath: string): Promise<DiPIndexXml>;
}