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
  ) {}

  public async execute(documentUuid: string): Promise<DocumentDetailsResponseDTO> {
    const document = await this.documentRepository.findByUuid(documentUuid);

    if (!document) {
      throw new Error('Non esiste un documento con questo UUID');
    }

    const registrationType = document.getMetadataValue('DatiDiRegistrazione.TipoRegistro') ?? '';
    let registrationDate = '';
    let registrationTime = '';

    if (registrationType === 'Nessuno') {
      registrationDate =
        document.getMetadataValue('DatiDiRegistrazione.TipoRegistro.Nessuno.DataDocumento') ?? '';
      registrationTime =
        document.getMetadataValue('DatiDiRegistrazione.TipoRegistro.Nessuno.OraDocumento') ?? '';
    } else if (registrationType === 'Repertorio\\Registro') {
      registrationDate =
        document.getMetadataValue(
          'DatiDiRegistrazione.TipoRegistro.Repertorio_Registro.DataRegistrazioneDocumento',
        ) ?? '';
      registrationTime =
        document.getMetadataValue(
          'DatiDiRegistrazione.TipoRegistro.Repertorio_Registro.OraRegistrazioneDocumento',
        ) ?? '';
    } else if (registrationType === 'ProtocolloOrdinario\\ProtocolloEmergenza') {
      registrationDate =
        document.getMetadataValue(
          'DatiDiRegistrazione.TipoRegistro.ProtocolloOrdinario_ProtocolloEmergenza.DataProtocollazioneDocumento',
        ) ?? '';
      registrationTime =
        document.getMetadataValue(
          'DatiDiRegistrazione.TipoRegistro.ProtocolloOrdinario_ProtocolloEmergenza.OraProtocollazioneDocumento',
        ) ?? '';
    }

    const dto = {
      uuid: document.getUuid(),
      name: document.getMain().getFilename(),
      extension: document.getMain().getExtension(),
      registrationType: registrationType,
      registrationDate: registrationDate,
      registrationTime: registrationTime,
      content: document.getMetadataValue('ChiaveDescrittiva.Oggetto') ?? '',
      version: document.getMetadataValue('VersioneDelDocumento') ?? '',
      filesCount: Number(document.getMetadataValue('ArchimemoData.DocumentInformation.FilesCount')),
      totalSize: document.getMetadataValue('ArchimemoData.DocumentInformation.TotalSize') ?? '',
      attachmentsCount: document.getAttachments().length,
      attachments: document.getAttachments().map((att) => {
        return {
          uuid: att.getUuid(),
          path: att.getPath(),
          extension: att.getExtension(),
        };
      }),
    };

    return dto;
  }
}
