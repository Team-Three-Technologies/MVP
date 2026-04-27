import { Dip } from '../domain/dip.model';

export interface DipRepository {
  save(dip: Dip): Promise<Dip>;
  deleteByUuid(uuid: string): Promise<void>;
  findByUuid(uuid: string): Promise<Dip | null>;
}
