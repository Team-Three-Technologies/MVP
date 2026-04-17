import { DipContentResponseDTO } from '../../../shared/response/dip-content.response.dto';

export interface GetDipContentUseCase {
  execute(dipUuid: string): Promise<DipContentResponseDTO>;
}
