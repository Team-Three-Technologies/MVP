import { ExportFileResponseDTO } from '../../../shared/response/export-file.response';

export interface ExportFileUseCase {
  execute(documentUuid: string, fileUuid: string | undefined): Promise<ExportFileResponseDTO>;
}
