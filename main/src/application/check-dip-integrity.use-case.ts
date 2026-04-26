import { DocumentIntegrityResponseDTO } from '../../../shared/response/document-integrity.response.dto';

export interface CheckDipIntegrityUseCase {
  execute(dipUuid: string): AsyncGenerator<DocumentIntegrityResponseDTO>;
}
