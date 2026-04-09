import { AiPXml } from '../infrastructure/parsing/dip-index.xml';
import { ConservationProcess } from '../domain/conservation-process.model';

export class ConservationProcessMapper {
  public toDomain(aipXml: AiPXml, documentClassUuid: string): ConservationProcess {
    return new ConservationProcess(aipXml['@_uuid'], new Date(), '', 0, 0, 0, documentClassUuid);
  }
}
