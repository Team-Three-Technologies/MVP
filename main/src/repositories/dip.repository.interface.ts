import { Dip } from '../models/dip.model';

export interface IDipRepository {
  save(dip: Dip): Dip;
}