import { injectable } from 'tsyringe';
import { MetadataParser } from './metadata.parser.interface';
import { XMLParser, XMLValidator } from 'fast-xml-parser';
import * as fsp from 'node:fs/promises';
import { DocumentMetadataXml } from './document-metadata.xml';

@injectable()
export class MetadataParserImpl implements MetadataParser {
  private readonly parser: XMLParser;

  constructor() {
    this.parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: '@_',
      isArray: (name) => [
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

  public async parseMetadata(xmlPath: string): Promise<DocumentMetadataXml> {
    const xml = await fsp.readFile(xmlPath, 'utf-8');

    const validation = XMLValidator.validate(xml);
    if (!validation) {
      throw new Error(`DocumentMetadata XML non valido: ${JSON.stringify(validation)}`);
    }

    const raw = this.parser.parse(xml) as DocumentMetadataXml;
    if (!raw.Document) {
      throw new Error(`Elemento Document mancante`);
    }

    this.assertRequiredStructure(raw);

    return raw;
  }

  private assertRequiredStructure(root: DocumentMetadataXml): void {
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