import { injectable } from 'tsyringe';
import { IDipParserService } from './dip-parser.service.interface';
import { XMLParser } from 'fast-xml-parser';
import * as fsp from 'fs/promises';
import type { XmlDipIndex, XmlDocumentClass, XmlAip, XmlDocument, XmlDocumentFiles } from '../models/dip-index.xml';

@injectable()
export class DipParserServiceImpl implements IDipParserService {
  private readonly parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: '@_',
    isArray: (name) => [
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

  public async parseDipIndex(xmlPath: string): Promise<XmlDipIndex> {
    const xml = await fsp.readFile(xmlPath, 'utf-8');
    const raw = this.parser.parse(xml);

    return this.mapDipIndex(raw.DiPIndex);
  }

  private mapDipIndex(raw: any): XmlDipIndex {
    return {
      complianceStatements: raw.ComplianceStatement.map((cs: any) => ({
        title: cs.Title,
        body: cs.Body,
        lang: cs['@_lang'] ?? 'it',
      })),
      packageInfo: {
        creatingApplication: {
          name: raw.PackageInfo.CreatingApplication.Name,
          version: raw.PackageInfo.CreatingApplication.Version,
          producer: raw.PackageInfo.CreatingApplication.Producer,
        },
        processUUID: raw.PackageInfo.ProcessUUID,
        creationDate: new Date(raw.PackageInfo.CreationDate),
        documentsCount: raw.PackageInfo.DocumentsCount,
        aipCount: raw.PackageInfo.AiPCount,
      },
      packageContent: {
        dipDocuments: {
          documentClasses: raw.PackageContent.DiPDocuments.DocumentClass
            .map((dc: any) => this.mapDocumentClass(dc)),
        },
        representationInformation: raw.PackageContent.RepresentationInformation
          ?.map((ri: any) => ({
            uuid: ri['@_uuid'],
            name: ri.Name,
            description: ri.Description,
            mimeType: ri.MimeType,
            contents: ri.Content.map((c: any) => ({
              uuid: c['@_uuid'],
              path: c['#text'] ?? c,
            })),
          })),
      },
    };
  }

  private mapDocumentClass(dc: any): XmlDocumentClass {
    return {
      uuid: dc['@_uuid'],
      name: dc['@_name'],
      version: dc['@_version'],
      validFrom: new Date(dc['@_validFrom']),
      validTo: dc['@_validTo'] ? new Date(dc['@_validTo']) : undefined,
      representationInformationUUIDs: dc.RappresentationInformationUUID ?? [],
      aips: dc.AiP.map((aip: any) => this.mapAiP(aip)),
      moreData: dc.MoreData?.map((md: any) => ({
        name: md['@_name'],
        value: md['#text'] ?? md,
      })),
    };
  }

  private mapAiP(aip: any): XmlAip {
    return {
      uuid: aip['@_uuid'],
      aipRoot: aip.AiPRoot,
      reports: aip.Report?.map((r: any) => ({
        uuid: r['@_uuid'],
        name: r['@_name'],
        path: r['#text'] ?? r,
      })),
      sips: aip.SiP?.map((s: any) => ({
        uuid: s['@_uuid'],
        path: s['#text'] ?? s,
      })),
      documents: aip.Document.map((d: any) => this.mapDocument(d)),
    };
  }

  private mapDocument(d: any): XmlDocument {
    return {
      uuid: d['@_uuid'],
      documentPath: d.DocumentPath,
      files: this.mapDocumentFiles(d.Files),
    };
  }

  private mapDocumentFiles(f: any): XmlDocumentFiles {
    return {
      filesCount: f['@_FilesCount'],
      metadata: {
        uuid: f.Metadata['@_uuid'],
        path: f.Metadata['#text'] ?? f.Metadata,
      },
      primary: {
        uuid: f.Primary['@_uuid'],
        path: f.Primary['#text'] ?? f.Primary,
      },
      attachments: f.Attachments?.map((a: any) => ({
        uuid: a['@_uuid'],
        path: a['#text'] ?? a,
      })),
    };
  }
}