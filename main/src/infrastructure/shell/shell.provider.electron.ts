import { injectable } from 'tsyringe';
import { ShellProvider } from './shell.provider.interface';
import { shell } from 'electron';

@injectable()
export class ElectronShellProvider implements ShellProvider {
  public async openFile(path: string): Promise<void> {
    const error = await shell.openPath(path);
    if (error) throw new Error(`Impossibile aprire il file: ${error}`);
  }
}
