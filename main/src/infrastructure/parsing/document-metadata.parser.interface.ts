export interface DocumentMetadataParser {
  parseMetadata(xml: string): Promise<any>;
}
