import { injectable } from 'tsyringe';
import { DipIndexParser } from './dip-index.parser.interface';
import { XMLParser, XMLValidator } from 'fast-xml-parser';
import * as fsp from 'node:fs/promises';
import { DiPIndexXml } from './dip-index.xml';

@injectable()
export class DipIndexParserImpl implements DipIndexParser {
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
          'ComplianceStatement',
          'DocumentClass',
          'AiP',
          'Document',
          'Report',
          'SiP',
          'Attachments',
          'RepresentationInformation',
          'RappresentationInformationUUID',
          'MoreData',
          'Content',
          'Statement',
        ].includes(name),
    });
  }

  public async parseDipIndex(xmlPath: string): Promise<DiPIndexXml> {
    const xml = await fsp.readFile(xmlPath, 'utf-8');

    const validation = XMLValidator.validate(xml);
    if (!validation) {
      throw new Error(`DiPIndex XML non valido: ${JSON.stringify(validation)}`);
    }

    const raw = this.parser.parse(xml) as DiPIndexXml;
    if (!raw.DiPIndex) {
      throw new Error(`Elemento DiPIndex mancante`);
    }

    this.assertRequiredStructure(raw);

    return raw;
  }

  private assertRequiredStructure(root: DiPIndexXml): void {
    const diPIndex = root.DiPIndex;

    if (!diPIndex.PackageInfo) {
      throw new Error('Elemento "PackageInfo" mancante');
    }

    if (!diPIndex.PackageContent?.DiPDocuments) {
      throw new Error('Elemento "PackageContent/DiPDocuments" mancante');
    }

    if (!diPIndex.PackageContent.DiPDocuments.DocumentClass?.length) {
      throw new Error('"PackageContent/DiPDocuments/DocumentClass" mancante o vuoto');
    }

    for (const documentClass of diPIndex.PackageContent.DiPDocuments.DocumentClass) {
      if (
        !documentClass['@_uuid'] ||
        !documentClass['@_name'] ||
        !documentClass['@_version'] ||
        !documentClass['@_validFrom']
      ) {
        throw new Error(
          'Attributi obbligatori mancanti in DocumentClass (uuid, name, version, validFrom)',
        );
      }

      if (!documentClass.AiP?.length) {
        throw new Error(`DocumentClass ${documentClass['@_uuid']} senza elementi AiP`);
      }

      for (const aip of documentClass.AiP) {
        if (!aip['@_uuid']) {
          throw new Error('Attributo obbligatorio "@_uuid" mancante in AiP');
        }

        if (!aip.Document?.length) {
          throw new Error(`AiP ${aip['@_uuid']} senza elementi Document`);
        }

        for (const document of aip.Document) {
          if (!document['@_uuid']) {
            throw new Error('Attributo obbligatorio "@_uuid" mancante in Document');
          }

          if (!document.DocumentPath) {
            throw new Error(`Document ${document['@_uuid']} senza DocumentPath`);
          }

          if (!document.Files?.Metadata || !document.Files?.Primary) {
            throw new Error(`Document ${document['@_uuid']} senza Files/Metadata o Files/Primary`);
          }
        }
      }
    }
  }
}
