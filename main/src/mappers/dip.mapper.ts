import { injectable } from 'tsyringe';
import { PackageInfoXml } from '../infrastructure/parsing/dip-index.xml';
import { Dip } from '../domain/dip.model';

@injectable()
export class DipMapper {
  public toDomain(packageInfo: PackageInfoXml): Dip {
    return new Dip(
      packageInfo.ProcessUUID,
      new Date(packageInfo.CreationDate),
      Number(packageInfo.DocumentsCount),
      Number(packageInfo.AiPCount),
    );
  }
}
