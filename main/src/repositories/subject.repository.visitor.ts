import { inject } from 'tsyringe';
import { TOKENS } from '../infrastructure/di/tokens';
import { DatabaseProvider } from '../infrastructure/database/database.provider';
import { SubjectVisitor } from '../domain/subject.visitor.abstract';
import { SubjectTypeEnum } from './subject-type.enum';
import { ASSubject } from '../domain/as-subject.model';
import { PAESubject } from '../domain/pae-subject.model';
import { PAISubject } from '../domain/pai-subject.model';
import { PFSubject } from '../domain/pf-subject.model';
import { PGSubject } from '../domain/pg-subject.model';
import { SWSubject } from '../domain/sw-subject.model';

export class SubjectRepositoryVisitor implements SubjectVisitor<number> {
  constructor(
    @inject(TOKENS.DatabaseProvider)
    private readonly dbProvider: DatabaseProvider
  ) { }

  private insertBaseSubject(tipo: string): number {
    const row = this.dbProvider.instance
      .prepare(`
        INSERT INTO soggetti (tipo)
        VALUES (@tipo);
      `)
      .run({
        tipo: tipo
      });

    return Number(row.lastInsertRowid);
  }

  public visitAsSubject(subject: ASSubject): number {
    const id = this.insertBaseSubject(SubjectTypeEnum.AS);
    this.dbProvider.instance
      .prepare(`
        INSERT INTO soggetti_as (id, cognome, nome, cf, den_organizzazione, den_ufficio, indirizzi_dig_riferimento)
        VALUES (@id, @cognome, @nome, @cf, @den_org, @den_uff, @indirizzi);
      `)
      .run({
        id: id,
        cognome: subject.getSurname(),
        nome: subject.getName(),
        cf: subject.getCf(),
        den_org: subject.getOrganizationDen(),
        den_uff: subject.getOfficeDen(),
        indirizzi: subject.getDigitalAddresses().join(' ')
      });

    return id;
  }

  public visitPaeSubject(subject: PAESubject): number {
    const id = this.insertBaseSubject(SubjectTypeEnum.PAE);
    this.dbProvider.instance
      .prepare(`
        INSERT INTO soggetti_pae (id, den_amministrazione, den_ufficio, indirizzi_dig_riferimento)
        VALUES (@id, @den_amm, @den_uff, @indirizzi);
      `)
      .run({
        id: id,
        den_amm: subject.getAdministrationDen(),
        den_uff: subject.getOfficeDen(),
        indirizzi: subject.getDigitalAddresses().join(' ')
      });

    return id;
  }

  public visitPaiSubject(subject: PAISubject): number {
    const id = this.insertBaseSubject(SubjectTypeEnum.PAI);
    this.dbProvider.instance
      .prepare(`
        INSERT INTO soggetti_pai (id, den_amministrazione, codice_ipa, den_amministrazione_aoo, codice_ipa_aoo, den_amministrazione_uor, codice_ipa_uor, indirizzi_dig_riferimento)
        VALUES (@id, @den, @ipa, @den_aoo, @aoo, @den_uor, @uor, @indirizzi);
      `)
      .run({
        id: id,
        den: subject.getAdministrationDen(),
        ipa: subject.getIpaCode(),
        den_aoo: subject.getAooAdministrationDen(),
        aoo: subject.getIpaAooCode(),
        den_uor: subject.getUorAdministrationDen(),
        uor: subject.getIpaUorCode(),
        indirizzi: subject.getDigitalAddresses().join(' ')
      });

    return id;
  }

  public visitPfSubject(subject: PFSubject): number {
    const id = this.insertBaseSubject(SubjectTypeEnum.PF);
    this.dbProvider.instance
      .prepare(`
        INSERT INTO soggetti_pf (id, cognome, nome, cf, indirizzi_dig_riferimento)
        VALUES (@id, @cognome, @nome, @cf, @indirizzi);
      `)
      .run({
        id: id,
        cognome: subject.getSurname(),
        nome: subject.getName(),
        cf: subject.getCf(),
        indirizzi: subject.getDigitalAddresses().join(' ')
      });

    return id;
  }

  public visitPgSubject(subject: PGSubject): number {
    const id = this.insertBaseSubject(SubjectTypeEnum.PG);
    this.dbProvider.instance
      .prepare(`
        INSERT INTO soggetti_pg (id, den_organizzazione, p_iva, den_ufficio, indirizzi_dig_riferimento)
        VALUES (@id, @den_org, @p_iva, @den_uff, @indirizzi);
      `)
      .run({
        id: id,
        den_org: subject.getOrganizationDen(),
        p_iva: subject.getVatCode(),
        den_uff: subject.getOfficeDen(),
        indirizzi: subject.getDigitalAddresses().join(' ')
      });

    return id;
  }

  public visitSwSubject(subject: SWSubject): number {
    const id = this.insertBaseSubject(SubjectTypeEnum.SW);
    this.dbProvider.instance
      .prepare(`
        INSERT INTO soggetti_sw (id, den_sistema)
        VALUES (@id, @den_sis);
      `)
      .run({
        id: id,
        den_sis: subject.getSystemDen()
      });

    return id;
  }
}