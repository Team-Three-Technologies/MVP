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
import { SubjectHydrationRow } from './subject-hydration.row';
import { SubjectRepositoryVisitor } from './subject.repository.visitor';
import { Subject } from '../domain/subject.model';
import { MetadataTypeEnum } from '../domain/metadata-type.enum';
import { RolesTypeEnum } from '../domain/roles-type.enum';
import { PFSubject } from '../domain/pf-subject.model';
import { PGSubject } from '../domain/pg-subject.model';
import { PAISubject } from '../domain/pai-subject.model';
import { PAESubject } from '../domain/pae-subject.model';
import { ASSubject } from '../domain/as-subject.model';
import { SWSubject } from '../domain/sw-subject.model';
import { Person } from '../domain/person.model';
import { SearchFilterDTO } from '../../../shared/request/search-filter.request.dto';
import { SearchQueryBuilder } from './search-query.builder';

@injectable()
export class SQLiteDocumentRepository implements DocumentRepository {
  constructor(
    @inject(TOKENS.DatabaseProvider)
    private readonly dbProvider: DatabaseProvider,
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

    const visitor = new SubjectRepositoryVisitor(this.dbProvider);
    for (const [sub, role] of document.getSubjects()) {
      const id = sub.accept(visitor);
      sub.setId(id);
      this.dbProvider.instance
        .prepare(
          `
          INSERT INTO ruoli (uuid_documento, id_soggetto, ruolo)
          VALUES (@uuid_documento, @id_soggetto, @ruolo);
        `,
        )
        .run({
          uuid_documento: document.getUuid(),
          id_soggetto: sub.getId(),
          ruolo: role,
        });
    }

    return document;
  }

  private fromHydrationRow(r: SubjectHydrationRow): Subject {
    switch (r.tipo) {
      case 'Persona Fisica':
        return new PFSubject(
          r.id,
          new Person(r.pf_nome!, r.pf_cognome!, r.pf_cf ?? undefined),
          r.pf_indirizzi?.split(' ') ?? [],
        );
      case 'Organizzazione':
        return new PGSubject(
          r.id,
          r.pg_den_org!,
          r.pg_piva ?? undefined,
          r.pg_den_uff ?? undefined,
          r.pg_indirizzi?.split(' ') ?? [],
        );
      case 'Amministrazione Pubblica italiana':
        return new PAISubject(
          r.id,
          r.pai_den_amm!,
          r.pai_cod_ipa!,
          r.pai_den_aoo ?? undefined,
          r.pai_cod_aoo ?? undefined,
          r.pai_den_uor ?? undefined,
          r.pai_cod_uor ?? undefined,
          r.pai_indirizzi?.split(' ') ?? [],
        );
      case 'Amministrazione Pubblica estera':
        return new PAESubject(
          r.id,
          r.pae_den_amm!,
          r.pae_den_uff ?? undefined,
          r.pae_indirizzi?.split(' ') ?? [],
        );
      case 'Assegnatario':
        return new ASSubject(
          r.id,
          new Person(r.as_nome ?? undefined, r.as_cognome ?? undefined, r.as_cf ?? undefined),
          r.as_den_org!,
          r.as_den_uff!,
          r.as_indirizzi?.split(' ') ?? [],
        );
      case 'Documento prodotto automaticamente':
        return new SWSubject(r.id, r.sw_den_sistema!);
      default:
        throw new Error(`Tipo soggetto non supportato: ${(r as any).tipo}`);
    }
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

  public async findSubjectsByDocumentUuid(
    documentUuid: string,
  ): Promise<Map<Subject, RolesTypeEnum>> {
    const rows = this.dbProvider.instance
      .prepare(
        `
        SELECT s.id, s.tipo, r.ruolo,
        pf.cognome AS pf_cognome, pf.nome AS pf_nome, pf.cf AS pf_cf, pf.indirizzi_dig_riferimento AS pf_indirizzi,
        pg.den_organizzazione AS pg_den_org, pg.p_iva AS pg_piva, pg.den_ufficio AS pg_den_uff, pg.indirizzi_dig_riferimento AS pg_indirizzi,
        pai.den_amministrazione AS pai_den_amm, pai.codice_ipa AS pai_cod_ipa, pai.den_amministrazione_aoo AS pai_den_aoo,
        pai.codice_ipa_aoo AS pai_cod_aoo, pai.den_amministrazione_uor AS pai_den_uor, pai.codice_ipa_uor AS pai_cod_uor,
        pai.indirizzi_dig_riferimento AS pai_indirizzi,
        pae.den_amministrazione AS pae_den_amm, pae.den_ufficio AS pae_den_uff, pae.indirizzi_dig_riferimento AS pae_indirizzi,
        ass.cognome AS as_cognome, ass.nome AS as_nome, ass.cf AS as_cf,
        ass.den_organizzazione AS as_den_org, ass.den_ufficio AS as_den_uff,
        ass.indirizzi_dig_riferimento AS as_indirizzi,
        sw.den_sistema AS sw_den_sistema
        FROM ruoli r
        JOIN soggetti s ON s.id = r.id_soggetto
        LEFT JOIN soggetti_pf pf ON pf.id = s.id
        LEFT JOIN soggetti_pg pg ON pg.id = s.id
        LEFT JOIN soggetti_pai pai ON pai.id = s.id
        LEFT JOIN soggetti_pae pae ON pae.id = s.id
        LEFT JOIN soggetti_as ass ON ass.id = s.id
        LEFT JOIN soggetti_sw sw ON sw.id  = s.id
        WHERE r.uuid_documento = ?;
      `,
      )
      .all(documentUuid) as SubjectHydrationRow[];

    const subjects = new Map<Subject, RolesTypeEnum>();
    for (const row of rows) {
      subjects.set(this.fromHydrationRow(row), row.ruolo as RolesTypeEnum);
    }

    return subjects;
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
    const subjects = await this.findSubjectsByDocumentUuid(documentUuid);

    return new Document(
      row.uuid,
      row.percorso,
      mainFile,
      attachments,
      metadata,
      subjects,
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
          await this.findSubjectsByDocumentUuid(row.uuid),
          row.uuid_processo_conservazione,
        ),
      );
    }

