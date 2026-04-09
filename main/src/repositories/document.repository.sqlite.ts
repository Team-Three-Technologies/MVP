import { inject, injectable } from 'tsyringe';
import { DocumentRepository } from './document.repository.interface';
import { TOKENS } from '../infrastructure/di/tokens';
import { DatabaseProvider } from '../infrastructure/database/database.provider';
import { Document } from '../domain/document.model';
import { DocumentRow } from './document.row';

@injectable()
export class SQLiteDocumentRepository implements DocumentRepository {
  constructor(
    @inject(TOKENS.DatabaseProvider)
    private readonly dbProvider: DatabaseProvider
  ) { }

  public async save(document: Document): Promise<Document> {
    this.dbProvider.instance
      .prepare(`
        INSERT INTO documenti (uuid, percorso, uuid_processo_conservazione)
        VALUES (@uuid, @path, @conservationProcessUuid);
      `)
      .run({
        uuid: document.getUuid(),
        path: document.getPath(),
        conservationProcessUuid: document.getConservationProcessUuid()
      });

    const docUuid = document.getUuid();
    const main = document.getMain();

    const fileInsertStmt = this.dbProvider.instance
      .prepare(`
        INSERT INTO files (uuid, percorso, dimensione, ruolo, uuid_documento)
        VALUES (@uuid, @path, @size, @role, @documentUuid);
      `);

    fileInsertStmt.run({
      uuid: main.getUuid(),
      path: main.getPath(),
      size: main.getSize(),
      role: 'PRIMARY',
      documentUuid: docUuid
    });

    for (const att of document.getAttachments()) {
      fileInsertStmt.run({
        uuid: att.getUuid(),
        path: att.getPath(),
        size: att.getSize(),
        role: 'ATTACHMENT',
        documentUuid: docUuid
      })
    }

    const metadataInsertStmt = this.dbProvider.instance
      .prepare(`
        INSERT INTO metadata (nome, valore, tipo, uuid_documento)
        VALUES (@name, @value, @type, @documentUuid);
      `);

    for (const metadata of document.getMetadata()) {
      metadataInsertStmt.run({
        name: metadata.getName(),
        value: metadata.getValue(),
        type: metadata.getType(),
        documentUuid: docUuid
      });
    }

    // TODO: salvare subjects
    return document;
  }

  public async findAllByDipUuid(dipUuid: string): Promise<Document[]> {
    const rows = this.dbProvider.instance
      .prepare(`
        SELECT * FROM documenti d
        JOIN processi_conservazione pc ON d.uuid_processo_conservazione = pc.uuid
        JOIN classi_documentali cd ON pc.uuid_classe_documentale = cd.uuid
        JOIN archivi_dip ad ON cd.uuid_dip = ad.uuid_processo
        WHERE ad.uuid_processo = ?; 
      `)
      .all(dipUuid) as DocumentRow[]

    // return rows.map((row: DocumentRow) => {
    //   return new Document(row.uuid, row.percorso, /* costruire main, attachments e subjects */, row.uuid_processo_conservazione);
    // }); // TODO: costruire oggetti
    return [];
  }

  public async findAllByDocumentClassUuid(documentClassUuid: string): Promise<Document[]> {
    const rows = this.dbProvider.instance
      .prepare(`
        SELECT * FROM documenti d
        JOIN processi_conservazione pc ON d.uuid_processo_conservazione = pc.uuid
        JOIN classi_documentali cd ON pc.uuid_classe_documentale = cd.uuid
        WHERE cd.uuid = ?; 
      `)
      .all(documentClassUuid) as DocumentRow[]

    return []; // TODO: costruire oggetti
  }

  public async findAllByConservationProcessUuid(conservationProcessUuid: string): Promise<Document[]> {
    const rows = this.dbProvider.instance
      .prepare(`
        SELECT * FROM documenti d
        JOIN processi_conservazione pc ON d.uuid_processo_conservazione = pc.uuid
        WHERE pc.uuid = ?; 
      `)
      .all(conservationProcessUuid) as DocumentRow[]

    return []; // TODO: costruire oggetti
  }
}