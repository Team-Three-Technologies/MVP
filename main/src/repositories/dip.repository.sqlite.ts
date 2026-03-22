import { inject, injectable } from 'tsyringe';
import { IDipRepository } from './dip.repository.interface';
import { Dip } from '../models/dip.model'
import { DipRow } from './dip.row'
import { DatabaseProvider } from '../infrastructure/database.provider';

@injectable()
export class SQLiteDipRepository implements IDipRepository {
  constructor(
    @inject(DatabaseProvider) private readonly db: DatabaseProvider
  ) { }

  save(dip: Dip): Dip {
    this.db.instance
      .prepare(`
        INSERT INTO pacchetti_dip (hash, uuid_processo, data_creazione, numero_documenti, numero_aip)
        VALUES (@hash, @uuid, @date, @docsCount, @aipCount)
      `)
      .run({
        hash: dip.hash,
        uuid: dip.uuid,
        date: dip.creationDate.toISOString(),
        docsCount: dip.docsCount,
        aipCount: dip.aipCount
      });
    return dip;
  }

  findByHash(hash: string): Dip | null {
    const row = this.db.instance
      .prepare('SELECT * FROM pacchetti_dip WHERE hash = ?')
      .get(hash) as DipRow;

    return row ? {
      hash: row.hash,
      uuid: row.uuid_processo,
      creationDate: new Date(row.data_creazione),
      docsCount: row.numero_documenti,
      aipCount: row.numero_aip
    } : null;
  }
}