import { injectable } from 'tsyringe';
import { DocumentMetadataParser } from './document-metadata.parser.interface';
import { XMLParser, XMLValidator } from 'fast-xml-parser';

@injectable()
export class DocumentMetadataParserV1 implements DocumentMetadataParser {
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
          'Ruolo',
          'ParoleChiave',
          'TracciatureModificheDocumento',
          'IndirizziDigitaliDiRiferimento',
          'IndiceAllegati',
          'TipoAgg',
          'FileInformation',
          'MoreData',
        ].includes(name),
    });
  }

  public async parseMetadata(xml: string): Promise<any> {
    const validation = XMLValidator.validate(xml);
    if (validation !== true) {
      throw new Error(`DocumentMetadata XML non valido: ${JSON.stringify(validation)}`);
    }

    const raw = this.parser.parse(xml);
    if (!raw.Document) {
      throw new Error(`Elemento Document mancante`);
    }

    return raw;
  }
}
