import {DipDetailsResponseDTO} from '../../../shared/dip-details.response.dto'
export interface GetDipDetailsUseCase{
  execute(dipUuid:string): Promise<DipDetailsResponseDTO>;
}
