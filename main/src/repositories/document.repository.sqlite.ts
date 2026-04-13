import { inject, injectable } from 'tsyringe';
import { DocumentRepository } from './document.repository.interface';
import { TOKENS } from '../infrastructure/di/tokens';
import { DatabaseProvider } from '../infrastructure/database/database.provider';
import { Document } from '../domain/document.model';
import { DocumentRow } from './document.row';
import { SubjectRepositoryVisitor } from './subject.repository.visitor'

@injectable()
export class SQLiteDocumentRepository implements DocumentRepository {
  constructor(
    @inject(TOKENS.DatabaseProvider)
    private readonly dbProvider: DatabaseProvider
  ) { }

  public async save(document: Document): Promise<Document> {
    const main = document.getMain();

    const fileInsertStmt = this.dbProvider.instance
      .prepare(`
        INSERT INTO files (uuid, percorso, dimensione)
        VALUES (@uuid, @path, @size);
      `);

    fileInsertStmt.run({
      uuid: main.getUuid(),
      path: main.getPath(),
      size: main.getSize(),
    });

    this.dbProvider.instance
      .prepare(`
        INSERT INTO documenti (uuid, percorso,file_principale, uuid_processo_conservazione)
        VALUES (@uuid, @path, @file_principale, @conservationProcessUuid);
      `)
      .run({
        uuid: document.getUuid(),
        path: document.getPath(),
        file_principale: document.getMain().getUuid(),
        conservationProcessUuid: document.getConservationProcessUuid()
      });

    const attatchmentInsertStmt = this.dbProvider.instance
      .prepare(`
        INSERT INTO allegati (uuid_doc, uuid_file)
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
        uuid_file: att.getUuid()
      });
    }

    const docUuid = document.getUuid();
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

    const visitor = new SubjectRepositoryVisitor(this.dbProvider);
    for (const [sub, role] of document.getSubjects()) {
      const id = sub.accept(visitor);
      sub.setId(id);
      this.dbProvider.instance
        .prepare(`
          INSERT INTO ruoli (uuid_documento, id_soggetto, ruolo)
          VALUES (@uuid_documento, @id_soggetto, @ruolo);
        `)
        .run({
          uuid_documento: document.getUuid(),
          id_soggetto: sub.getId(),
          ruolo: role
        });
    }

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