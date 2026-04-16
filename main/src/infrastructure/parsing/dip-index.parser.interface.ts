import { DiPIndexXml } from './dip-index.xml';

export interface DipIndexParser {
  parseDipIndex(xmlPath: string): Promise<DiPIndexXml>;
}
