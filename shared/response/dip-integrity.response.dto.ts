export interface FileIntegrityDTO {
  uuid: string;
  status: boolean;
}

export interface DocumentIntegrityDTO {
  integrity: FileIntegrityDTO;
  attachments: FileIntegrityDTO[];
}

export interface DipIntegrityResponseDTO {
  documents: DocumentIntegrityDTO[];
}
