import { ConservationProcess } from '../domain/conservation-process.model';

export interface ConservationProcessRepository {
  save(conservationProcess: ConservationProcess): Promise<ConservationProcess>;
  findAllByDipUuid(dipUuid: string): Promise<ConservationProcess[]>;
  findAllByDocumentClassUuid(documentClassUuid: string): Promise<ConservationProcess[]>;
}