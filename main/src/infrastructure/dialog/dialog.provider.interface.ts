export interface DialogProvider {
  selectSavePath(fileName: string): Promise<string | null>;
}
