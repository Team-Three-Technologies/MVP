import { injectable } from 'tsyringe';
import { DocumentClass } from '../domain/document-class.model';

@injectable()
export class DocumentClassMapper {
  public toDomain(documentClassXml: any, dipUuid: string): DocumentClass {
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
