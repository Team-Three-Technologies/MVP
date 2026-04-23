import { TOKENS } from '../infrastructure/di/tokens';
import { DocumentRepository } from '../repositories/document.repository.interface';
import { inject, injectable } from 'tsyringe';
import { SearchDocumentsFromMetadataUseCase } from './search-documents-from-metadata.use-case';
import { SearchFilterDTO } from '../../../shared/request/search-filter.request.dto';
import { DocumentEssentialsDTO } from '../../../shared/response/dip-content.response.dto';

@injectable()
export class SearchDocumentsFromMetadataService implements SearchDocumentsFromMetadataUseCase {
  constructor(
    @inject(TOKENS.DocumentRepository)
    private readonly documentRepository: DocumentRepository,
  ) {}

  public async execute(filters: SearchFilterDTO[]): Promise<DocumentEssentialsDTO[]> {
      const documents = await this.documentRepository.findAllByMetadata(filters);

    let docEssentialsList: DocumentEssentialsDTO[] = [];
    if (documents !== null) {
      for (const doc of documents) {
        const attachments: { uuid: string; name: string }[] = [];
        for (const attach of doc.getAttachments()) {
          attachments.push({
            uuid: attach.getUuid(),
            name: attach.getFilename(),
          });
        }

        docEssentialsList.push({
          documentUuid: doc.getUuid(),
          documentName: doc.getMain().getFilename(),
          documentAttachments: attachments,
        });
      }
    }
    //console.log(docEssentialsList);
    return docEssentialsList;
  }
}
