import { vi } from 'vitest';

vi.mock('electron', () => ({
  shell: {
    openPath: vi.fn(),
  },
}));

import { describe, it, expect, beforeEach } from 'vitest';
import { ElectronShellProvider } from '../../src/infrastructure/shell/shell.provider.electron';
import { shell } from 'electron';

describe('ElectronShellProvider', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('openFile() ritorna quando viene aperto il file', async () => {
    vi.mocked(shell.openPath).mockResolvedValue('');

    const electronShellProvider = new ElectronShellProvider();

    await electronShellProvider.openFile('file.txt');
    expect(shell.openPath).toHaveBeenCalledWith('file.txt');
  });

  it('openFile() lancia un errore quando non viene aperto il file', async () => {
    vi.mocked(shell.openPath).mockResolvedValue('File not found');

    const electronShellProvider = new ElectronShellProvider();

    await expect(electronShellProvider.openFile('file.txt')).rejects.toThrow(
      'Impossibile aprire il file: File not found',
    );
    expect(shell.openPath).toHaveBeenCalledWith('file.txt');
  });
});
