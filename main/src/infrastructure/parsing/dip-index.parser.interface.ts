export interface DipIndexParser {
  parseDipIndex(xml: string): Promise<any>;
}
