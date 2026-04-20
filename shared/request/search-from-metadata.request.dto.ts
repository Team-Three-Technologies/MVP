export interface SearchFilterDTO{
    type: string;
    value: string;
}
export interface SearchFromMetadataRequestDTO{
    filters: SearchFilterDTO[] | [] 
}
