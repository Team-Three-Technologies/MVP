export interface DocumentDto {
  id: string;
  title: string;
  content: string;
  updatedAt: string;
}

export interface CreateDocumentDto {
  title: string;
  content: string;
}