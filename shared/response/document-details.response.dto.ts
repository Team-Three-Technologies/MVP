export interface AttachmentResponseDTO {
  uuid: string;
  path: string;
  extension: string;
}

export interface SubjectDTO {
  id: number;
  role: string;
  name: string;
  type: string;
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
  documentType: string;
  documentNumber: string;
  registryCode: string;
  aggregationType: string;
  subjects: SubjectDTO[];
}
