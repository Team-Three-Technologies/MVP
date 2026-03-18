export interface OpenDialogUseCase {
  execute(): Promise<string | null>;
}