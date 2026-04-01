export interface FileService {
  findDipIndex(dir: string): Promise<string | null>;
}