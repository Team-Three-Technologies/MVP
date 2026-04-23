export interface FileExternalPreviewUseCase {
  execute(documentUuid: string, fileUuid: string | undefined): Promise<void>;
}
