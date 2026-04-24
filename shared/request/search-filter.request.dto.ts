export interface SearchFilterDTO {
  type: string;
  value: string;
  algorithm?: 'SHA-256' | 'SHA-384' | 'SHA-512';
}

