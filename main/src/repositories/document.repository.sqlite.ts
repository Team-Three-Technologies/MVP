import { inject, injectable } from 'tsyringe';
import { DocumentRepository } from './document.repository.interface';
import { TOKENS } from '../infrastructure/di/tokens';
import { DatabaseProvider } from '../infrastructure/database/database.provider';
import { Document } from '../domain/document.model';
import { File } from '../domain/file.model';
import { Metadata } from '../domain/metadata.model';
import { DocumentRow } from './document.row';
import { FileRow } from './file.row';
import { MetadataRow } from './metadata.row';
import { SubjectRepositoryVisitor } from './subject.repository.visitor'
import { Subject } from '../domain/subject.model';
import { MetadataTypeEnum } from '../domain/metadata-type.enum';
import { RolesTypeEnum } from '../domain/roles-type.enum';

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
        INSERT INTO documenti (uuid, percorso, uuid_processo_conservazione, uuid_file_principale)
        VALUES (@uuid, @path, @conservationProcessUuid, @mainFileUuid);
      `)
      .run({
        uuid: document.getUuid(),
        path: document.getPath(),
        conservationProcessUuid: document.getConservationProcessUuid(),
        mainFileUuid: document.getMain().getUuid()
      });

    const attatchmentInsertStmt = this.dbProvider.instance
      .prepare(`
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

  public async findByUuid(documentUuid: string): Promise<Document> {
    const documentRow = this.dbProvider.instance
      .prepare(`
        SELECT * FROM documenti
        WHERE uuid = ?;
      `)
      .get(documentUuid) as DocumentRow;

    const mainFileRow = this.dbProvider.instance
      .prepare(`
        SELECT * FROM files
        WHERE uuid = ?;
      `)
      .get(documentRow.uuid_file_principale) as FileRow;

    const attachmentsRows = this.dbProvider.instance
      .prepare(`
        SELECT * FROM files f
        JOIN allegati a ON f.uuid = a.uuid_file
        WHERE a.uuid_documento = ?;
      `)
      .all(documentUuid) as FileRow[];

    const metadataRows = this.dbProvider.instance
      .prepare(`
        SELECT * FROM metadata
        WHERE uuid_documento = ?  
      `).all(documentUuid) as MetadataRow[];

    const rolesRows = this.dbProvider.instance
      .prepare(`
        SELECT * FROM soggetti s
        JOIN ruoli r ON s.id = r.id_soggetto
        WHERE uuid_documento = ?;
      `)
      .all(documentUuid);

    return new Document(
      documentRow.uuid,
      documentRow.percorso,
      new File(mainFileRow.uuid, mainFileRow.percorso, mainFileRow.dimensione),
      attachmentsRows.map(a => new File(a.uuid, a.percorso, a.dimensione)),
      metadataRows.map(met => new Metadata(met.nome, met.valore, met.tipo as MetadataTypeEnum)),
      new Map<Subject, RolesTypeEnum>(),
      documentRow.uuid_processo_conservazione
    );
  }

  public async findAllByDipUuid(dipUuid: string): Promise<Document[]> {
    const rows = this.dbProvider.instance
      .prepare(`
        SELECT * FROM documenti d
        JOIN processi_conservazione pc ON d.uuid_processo_conservazione = pc.uuid
        JOIN classi_documentali cd ON pc.uuid_classe_documentale = cd.uuid
        WHERE cd.uuid_dip = ?; 
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
        WHERE pc.uuid_classe_documentale = ?; 
      `)
      .all(documentClassUuid) as DocumentRow[]

    return []; // TODO: costruire oggetti
  }

  public async findAllByConservationProcessUuid(conservationProcessUuid: string): Promise<Document[]> {
    const rows = this.dbProvider.instance
      .prepare(`
        SELECT * FROM documenti d
        WHERE d.uuid_processo_conservazione = ?; 
      `)
      .all(conservationProcessUuid) as DocumentRow[]

    return []; // TODO: costruire oggetti
  }
}