import { injectable } from 'tsyringe';
import { Dip } from '../domain/dip.model';

@injectable()
export class DipMapper {
  public toDomain(packageInfo: any): Dip {
    return new Dip(
      packageInfo.ProcessUUID,
      new Date(packageInfo.CreationDate),
      Number(packageInfo.DocumentsCount),
      Number(packageInfo.AiPCount),
    );
  }
}
