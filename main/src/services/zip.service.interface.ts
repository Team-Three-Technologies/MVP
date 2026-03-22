export interface IZipService {
  extract(zipPath: string, destPath: string): Promise<void>
}