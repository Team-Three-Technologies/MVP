export interface DocumentEssentialsAttachmentDTO {
  uuid: string;
  name: string;
}

export interface DocumentEssentialsDTO {
  documentUuid: string;
  documentName: string;
  documentAttachments: DocumentEssentialsAttachmentDTO[];
}

export interface DipContentResponseDTO {
  uuid: string;
  creationDate: Date;
  documentNumber: number;
  aipNumber: number;
  documentsList: DocumentEssentialsDTO[];
}
