import { inject, injectable } from 'tsyringe';
import { TOKENS } from '../infrastructure/di/tokens';
import {GetDipDetailsUseCase} from './get-dip-details.use-case'
import {DipRepository} from '../repositories/dip.repository.interface'
import {DocumentRepository} from '../repositories/document.repository.interface'
import {DipDetailsResponseDTO, DocumentEssentialsDTO} from '../../../shared/response/dip-details.response.dto'
@injectable()
export class GetDipDetailsService implements GetDipDetailsUseCase
{
    constructor(
        @inject(TOKENS.DipRepository)
        @inject(TOKENS.DocumentRepository)
        private readonly dipRepository:DipRepository,
        private readonly documentRepository:DocumentRepository
    ){}
    public async execute(dipUuid: string):Promise<DipDetailsResponseDTO> {
        const dip = await this.dipRepository.findByUuid(dipUuid);

        if(dip != null)
        {
            let documentEssentials:DocumentEssentialsDTO[] = [];

            const docs = await this.documentRepository.findAllByDipUuid(dip.getProcessUuid());
            for(const doc of docs)
            {
                let attachments:{uuid:string, name:string}[]=[];
                for(const attach of doc.getAttachments())
                    attachments.push({uuid:attach.getUuid(), name: attach.getFilename()});

                documentEssentials.push({
                    document_uuid: doc.getUuid(),
                    document_name: doc.getMain().getFilename(),
                    document_attachments:attachments
                });
            }

            return {
                uuid:dip.getProcessUuid(),
                creation_date:dip.getCreationDate(),
                document_number:dip.getDocumentsCount(),
                aip_number:dip.getAipCount(),
                document_list:documentEssentials
            };
        }
        return {
                uuid:undefined,
                creation_date:undefined,
                document_number:undefined,
                aip_number:undefined,
                document_list: undefined
            };
    }
}

