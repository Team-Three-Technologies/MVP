import { DocumentMetadataXml } from './document-metadata.xml';

export interface DocumentParsingResult {
  uuid: string;
  conservationProcessUuid: string;
  documentPath: string;
  primaryFilePath: string;
  attachmentsFilesPath: [uuid: string, path: string][];
  documentMetadata: DocumentMetadataXml;
}
