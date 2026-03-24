import { XmlDipIndex } from './dip-index.xml';

export interface IDipParserService {
  parseDipIndex(xmlPath: string): Promise<XmlDipIndex>;
}