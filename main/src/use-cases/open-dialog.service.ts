import { injectable } from 'tsyringe';
import { dialog } from 'electron';
import { OpenDialogUseCase } from './open-dialog.use-case';

@injectable()
export class OpenDialogService implements OpenDialogUseCase {
  async execute(): Promise<string | null> {
    const result = await dialog.showOpenDialog({
      title: 'Seleziona un DIP',
      filters: [{ name: 'Archivio ZIP', extensions: ['zip'] }],
      properties: ['openFile']
    });

    if (result.canceled) return null;
    return result.filePaths[0];
  }
}