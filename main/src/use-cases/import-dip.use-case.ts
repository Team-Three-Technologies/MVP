export interface ImportDiPUseCase {
  execute(dipPath: string): Promise<void>;
}