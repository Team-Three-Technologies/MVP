export interface AipInfoParser {
  parseAipInfo(xml: string): Promise<any>;
}
