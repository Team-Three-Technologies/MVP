import { DiPIndexXml } from '../infrastructure/parsing/dip-index.xml';
import { Dip } from '../domain/dip.model';

export class DipMapper {
  toDomain(dipIndexXml: DiPIndexXml): Dip {
    return new Dip(
      dipIndexXml.DiPIndex.PackageInfo.ProcessUUID,
      new Date(dipIndexXml.DiPIndex.PackageInfo.CreationDate),
      Number(dipIndexXml.DiPIndex.PackageInfo.DocumentsCount),
      Number(dipIndexXml.DiPIndex.PackageInfo.AiPCount)
    );
  }
}