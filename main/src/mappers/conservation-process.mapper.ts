import { injectable } from 'tsyringe';
import { ConservationProcess } from '../domain/conservation-process.model';

@injectable()
export class ConservationProcessMapper {
  public toDomain(aipInfoXml: any): ConservationProcess {
    return new ConservationProcess(
      aipInfoXml.AiPInfo.Process['@_ark-aip:uuid'],
      new Date(aipInfoXml.AiPInfo.Process.Start.Date),
      `${String(aipInfoXml.AiPInfo.Process.PreservationSession.DocumentsStats.DocumentsOverallSize['#text'] ?? '')} ${String(aipInfoXml.AiPInfo.Process.PreservationSession.DocumentsStats.DocumentsOverallSize['@_ark-aip:unit'] ?? '')}`.trim(),
      Number(aipInfoXml.AiPInfo.Process.PreservationSession.DocumentsStats.SipCount),
      Number(aipInfoXml.AiPInfo.Process.PreservationSession.DocumentsStats.DocumentsCount),
      Number(aipInfoXml.AiPInfo.Process.PreservationSession.DocumentsStats.DocumentsFilesCount),
      aipInfoXml.AiPInfo.Process.DocumentClass['@_ark-aip:uuid'],
      aipInfoXml.AiPInfo.Process.DocumentClass.Version,
    );
  }
}
