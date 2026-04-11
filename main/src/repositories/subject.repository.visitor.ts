import { SubjectVisitor } from '../domain/subject.visitor.abstract';
import { PAESubject } from '../domain/pae-subject.model';
import { PAISubject } from '../domain/pai-subject.model';
import { PFSubject } from '../domain/pf-subject.model';
import { PGSubject } from '../domain/pg-subject.model';
import { SWSubject } from '../domain/sw-subject.model';
import { ASSubject } from '../domain/as-subject.model';
import {SubjectTypeEnum} from '../domain/subject-type.enum';
import { TOKENS } from '../infrastructure/di/tokens';
import { DatabaseProvider } from '../infrastructure/database/database.provider';
import { inject, injectable } from 'tsyringe';

export class SubjectRepositoryVisitor extends SubjectVisitor{
    constructor(
        @inject(TOKENS.DatabaseProvider)
        private readonly dbProvider: DatabaseProvider
    ) 
    { 
        super();
    }

    private insertBaseSubject(id:number, tipo:string): void{
        this.dbProvider.instance
            .prepare(`INSERT INTO soggetti(id,tipo)
                     VALUES (@id, @tipo);
            `)
            .run({
                id: id,
                tipo: tipo
            });
    }

    public visitAsSubject(subject: ASSubject): void {
        this.insertBaseSubject(subject.getId(),SubjectTypeEnum.AS);
        this.dbProvider.instance
            .prepare(`INSERT INTO soggetto_as
                     (id, cognome, nome, cf, den_organizzazione, den_ufficio, indirizzo_dig_riferimento)
                     VALUES (@id,@cognome, @nome, @cf, @den_org, @den_uff, @indirizzo);
            `)
            .run({
                id: subject.getId(),
                cognome: subject.getSurname(),
                nome: subject.getName(),
                cf: subject.getCf(),
                den_org: subject.getOrganizationDen(),
                den_uff: subject.getOfficeDen(),
                indirizzo: subject.getDigitalAddresses()
            });
    }

    public visitPaeSubject(subject: PAESubject): void {
        this.insertBaseSubject(subject.getId(),SubjectTypeEnum.PAE);
        this.dbProvider.instance
            .prepare(`INSERT INTO soggetto_pae
                     (id, den_amministrazione, den_ufficio, indirizzo_dig_riferimento)
                     VALUES (@id, @den_amm, @den_uff, @indirizzo);
            `)
            .run({
                id: subject.getId(),
                den_amm: subject.getAdministrationDen(),
                den_uff: subject.getOfficeDen(),
                indirizzo: subject.getDigitalAddresses()
            });

    }

    public visitPaiSubject(subject: PAISubject): void {
        this.insertBaseSubject(subject.getId(),SubjectTypeEnum.PAI);
        this.dbProvider.instance
            .prepare(`INSERT INTO soggetto_pai
                     (id, codice_ipa, codice_ipa_aoo, codice_ipa_uor, indirizzo_dig_riferimento)
                     VALUES (@id, @ipa, @aoo, @uor, @indirizzo);
            `)
            .run({
                id: subject.getId(), 
                ipa: subject.getIpaCode(),
                aoo: subject.getIpaAooCode(),
                uor: subject.getIpaUorCode(),
                indirizzo: subject.getDigitalAddresses()
            });
   
    }

    public visitPfSubject(subject: PFSubject): void {
        this.insertBaseSubject(subject.getId(),SubjectTypeEnum.PF);
        this.dbProvider.instance
            .prepare(`INSERT INTO soggetto_pf
                     (id, cognome, nome, cf, indirizzo_dig_riferimento)
                     VALUES (@id, @cognome, @nome, @cf, @indirizzo);
            `)
            .run({
                id: subject.getId(),
                cognome: subject.getSurname(),
                nome: subject.getName(),
                cf:subject.getCf(),
                indirizzo: subject.getDigitalAddresses()
            });
    }

    public visitPgSubject(subject: PGSubject): void {
        this.insertBaseSubject(subject.getId(),SubjectTypeEnum.PG);
        this.dbProvider.instance
            .prepare(`INSERT INTO soggetto_pg
                     (id, den_organizzazione, p_iva, den_ufficio, indirizzo_dig_riferimento)
                     VALUES (@id, @den_org, @p_iva, @den_uff, @indirizzo);
            `)
            .run({
                id: subject.getId(),
                den_org: subject.getOrganizationDen(),
                p_iva: subject.getVatCode(),
                den_uff: subject.getOfficeDen(),
                indirizzo: subject.getDigitalAddresses()
            });
    }

    public visitSWSubject(subject: SWSubject): void {
        this.insertBaseSubject(subject.getId(),SubjectTypeEnum.SW);
        this.dbProvider.instance
            .prepare(`INSERT INTO soggetto_sw
                     (id, den_sistema)
                     VALUES (@id, @den_sis);
            `)
            .run({
                id: subject.getId(),
                den_sis: subject.getSystemDen()
            });
    }

}
