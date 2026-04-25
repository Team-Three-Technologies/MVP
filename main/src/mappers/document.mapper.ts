import { inject, injectable } from 'tsyringe';
import { TOKENS } from '../infrastructure/di/tokens';
import { MetadataFlattener } from './metadata.flattener';
import { Document } from '../domain/document.model';
import { File } from '../domain/file.model';
import { DocumentParsingResult } from '../infrastructure/parsing/document-parsing.result';
@injectable()
export class DocumentMapper {
  constructor(
    @inject(TOKENS.MetadataFlattener)
    private readonly metadataFlattener: MetadataFlattener,
  ) {}

  public toDomain(parsedDocument: DocumentParsingResult): Document {
    const baseMetadata =
      parsedDocument.documentMetadata.Document.DocumentoInformatico ??
      parsedDocument.documentMetadata.Document.DocumentoAmministrativoInformatico ??
      parsedDocument.documentMetadata.Document.AggregazioneDocumentaliInformatiche;

    const primary = parsedDocument.documentMetadata.Document.ArchimemoData.FileInformation?.find(
      (f: any) => f['@_isPrimary'],
    );
    const uuid: string = baseMetadata.IdDoc.Identificativo;
    const documentPath: string = parsedDocument.documentPath;

    const main: File = new File(
      parsedDocument.uuid,
      parsedDocument.primaryFilePath,
      `${String(primary?.FileSize?.['#text'] ?? '')} ${String(primary?.FileSize?.['@_unit'] ?? '')}`.trim(),
    );

    const attachments: File[] = parsedDocument.attachmentsFilesPath.map((a) => {
      const attachmentXml = (
        parsedDocument.documentMetadata.Document.ArchimemoData.FileInformation ?? []
      ).find((att: any) => att.FileUUID === a[0]);

      return new File(
        a[0],
        a[1],
        `${String(attachmentXml?.FileSize?.['#text'] ?? '')} ${String(attachmentXml?.FileSize?.['@_unit'] ?? '')}`.trim(),
      );
    });

    const metadata = this.metadataFlattener.flatten(
      parsedDocument.documentMetadata.Document as unknown as Record<string, unknown>,
    );

    const conservationProcessUuid =
      parsedDocument.documentMetadata.Document.ArchimemoData.DocumentInformation
        .PreservationProcessUUID;

    return new Document(uuid, documentPath, main, attachments, metadata, conservationProcessUuid);
  }
}
