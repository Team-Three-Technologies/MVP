export interface HashService {
  compute(filePath: string): Promise<string>;
}