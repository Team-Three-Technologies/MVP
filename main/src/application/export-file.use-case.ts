export interface ExportFileUseCase {
  execute(documentUuid: string, fileUuid: string | undefined): Promise<string>;
}
