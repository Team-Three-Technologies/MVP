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


export class SubjectRepositoryVisitor extends SubjectVisitor{
    constructor(
        @inject(TOKENS.DatabaseProvider)
        private readonly dbProvider: DatabaseProvider
    ) 
    { 
        super();
    }

    public visitAsSubject(subject: ASSubject): void {
        this.dbProvider.instance
            .prepare(`INSERT INTO soggetti(id,tipo)
                     VALUES (@id, @tipo);
            `)
            .run({
                id: subject.getId(),
                tipo: SubjectTypeEnum.AS
            });

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
        this.dbProvider.instance
            .prepare(`INSERT INTO soggetti(id,tipo)
                     VALUES (@id, @tipo);
            `)
            .run({
                id: subject.getId(),
                tipo: SubjectTypeEnum.PAE
            });

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
         this.dbProvider.instance
            .prepare(`INSERT INTO soggetti(id,tipo)
                     VALUES (@id, @tipo);
            `)
            .run({
                id: subject.getId(),
                tipo: SubjectTypeEnum.PAI
            });

        this.dbProvider.instance
            .prepare(`INSERT INTO soggetto_pai
                     (id, codice_ipa, codice_ipa_aoo, codice_ipa_uor, indirizzo_dig_riferimento)
                     VALUES (@id, @ipa, @aoo, @uor, @indirizzo);
            `)
            .run({
                id: subject.getId(),
                indirizzo: subject.getDigitalAddresses()
            });

   
    }

    public visitPfSubject(subject: PFSubject): void {
        
    }

    public visitPgSubject(subject: PGSubject): void {
        
    }

    public visitSWSubject(subject: SWSubject): void {
        
    }

}
