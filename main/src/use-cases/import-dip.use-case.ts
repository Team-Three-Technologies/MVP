export interface ImportDipUseCase {
  execute(dipPath: string): Promise<void>;
}