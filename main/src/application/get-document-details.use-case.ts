import { DocumentDetailsResponseDTO } from '../../../shared/response/document-details.response.dto';

export interface GetDocumentDetailsUseCase {
  execute(documentUuid: string): Promise<DocumentDetailsResponseDTO>;
}
