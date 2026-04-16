import { DocumentClassXml } from '../infrastructure/parsing/dip-index.xml';
import { DocumentClass } from '../domain/document-class.model';

export class DocumentClassMapper {
  public toDomain(documentClassXml: DocumentClassXml, dipUuid: string): DocumentClass {
    return new DocumentClass(
      documentClassXml['@_uuid'],
      documentClassXml['@_name'],
      documentClassXml['@_version'],
      new Date(documentClassXml['@_validFrom']),
      documentClassXml['@_validTo'] ? new Date(documentClassXml['@_validTo']) : undefined,
      dipUuid,
    );
  }
}
