export interface ShellProvider {
  openFile(path: string): Promise<void>;
}
