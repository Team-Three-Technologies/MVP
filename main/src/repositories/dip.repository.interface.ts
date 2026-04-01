import { Dip } from '../domain/dip.model';

export interface DipRepository {
  save(dip: Dip): Dip;
  findByUuid(uuid: string): Dip | null;
  findAll(): Dip[];
}