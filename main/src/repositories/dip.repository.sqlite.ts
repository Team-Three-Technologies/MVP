import { inject, injectable } from 'tsyringe';
import { TOKENS } from '../infrastructure/di/tokens';
import { DipRepository } from './dip.repository.interface';
import { DatabaseProvider } from '../infrastructure/database/database.provider';
import { Dip,Document, DocumentClass, ConservationProcess} from '../domain/dip-structure.barrel'
import { DipRow } from './dip.row'

@injectable()
export class SQLiteDipRepository implements DipRepository {
    constructor(
        @inject(TOKENS.DatabaseProvider)
        private readonly dbProvider: DatabaseProvider
    ) { }

    public save(dip: Dip, documentClass: DocumentClass[], conservationProcesses: ConservationProcess[], documents:Document[]): void {

        this.dbProvider.istance
        .prepare(`
                 INSERT INTO archivi_dip (uuid_processo, data_creazione, numero_documenti, numero_aip)
                 VALUES (@uuid, @date, @docsCount, @aipCount);
                 `)
                 .run({
                     uuid: dip.getProcessUuid(),
                     date: dip.getCreationDate().toISOString(),
                     docsCount: dip.getDocumentsCount(),
                     aipCount: dip.getAipCount()
                 });


        let query =`INSERT INTO classi_documentali 
                    (uuid, nome, versione, valida_da, valida_fino, uuid_dip)
                    VALUES 
                    (@uuid, @nome, @versione, @valida_da, @valida_fino, @uuid_dip);`;
        let insert = this.dbProvider.istance.prepare(query);

        for(const docClass of documentClass) {
            insert.run({
                      uuid: docClass.getUuid(),
                      nome: docClass.getName(),
                      versione: docClass.getVersion(),
                      valida_da: docClass.getValidFrom(),
                      valida_fino: docClass.getValidTo(),
                      uuid_dip: docClass.getDipUuid()
                   });
        }

        query=`INSERT INTO processi_conservazione 
               (uuid, data_creazione, dimensione_totale, numero_sip, numero_documenti, numero_file_documenti, uuid_classe_documentale)
               VALUES 
               (@uuid,@data_creazione, @dim_tot, @n_sip, @n_doc, @n_file_doc, @uuid_classeDoc);`;
        insert = this.dbProvider.istance.prepare(query);

        for (let consProc of conservationProcesses)
        {
            insert.run({
                uuid:consProc.getUuid(),
                data_creazione:consProc.getCreationDate(),
                dim_tot:consProc.getTotalSize(),
                n_sip:consProc.getSipCount(),
                n_doc:consProc.getDocumentsCount(),
                n_file_doc:consProc.getFilesCount(),
                uuid_classeDoc: consProc.getDocumentClassUuid()
            });
        }

        // INSERIMENTO DEI DOCUMENTI
        for(let doc of documents)
        {
            query=`INSERT INTO documenti
                   (uuid, percorso, uuid_processo_conservazione)
                   VALUES
                   ()`;

        }


    }

    /*
        public removeDip(uuid: string): void {

    }
    public getDip(uuid: string): Dip {
    }
    public getDocument(uuid: string): Document {

    }

    public getDocsFromDip(dipUuid: string): Document[] {

    }

    public searchDocuments(filters: Map<string, any>): Document[] {

    }

    */
    public findByUuid(uuid: string): Dip | null {
        const row = this.dbProvider.istance
        .prepare(`
                 SELECT * FROM archivi_dip
                 WHERE uuid_processo = ?
                     `)
                 .get(uuid) as DipRow;

                 return row ? new Dip(row.uuid_processo, new Date(row.data_creazione), row.numero_documenti, row.numero_aip) : null;
    }

    public findAll(): Dip[] {
        const rows = this.dbProvider.istance
        .prepare(`SELECT * FROM archivi_dip;`)
        .all() as DipRow[];

        return rows.map((row: DipRow) => {
            return new Dip(row.uuid_processo, new Date(row.data_creazione), row.numero_documenti, row.numero_aip);
        });
    }
}
