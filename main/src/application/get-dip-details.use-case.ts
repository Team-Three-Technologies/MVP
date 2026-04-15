import {DipDetailsResponseDTO} from '../../../shared/response/dip-details.response.dto'
export interface GetDipDetailsUseCase{
  execute(dipUuid:string): Promise<DipDetailsResponseDTO>;
}
