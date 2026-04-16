import { DipContentResponseDTO } from '../../../shared/response/dip-details.response.dto';

export interface GetDipContentUseCase {
  execute(dipUuid: string): Promise<DipContentResponseDTO>;
}
