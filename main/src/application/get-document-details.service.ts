import { inject, injectable } from 'tsyringe';
import { TOKENS } from '../infrastructure/di/tokens';
import { GetDocumentDetailsUseCase } from './get-document-details.use-case';
import { DocumentDetailsResponseDTO } from '../../../shared/response/document-details.response.dto';
import { DocumentRepository } from '../repositories/document.repository.interface';

@injectable()
export class GetDocumentDetailsService implements GetDocumentDetailsUseCase {
  constructor(
    @inject(TOKENS.DocumentRepository)
    private readonly documentRepository: DocumentRepository,
  ) { }

  public async execute(documentUuid: string): Promise<DocumentDetailsResponseDTO> {
    const document = await this.documentRepository.findByUuid(documentUuid, true);

    if (!document) {
      throw new Error(`Non esiste un documento con questo UUID: ${documentUuid}`);
    }

    const dto = {
      uuid: document.getUuid(),
      name: document.getMain().getFilename(),
      extension: document.getMain().getExtension(),
      registrationType:
        document.getMetadataValueByRegex(
          /[a-zA-Z]+\.DatiDiRegistrazione\.TipoRegistro\.\w+\.TipoRegistro/,
        ) ?? '',
      registrationDate:
        document.getMetadataValueByRegex(
          /[a-zA-Z]+\.DatiDiRegistrazione\.TipoRegistro\.\w+\.Data\w+/,
        ) ?? '',
      registrationTime:
        document.getMetadataValueByRegex(
          /[a-zA-Z]+\.DatiDiRegistrazione\.TipoRegistro\.\w+\.Ora\w+/,
        ) ?? '',
      content: document.getMetadataValueByRegex(/[a-zA-Z]+\.ChiaveDescrittiva\.Oggetto$/) ?? '',
      version: document.getMetadataValueByRegex(/[a-zA-Z]+\.VersioneDelDocumento$/) ?? '',
      filesCount: Number(
        document.getMetadataValueByName('ArchimemoData.DocumentInformation.FilesCount'),
      ),
      totalSize: `${document.getMetadataValueByName('ArchimemoData.DocumentInformation.TotalSize.#text')} ${document.getMetadataValueByName('ArchimemoData.DocumentInformation.TotalSize.@_unit')}`,
      attachmentsCount: document.getAttachments().length,
      attachments: document.getAttachments().map((att) => {
        return {
          uuid: att.getUuid(),
          path: att.getPath(),
          extension: att.getExtension(),
        };
      }),
      documentType: document.getMetadataValueByRegex(/[a-zA-Z]+\.TipologiaDocumentale$/) ?? '',
      documentNumber: document.getMetadataValueByRegex(/[a-zA-Z]+\.DatiDiRegistrazione\.TipoRegistro\.\S+\.Numero[a-zA-Z]*Documento$/) ?? '',
      registryCode: document.getMetadataValueByRegex(/[a-zA-Z]+\.DatiDiRegistrazione\.TipoRegistro\.\S+\.CodiceRegistro$/) ?? '',
      aggregationType: document.getMetadataValueByRegex(/[a-zA-Z]+\.Agg\.TipoAgg\.\d+\.TipoAggregazione$/) ?? '',
      subjects: []
    };

    return dto;
  }
}
