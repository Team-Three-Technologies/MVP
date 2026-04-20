import { inject, injectable } from 'tsyringe';
import { TOKENS } from '../infrastructure/di/tokens';
import { SubjectMapper } from './subject.mapper';
import { MetadataFlattener } from './metadata.flattener';
import { Document } from '../domain/document.model';
import { File } from '../domain/file.model';
import { DocumentParsingResult } from '../infrastructure/parsing/document-parsing.result';
import { Subject } from '../domain/subject.model';
import { RolesTypeEnum } from '../domain/roles-type.enum';

@injectable()
export class DocumentMapper {
  constructor(
    @inject(TOKENS.SubjectMapper)
    private readonly subjectMapper: SubjectMapper,
    @inject(TOKENS.MetadataFlattener)
    private readonly metadataFlattener: MetadataFlattener,
  ) {}

  public toDomain(parsedDocument: DocumentParsingResult): Document {
    const primary = parsedDocument.documentMetadata.Document.ArchimemoData.FileInformation?.find(
      (f) => f['@_isPrimary'],
    );
    const uuid: string =
      parsedDocument.documentMetadata.Document.DocumentoInformatico.IdDoc.Identificativo;
    const documentPath: string = parsedDocument.documentPath;

    const main: File = new File(
      parsedDocument.uuid,
      parsedDocument.primaryFilePath,
      `${String(primary?.FileSize?.['#text'] ?? '')} ${String(primary?.FileSize?.['@_unit'] ?? '')}`.trim(),
    );

    const attachments: File[] = parsedDocument.attachmentsFilesPath.map((a) => {
      const attachmentXml = (
        parsedDocument.documentMetadata.Document.ArchimemoData.FileInformation ?? []
      ).find((att) => att.FileUUID === a[0]);

      return new File(
        a[0],
        a[1],
        `${String(attachmentXml?.FileSize?.['#text'] ?? '')} ${String(attachmentXml?.FileSize?.['@_unit'] ?? '')}`.trim(),
      );
    });

    const metadata = this.metadataFlattener.flatten(
      parsedDocument.documentMetadata.Document as unknown as Record<string, unknown>,
    );

    const entries = this.subjectMapper.toDomain(
      parsedDocument.documentMetadata.Document.DocumentoInformatico.Soggetti.Ruolo,
    );

    const subjects = new Map<Subject, RolesTypeEnum>(
      entries.map((e) => [e.subject, e.roleType] as [Subject, RolesTypeEnum]),
    );
    const conservationProcessUuid =
      parsedDocument.documentMetadata.Document.ArchimemoData.DocumentInformation
        .PreservationProcessUUID;

    return new Document(
      uuid,
      documentPath,
      main,
      attachments,
      metadata,
      subjects,
      conservationProcessUuid,
    );
  }
}
