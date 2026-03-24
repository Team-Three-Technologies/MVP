export interface IFileService {
  findDipIndex(dir: string): Promise<string | null>;
}