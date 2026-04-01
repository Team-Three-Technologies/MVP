import { DocumentMetadataXml } from './document-metadata.xml';

export interface MetadataParser {
  parseMetadata(xmlPath: string): Promise<DocumentMetadataXml>;
}