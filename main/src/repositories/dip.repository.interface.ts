import { Dip } from '../domain/dip.model';
import { UUID } from '../domain/value-objects/uuid.value-object';

export interface DipRepository {
  save(dip: Dip): Dip;
  findByUuid(uuid: UUID): Dip | null;
  findAll(): Dip[];
}