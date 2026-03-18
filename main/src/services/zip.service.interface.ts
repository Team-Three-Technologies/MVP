export interface IZipService {
  extract(zipPath: string): Promise<string>
}