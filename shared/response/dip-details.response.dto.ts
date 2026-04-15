export interface DocumentEssentialsDTO
{
    document_uuid:string | undefined;
    document_name:string | undefined;
    document_attachments: {uuid:string, name:string}[] | undefined;
}

export interface DipDetailsResponseDTO
{
    uuid:string | undefined;
    creation_date:Date | undefined;
    document_number:number | undefined;
    aip_number:number | undefined;
    document_list: DocumentEssentialsDTO[] | undefined;
}
