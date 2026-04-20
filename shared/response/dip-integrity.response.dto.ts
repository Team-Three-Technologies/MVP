export interface FileIntegrity {
  uuid: string;
  status: boolean;
}

export interface DocumentIntegrity {
  integrity: FileIntegrity;
  attachments: FileIntegrity[];
}

export interface DipIntegrityResponseDTO {
  documents: DocumentIntegrity[];
}
