import { inject, injectable } from 'tsyringe';
import { TOKENS } from '../infrastructure/di/tokens';
import { GetDipContentUseCase } from './get-dip-content.use-case';
import { DipRepository } from '../repositories/dip.repository.interface';
import { DocumentRepository } from '../repositories/document.repository.interface';
import {
  DipContentResponseDTO,
  DocumentEssentialsDTO,
} from '../../../shared/response/dip-content.response.dto';
import { File } from '../domain/file.model';

@injectable()
export class GetDipContentService implements GetDipContentUseCase {
  constructor(
    @inject(TOKENS.DipRepository)
    private readonly dipRepository: DipRepository,
    @inject(TOKENS.DocumentRepository)
    private readonly documentRepository: DocumentRepository,
  ) {}

  public async execute(dipUuid: string): Promise<DipContentResponseDTO> {
    const dip = await this.dipRepository.findByUuid(dipUuid);

    if (!dip) {
      throw new Error('Non esiste un DiP con questo UUID');
    }

    const documentEssentials: DocumentEssentialsDTO[] = [];

    const docs = await this.documentRepository.findAllByDipUuid(dip.getProcessUuid());
    for (const doc of docs) {
      const attachments: { uuid: string; name: string }[] = [];
      for (const attach of doc.getAttachments()) {
        attachments.push({
          uuid: attach.getUuid(),
          name: attach.getFilename(),
        });
      }

      documentEssentials.push({
        documentUuid: doc.getUuid(),
        documentName: doc.getMain().getFilename(),
        documentAttachments: attachments,
      });
    }

    return {
      uuid: dip.getProcessUuid(),
      creationDate: dip.getCreationDate(),
      documentNumber: dip.getDocumentsCount(),
      aipNumber: dip.getAipCount(),
      documentsList: documentEssentials,
    };
  }
}
