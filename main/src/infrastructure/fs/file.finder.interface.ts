export interface FileFinder {
  findDipIndex(dir: string): Promise<string | null>;
  findAipInfo(dir: string): Promise<string | null>;
}