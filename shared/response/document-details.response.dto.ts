export interface AttachmentResponseDTO {
  uuid: string;
  path: string;
  extension: string;
}

export interface DocumentDetailsResponseDTO {
  uuid: string;
  name: string;
  extension: string;
  registrationType: string;
  registrationDate: string;
  registrationTime: string;
  content: string;
  version: string;
  filesCount: number;
  totalSize: string;
  attachmentsCount: number;
  attachments: AttachmentResponseDTO[];
}
