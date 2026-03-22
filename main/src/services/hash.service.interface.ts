export interface IHashService {
  compute(filePath: string): Promise<string>;
}