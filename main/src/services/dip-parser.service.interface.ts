import { XmlDipIndex } from '../models/dip-index.xml';

export interface IDipParserService {
  parseDipIndex(xmlPath: string): Promise<XmlDipIndex>;
}