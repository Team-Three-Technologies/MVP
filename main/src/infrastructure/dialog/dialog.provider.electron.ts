import { injectable } from 'tsyringe';
import { DialogProvider } from './dialog.provider.interface';
import { dialog } from 'electron';

@injectable()
export class ElectronDialogProvider implements DialogProvider {
  public async selectSavePath(fileName: string): Promise<string | null> {
    const result = await dialog.showSaveDialog({ defaultPath: fileName });
    if (result.canceled || !result.filePath) return null;
    return result.filePath;
  }
}
