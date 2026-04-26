import { inject, injectable } from 'tsyringe';
import { DocumentRepository } from './document.repository.interface';
import { TOKENS } from '../infrastructure/di/tokens';
import { Statement } from 'better-sqlite3';
import { DatabaseProvider } from '../infrastructure/database/database.provider';
import { SearchQueryBuilder } from './search-query.builder';
import { Document } from '../domain/document.model';
import { File } from '../domain/file.model';
import { Metadata } from '../domain/metadata.model';
import { DocumentUuidRow, DocumentWithMainFileRow } from './document.row';
import { AttachmentRow } from './attachment.row';
import { MetadataRow } from './metadata.row';
import { MetadataTypeEnum } from '../domain/metadata-type.enum';
import { MetadataFilter } from '../domain/metadata-filter.model';

@injectable()
export class SQLiteDocumentRepository implements DocumentRepository {
  private readonly fileInsertStmt: Statement;
  private readonly documentInsertStmt: Statement;
  private readonly attachmentInsertStmt: Statement;
  private readonly metadataInsertStmt: Statement;

  constructor(
    @inject(TOKENS.DatabaseProvider)
    private readonly dbProvider: DatabaseProvider,
    @inject(TOKENS.SearchQueryBuilder)
    private readonly searchQueryBuilder: SearchQueryBuilder,
  ) {
    this.fileInsertStmt = this.dbProvider.instance.prepare(`
      INSERT INTO files (uuid, percorso, dimensione)
      VALUES (@uuid, @path, @size);
    `);

    this.documentInsertStmt = this.dbProvider.instance.prepare(`
      INSERT INTO documenti (uuid, percorso, uuid_processo_conservazione, uuid_file_principale)
      VALUES (@uuid, @path, @conservationProcessUuid, @mainFileUuid);
    `);

    this.attachmentInsertStmt = this.dbProvider.instance.prepare(`
      INSERT INTO allegati (uuid_documento, uuid_file)
      VALUES (@uuid_doc, @uuid_file);
    `);

    this.metadataInsertStmt = this.dbProvider.instance.prepare(`
      INSERT INTO metadata (nome, valore, tipo, uuid_documento)
      VALUES (@name, @value, @type, @documentUuid);
    `);
  }

  public async saveMany(documents: Document[]): Promise<void> {
    const tx = this.dbProvider.instance.transaction((docs: Document[]) => {
      for (const document of docs) {
        const main = document.getMain();

        this.fileInsertStmt.run({
          uuid: main.getUuid(),
          path: main.getPath(),
          size: main.getSize(),
        });

        this.documentInsertStmt.run({
          uuid: document.getUuid(),
          path: document.getPath(),
          conservationProcessUuid: document.getConservationProcessUuid(),
          mainFileUuid: main.getUuid(),
        });

        for (const att of document.getAttachments()) {
          this.fileInsertStmt.run({
            uuid: att.getUuid(),
            path: att.getPath(),
            size: att.getSize(),
          });
          this.attachmentInsertStmt.run({ uuid_doc: document.getUuid(), uuid_file: att.getUuid() });
        }

        for (const metadata of document.getMetadata()) {
          this.metadataInsertStmt.run({
            name: metadata.getName(),
            value: metadata.getValue(),
            type: metadata.getType(),
            documentUuid: document.getUuid(),
          });
        }
      }
    });

    tx(documents);
  }

  private hydrateDocs(uuids: string[], withMetadata: boolean): Document[] {
    if (uuids.length === 0) return [];

    const placeholders = uuids.map(() => '?').join(',');

    const rows = this.dbProvider.instance
      .prepare(
        `
        SELECT
          d.uuid, d.percorso, d.uuid_processo_conservazione,
          f.uuid AS file_uuid, f.percorso AS file_percorso, f.dimensione AS file_dimensione
        FROM documenti d
        JOIN files f ON f.uuid = d.uuid_file_principale
        WHERE d.uuid IN (${placeholders})
      `,
      )
      .all(uuids) as DocumentWithMainFileRow[];

    const allAttachments = this.dbProvider.instance
      .prepare(
        `
        SELECT a.uuid_documento, f.uuid, f.percorso, f.dimensione FROM allegati a
        JOIN files f ON f.uuid = a.uuid_file
        WHERE a.uuid_documento IN (${placeholders})
      `,
      )
      .all(uuids) as AttachmentRow[];

    const attachmentsByDoc = new Map<string, File[]>();
    for (const att of allAttachments) {
      const list = attachmentsByDoc.get(att.uuid_documento) ?? [];
      list.push(new File(att.uuid, att.percorso, att.dimensione));
      attachmentsByDoc.set(att.uuid_documento, list);
    }

    const metadataByDoc = new Map<string, Metadata[]>();
    if (withMetadata) {
      const allMetadata = this.dbProvider.instance
        .prepare(
          `
          SELECT uuid_documento, nome, valore, tipo FROM metadata
          WHERE uuid_documento IN (${placeholders})
        `,
        )
        .all(uuids) as MetadataRow[];

      for (const m of allMetadata) {
        const list = metadataByDoc.get(m.uuid_documento) ?? [];
        list.push(new Metadata(m.nome, m.valore, m.tipo as MetadataTypeEnum));
        metadataByDoc.set(m.uuid_documento, list);
      }
    }

    return rows.map(
      (row) =>
        new Document(
          row.uuid,
          row.percorso,
          new File(row.file_uuid, row.file_percorso, row.file_dimensione),
          attachmentsByDoc.get(row.uuid) ?? [],
          metadataByDoc.get(row.uuid) ?? [],
          row.uuid_processo_conservazione,
        ),
    );
  }

  public async findByUuid(documentUuid: string, withMetadata: boolean): Promise<Document | null> {
    return this.hydrateDocs([documentUuid], withMetadata)[0] ?? null;
  }

  public async findAllByDipUuid(dipUuid: string, withMetadata: boolean): Promise<Document[]> {
    const rows = this.dbProvider.instance
      .prepare(
        `
        SELECT d.uuid AS uuid_documento FROM documenti d
        JOIN processi_conservazione pc ON d.uuid_processo_conservazione = pc.uuid
        JOIN classi_documentali cd ON pc.uuid_classe_documentale = cd.uuid
        WHERE cd.uuid_dip = ?; 
      `,
      )
      .all(dipUuid) as DocumentUuidRow[];

    return this.hydrateDocs(
      rows.map((row) => row.uuid_documento),
      withMetadata,
    );
  }

  public async findAllByMetadata(
    filters: MetadataFilter[],
    withMetadata: boolean,
  ): Promise<Document[]> {
    if (filters.length === 0) return [];

    for (const filter of filters) {
      this.searchQueryBuilder.withFilter(filter);
    }
    const result = this.searchQueryBuilder.buildQuery();

    const rows = this.dbProvider.instance
      .prepare(result.query)
      .all(result.params) as DocumentUuidRow[];

    return this.hydrateDocs(
      rows.map((row) => row.uuid_documento),
      withMetadata,
    );
  }
}
