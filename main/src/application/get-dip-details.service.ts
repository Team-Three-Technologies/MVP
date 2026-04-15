import { inject, injectable } from 'tsyringe';
import { TOKENS } from '../infrastructure/di/tokens';
import {GetDipDetailsUseCase} from './get-dip-details.use-case'
import {DipRepository} from '../repositories/dip.repository.interface'
import {DipDetailsResponseDTO} from '../../../shared/dip-details.response.dto'
@injectable()
export class GetDipDetailsService implements GetDipDetailsUseCase
{
    constructor(
        @inject(TOKENS.DipRepository)
        private readonly dipRepository:DipRepository
    ){}
    public async execute(dipUuid: string):Promise<DipDetailsResponseDTO> {
        const dip = await this.dipRepository.findByUuid(dipUuid);

        if(dip != null)
        {
            return {
                uuid:dip.getProcessUuid(),
                creation_date:dip.getCreationDate(),
                document_number:dip.getDocumentsCount(),
                aip_number:dip.getAipCount()
            };
        }
        return {
                uuid:undefined,
                creation_date:undefined,
                document_number:undefined,
                aip_number:undefined
            };
    }
}

