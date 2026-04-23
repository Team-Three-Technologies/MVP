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

    // this.assertRequiredStructure(raw);

    return raw;
  }

  private assertRequiredStructure(root: any): void {
    const doc = root.Document;

    if (!doc.DocumentoInformatico) {
      throw new Error('"DocumentoInformatico" mancante');
    }

    if (!doc.ArchimemoData) {
      throw new Error('"ArchimemoData" mancante');
    }

    if (!doc.ArchimemoData['@_adValidFrom']) {
      throw new Error('Attributo obbligatorio "ArchimemoData@adValidFrom" mancante');
    }

    if (!doc.DocumentoInformatico.IdDoc?.Identificativo) {
      throw new Error('"DocumentoInformatico/IdDoc/Identificativo" mancante');
    }

    if (!doc.DocumentoInformatico.Soggetti?.Ruolo?.length) {
      throw new Error('"DocumentoInformatico/Soggetti/Ruolo" mancante o vuoto');
    }

    if (!doc.ArchimemoData.DocumentInformation?.DocumentUUID) {
      throw new Error('"ArchimemoData/DocumentInformation/DocumentUUID" mancante');
    }
  }
}
