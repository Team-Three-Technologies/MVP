import { AiPInfoXml } from './aip-info.xml';

export interface AipInfoParser {
  parseAipInfo(xml: string): Promise<AiPInfoXml>;
}
