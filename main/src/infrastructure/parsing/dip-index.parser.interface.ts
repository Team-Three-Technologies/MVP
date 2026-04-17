import { DiPIndexXml } from './dip-index.xml';

export interface DipIndexParser {
  parseDipIndex(xml: string): Promise<DiPIndexXml>;
}
