import { ConservationProcess } from '../domain/conservation-process.model';

export interface ConservationProcessRepository {
  save(conservationProcess: ConservationProcess): Promise<ConservationProcess>;
}
