import { AutoImportDipResponseDTO } from '../../../shared/response/auto-import-dip.response.dto';

export interface AutoImportDipUseCase {
  execute(): Promise<AutoImportDipResponseDTO>;
}