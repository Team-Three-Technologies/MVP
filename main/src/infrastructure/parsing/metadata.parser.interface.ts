import { DocumentMetadataXml } from './document-metadata.xml';

export interface MetadataParser {
  parseMetadata(xml: string): Promise<DocumentMetadataXml>;
}
