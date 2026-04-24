import { SearchResponseDTO } from '../../../shared/response/search.response.dto';

export interface SearchDocumentsFromMetadataUseCase {
  execute(filters: { type: string; value: string }[]): Promise<SearchResponseDTO>;
}
