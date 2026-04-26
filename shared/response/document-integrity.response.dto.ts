export interface FileIntegrityDTO {
  uuid: string;
  status: boolean;
}

export interface DocumentIntegrityResponseDTO {
  integrity: FileIntegrityDTO;
  attachments: FileIntegrityDTO[];
}
