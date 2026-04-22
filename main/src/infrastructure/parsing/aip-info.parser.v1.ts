import { injectable } from 'tsyringe';
import { AipInfoParser } from './aip-info.parser.interface';
import { XMLParser, XMLValidator } from 'fast-xml-parser';

@injectable()
export class AipInfoParserV1 implements AipInfoParser {
  private readonly parser: XMLParser;

  constructor() {
    this.parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: '@_',
      textNodeName: '#text',
      trimValues: false,
      parseTagValue: false,
      parseAttributeValue: false,
      isArray: (name) =>
        [
          'SubmissionSession',
          'MoreData',
          'Properties',
          'MIMEType',
          'DefaultValue',
          'MimeTypeStats',
        ].includes(name),
    });
  }

  public async parseAipInfo(xml: string): Promise<any> {
    const validation = XMLValidator.validate(xml);
    if (validation !== true) {
      throw new Error(`AiPInfo XML non valido: ${JSON.stringify(validation)}`);
    }

    const raw = this.parser.parse(xml);
    if (!raw.AiPInfo) {
      throw new Error(`Elemento AiPInfo mancante`);
    }

    return raw;
  }
}
