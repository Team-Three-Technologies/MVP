export interface ZipImportDipUseCase {
  execute(dipPath: string): Promise<void>;
}