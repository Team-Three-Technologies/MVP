export interface SearchFilterDTO {
  type: string;
  value: string;
}

export interface SearchRequestDTO {
  filters: SearchFilterDTO[];
}