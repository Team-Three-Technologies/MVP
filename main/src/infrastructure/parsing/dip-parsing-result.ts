import { DiPIndexXml } from './dip-index.xml';
import { DocumentMetadataXml } from './document-metadata.xml';

export interface DipParsingResult {
  dipIndex: DiPIndexXml;
  documentsMetadata: DocumentMetadataXml[];
}