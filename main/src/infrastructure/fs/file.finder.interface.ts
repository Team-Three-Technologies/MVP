export interface FileFinder {
  getStartDir(): string;
  findDipIndex(dir: string): Promise<string | null>;
  findAipInfo(dir: string): Promise<string | null>;
}
