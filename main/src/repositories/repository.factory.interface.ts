import { IDipRepository } from './dip.repository.interface';

export interface IRepositoryFactory {
  createDipRepository(dipUuid: string): IDipRepository;
}