export interface DeleteDipUseCase {
  execute(dipUuid: string): Promise<void>;
}
