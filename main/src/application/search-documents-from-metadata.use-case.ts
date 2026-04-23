import { SearchFilterDTO } from '../../../shared/request/search-filter.request.dto';
import { DocumentEssentialsDTO } from '../../../shared/response/dip-content.response.dto';

export interface SearchDocumentsFromMetadataUseCase{
    execute(filters:SearchFilterDTO[]): Promise<DocumentEssentialsDTO[]>;
}
