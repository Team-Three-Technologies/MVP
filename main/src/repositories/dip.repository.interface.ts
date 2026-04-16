import { Dip } from '../domain/dip.model';

export interface DipRepository {
  save(dip: Dip): Promise<Dip>;
  findByUuid(uuid: string): Promise<Dip | null>;
}
