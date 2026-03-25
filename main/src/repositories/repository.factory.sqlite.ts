import { inject, injectable } from 'tsyringe';
import { TOKENS } from '../infrastructure/tokens';
import { IRepositoryFactory } from './repository.factory.interface';
import { IDipRepository } from './dip.repository.interface';
import { DatabaseProvider } from '../infrastructure/database.provider';
import { SQLiteDipRepository } from './dip.repository.sqlite';

@injectable()
export class SQLiteRepositoryFactory implements IRepositoryFactory {
  private dipRepositories = new Map<string, SQLiteDipRepository>();

  constructor(
    @inject(TOKENS.DatabaseProvider)
    private readonly databaseProvider: DatabaseProvider
  ) { }

  createDipRepository(dipUuid: string): IDipRepository {
    if (this.dipRepositories.has(dipUuid)) {
      return this.dipRepositories.get(dipUuid)!;
    }

    const repo = new SQLiteDipRepository(this.databaseProvider.getDb(dipUuid));
    this.dipRepositories.set(dipUuid, repo);
    
    return repo;
  }
}