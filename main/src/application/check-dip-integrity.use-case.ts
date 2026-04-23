import { DipIntegrityResponseDTO } from '../../../shared/response/dip-integrity.response.dto';

export interface CheckDipIntegrityUseCase {
  execute(dipUuid: string): Promise<DipIntegrityResponseDTO>;
}
