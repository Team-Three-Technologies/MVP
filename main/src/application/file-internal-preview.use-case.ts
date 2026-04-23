import { FileInternalPreviewResponseDTO } from '../../../shared/response/file-internal-preview.response.dto';

export interface FileInternalPreviewUseCase {
  execute(
    documentUuid: string,
    fileUuid: string | undefined,
  ): Promise<FileInternalPreviewResponseDTO>;
}
