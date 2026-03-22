export interface OpenZipDialogUseCase {
  execute(): Promise<string | null>;
}