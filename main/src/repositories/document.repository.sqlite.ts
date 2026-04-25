import { inject, injectable } from 'tsyringe';
import { DocumentRepository } from './document.repository.interface';
import { TOKENS } from '../infrastructure/di/tokens';
import { DatabaseProvider } from '../infrastructure/database/database.provider';
import { SearchQueryBuilder } from './search-query.builder';
import { Document } from '../domain/document.model';
import { File } from '../domain/file.model';
import { Metadata } from '../domain/metadata.model';
import { DocumentRow } from './document.row';
import { FileRow } from './file.row';
import { MetadataRow } from './metadata.row';
import { MetadataTypeEnum } from '../domain/metadata-type.enum';
import { MetadataFilter } from '../domain/metadata-filter.model';
import { DocumentUuidRow } from './document-uuid.row';

@injectable()
export class SQLiteDocumentRepository implements DocumentRepository {
  constructor(
    @inject(TOKENS.DatabaseProvider)
    private readonly dbProvider: DatabaseProvider,
    @inject(TOKENS.SearchQueryBuilder)
    private readonly searchQueryBuilder: SearchQueryBuilder,
  ) {}

  public async save(document: Document): Promise<Document> {
    const main = document.getMain();

    const fileInsertStmt = this.dbProvider.instance.prepare(`
        INSERT INTO files (uuid, percorso, dimensione)
        VALUES (@uuid, @path, @size);
      `);

    fileInsertStmt.run({
      uuid: main.getUuid(),
      path: main.getPath(),
      size: main.getSize(),
    });

    this.dbProvider.instance
      .prepare(
        `
        INSERT INTO documenti (uuid, percorso, uuid_processo_conservazione, uuid_file_principale)
        VALUES (@uuid, @path, @conservationProcessUuid, @mainFileUuid);
      `,
      )
      .run({
        uuid: document.getUuid(),
        path: document.getPath(),
        conservationProcessUuid: document.getConservationProcessUuid(),
        mainFileUuid: document.getMain().getUuid(),
      });

    const attatchmentInsertStmt = this.dbProvider.instance.prepare(`
        INSERT INTO allegati (uuid_documento, uuid_file)
        VALUES (@uuid_doc, @uuid_file);
      `);

    for (const att of document.getAttachments()) {
      fileInsertStmt.run({
        uuid: att.getUuid(),
        path: att.getPath(),
        size: att.getSize(),
      });

      attatchmentInsertStmt.run({
        uuid_doc: document.getUuid(),
        uuid_file: att.getUuid(),
      });
    }

    const docUuid = document.getUuid();
    const metadataInsertStmt = this.dbProvider.instance.prepare(`
        INSERT INTO metadata (nome, valore, tipo, uuid_documento)
        VALUES (@name, @value, @type, @documentUuid);
      `);

    for (const metadata of document.getMetadata()) {
      metadataInsertStmt.run({
        name: metadata.getName(),
        value: metadata.getValue(),
        type: metadata.getType(),
        documentUuid: docUuid,
      });
    }

    return document;
  }

  public async findMainFileByDocumentUuid(documentUuid: string): Promise<File> {
    const row = this.dbProvider.instance
      .prepare(
        `
        SELECT f.uuid, f.percorso, f.dimensione FROM files f
        JOIN documenti d ON f.uuid = d.uuid_file_principale
        WHERE d.uuid = ?;
      `,
      )
      .get(documentUuid) as FileRow;

    return new File(row.uuid, row.percorso, row.dimensione);
  }

  public async findAttachmentsByDocumentUuid(documentUuid: string): Promise<File[]> {
    const rows = this.dbProvider.instance
      .prepare(
        `
        SELECT f.uuid, f.percorso, f.dimensione FROM files f
        JOIN allegati a ON f.uuid = a.uuid_file
        WHERE a.uuid_documento = ?;
      `,
      )
      .all(documentUuid) as FileRow[];

    return rows.map((row) => new File(row.uuid, row.percorso, row.dimensione));
  }

  public async findMetadataByDocumentUuid(documentUuid: string): Promise<Metadata[]> {
    const rows = this.dbProvider.instance
      .prepare(
        `
        SELECT * FROM metadata
        WHERE uuid_documento = ?  
      `,
      )
      .all(documentUuid) as MetadataRow[];

    return rows.map((row) => new Metadata(row.nome, row.valore, row.tipo as MetadataTypeEnum));
  }

  public async findByUuid(documentUuid: string): Promise<Document | null> {
    const row = this.dbProvider.instance
      .prepare(
        `
        SELECT * FROM documenti
        WHERE uuid = ?;
      `,
      )
      .get(documentUuid) as DocumentRow;

    if (!row) return null;

    const mainFile = await this.findMainFileByDocumentUuid(documentUuid);
    const attachments = await this.findAttachmentsByDocumentUuid(documentUuid);
    const metadata = await this.findMetadataByDocumentUuid(documentUuid);

    return new Document(
      row.uuid,
      row.percorso,
      mainFile,
      attachments,
      metadata,
      row.uuid_processo_conservazione,
    );
  }

  public async findAllByDipUuid(dipUuid: string): Promise<Document[]> {
    const rows = this.dbProvider.instance
      .prepare(
        `
        SELECT d.uuid, d.percorso, d.uuid_processo_conservazione, d.uuid_file_principale FROM documenti d
        JOIN processi_conservazione pc ON d.uuid_processo_conservazione = pc.uuid
        JOIN classi_documentali cd ON pc.uuid_classe_documentale = cd.uuid
        WHERE cd.uuid_dip = ?; 
      `,
      )
      .all(dipUuid) as DocumentRow[];

    const documents: Document[] = [];

    for (const row of rows) {
      documents.push(
        new Document(
          row.uuid,
          row.percorso,
          await this.findMainFileByDocumentUuid(row.uuid),
          await this.findAttachmentsByDocumentUuid(row.uuid),
          await this.findMetadataByDocumentUuid(row.uuid),
          row.uuid_processo_conservazione,
        ),
      );
    }

    return documents;
  }

  public async findFileByUuid(fileUuid: string): Promise<File | null> {
    const row = this.dbProvider.instance
      .prepare(
        `
        SELECT * FROM files
        WHERE uuid = ?;
      `,
      )
      .get(fileUuid) as FileRow;

    return row ? new File(row.uuid, row.percorso, row.dimensione) : null;
  }

  public async findAllByMetadata(filters: MetadataFilter[]): Promise<Document[]> {
    if (filters.length === 0) return [];

    for (const filter of filters) {
      this.searchQueryBuilder.withFilter(filter);
    }
    const result = this.searchQueryBuilder.buildQuery();

    const rows = this.dbProvider.instance
      .prepare(result.query)
      .all(result.params) as DocumentUuidRow[];

    const documents: Document[] = [];
    for (const row of rows) {
      let doc = await this.findByUuid(row.uuid_documento);
      if (doc !== null) documents.push(doc);
    }

    return documents;
  }
}
