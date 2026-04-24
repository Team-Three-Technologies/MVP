import { TOKENS } from '../infrastructure/di/tokens';
import { DocumentRepository } from '../repositories/document.repository.interface';
import { inject, injectable } from 'tsyringe';
import { SearchDocumentsFromMetadataUseCase } from './search-documents-from-metadata.use-case';
import { SearchResponseDTO } from '../../../shared/response/search.response.dto';
import {
  DocumentEssentialsAttachmentDTO,
  DocumentEssentialsDTO,
} from '../../../shared/response/dip-content.response.dto';
import { MetadataFilter } from '../domain/metadata-filter.model';

@injectable()
export class SearchDocumentsFromMetadataService implements SearchDocumentsFromMetadataUseCase {
  constructor(
    @inject(TOKENS.DocumentRepository)
    private readonly documentRepository: DocumentRepository,
  ) {}

  public async execute(filters: { type: string; value: string }[]): Promise<SearchResponseDTO> {
    const documents = await this.documentRepository.findAllByMetadata(
      filters.map((f) => new MetadataFilter(f.type, f.value)),
    );

    const docEssentialsList: DocumentEssentialsDTO[] = [];

    for (const doc of documents) {
      const attachments: DocumentEssentialsAttachmentDTO[] = [];
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

    return { results: docEssentialsList };
  }
}
