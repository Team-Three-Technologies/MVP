import { DocumentMetadataXml } from '../infrastructure/parsing/document-metadata.xml';
import { Document } from '../domain/document.model';
import { File } from '../domain/file.model';
export class DocumentMapper {
  toDomain(documentMetadata: DocumentMetadataXml): Document {
    return new Document(
      documentMetadata.Document.DocumentoInformatico.IdDoc.Identificativo,
    );
  }
}