    return documents;
  }

  public async findAllByDocumentClassUuid(documentClassUuid: string): Promise<Document[]> {
    const rows = this.dbProvider.instance
      .prepare(
        `
        SELECT d.uuid, d.percorso, d.uuid_processo_conservazione, d.uuid_file_principale FROM documenti d
        JOIN processi_conservazione pc ON d.uuid_processo_conservazione = pc.uuid
        WHERE pc.uuid_classe_documentale = ?; 
      `,
      )
      .all(documentClassUuid) as DocumentRow[];

    const documents: Document[] = [];

    for (const row of rows) {
      documents.push(
        new Document(
          row.uuid,
          row.percorso,
          await this.findMainFileByDocumentUuid(row.uuid),
          await this.findAttachmentsByDocumentUuid(row.uuid),
          await this.findMetadataByDocumentUuid(row.uuid),
          await this.findSubjectsByDocumentUuid(row.uuid),
          row.uuid_processo_conservazione,
        ),
      );
    }

    return documents;
  }

  public async findAllByConservationProcessUuid(
    conservationProcessUuid: string,
  ): Promise<Document[]> {
    const rows = this.dbProvider.instance
      .prepare(
        `
        SELECT * FROM documenti d
        WHERE d.uuid_processo_conservazione = ?; 
      `,
      )
      .all(conservationProcessUuid) as DocumentRow[];

    const documents: Document[] = [];

    for (const row of rows) {
      documents.push(
        new Document(
          row.uuid,
          row.percorso,
          await this.findMainFileByDocumentUuid(row.uuid),
          await this.findAttachmentsByDocumentUuid(row.uuid),
          await this.findMetadataByDocumentUuid(row.uuid),
          await this.findSubjectsByDocumentUuid(row.uuid),
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
  public async findAllByMetadata(filters: SearchFilterDTO[]): Promise<Document[]> {
      if(filters.length!==0)
      {
          let builder = new SearchQueryBuilder();
          for (let filter of filters) builder.addFilter(filter);
          const uuidDocumenti = this.dbProvider.instance.prepare(builder.getResult()).all() as {uuid_documento:string}[];

          let documents: Document[] = [];
          for (const uuid of uuidDocumenti) {
              let doc = await this.findByUuid(uuid.uuid_documento);
              if (doc !== null) documents.push(doc);
          }
          return documents;
      }
        return [];
  }
}
