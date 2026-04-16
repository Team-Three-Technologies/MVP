import { AiPInfoXml } from '../infrastructure/parsing/aip-info.xml';
import { ConservationProcess } from '../domain/conservation-process.model';

export class ConservationProcessMapper {
  public toDomain(aipInfoXml: AiPInfoXml): ConservationProcess {
    return new ConservationProcess(
      aipInfoXml.AiPInfo.Process['@_ark-aip:uuid'],
      new Date(aipInfoXml.AiPInfo.Process.Start.Date),
      `${String(aipInfoXml.AiPInfo.Process.PreservationSession.DocumentsStats.DocumentsOverallSize['#text'] ?? '')} ${String(aipInfoXml.AiPInfo.Process.PreservationSession.DocumentsStats.DocumentsOverallSize['@_ark-aip:unit'] ?? '')}`.trim(),
      Number(aipInfoXml.AiPInfo.Process.PreservationSession.DocumentsStats.SipCount),
      Number(aipInfoXml.AiPInfo.Process.PreservationSession.DocumentsStats.DocumentsCount),
      Number(aipInfoXml.AiPInfo.Process.PreservationSession.DocumentsStats.DocumentsFilesCount),
      aipInfoXml.AiPInfo.Process.DocumentClass['@_ark-aip:uuid'],
    );
  }
}
