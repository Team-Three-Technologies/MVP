import { AiPInfoXml } from './aip-info.xml';

export interface AipInfoParser {
  parseAipInfo(xmlPath: string): Promise<AiPInfoXml>;
}