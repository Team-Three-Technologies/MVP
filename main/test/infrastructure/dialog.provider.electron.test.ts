import { vi } from 'vitest';

vi.mock('electron', () => ({
  dialog: {
    showSaveDialog: vi.fn(),
  },
}));

import { describe, it, expect, beforeEach } from 'vitest';
import { ElectronDialogProvider } from '../../src/infrastructure/dialog/dialog.provider.electron';
import { dialog } from 'electron';

describe('ElectronDialogProvider', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('selectSavePath() ritorna il path quando viene selezionato un file', async () => {
    vi.mocked(dialog.showSaveDialog).mockResolvedValue({
      canceled: false,
      filePath: '/tmp/file.txt',
    });

    const provider = new ElectronDialogProvider();

    const result = await provider.selectSavePath('file.txt');
    expect(dialog.showSaveDialog).toHaveBeenCalledWith({
      defaultPath: 'file.txt',
    });
    expect(result).toBe('/tmp/file.txt');
  });

  it("selectSavePath() ritorna null quando l'operazione viene cancellata (cancelled == true)", async () => {
    vi.mocked(dialog.showSaveDialog).mockResolvedValue({
      canceled: true,
      filePath: '',
    });

    const provider = new ElectronDialogProvider();

    const result = await provider.selectSavePath('file.txt');
    expect(dialog.showSaveDialog).toHaveBeenCalledWith({
      defaultPath: 'file.txt',
    });
    expect(result).toBeNull();
  });

  it("selectSavePath() ritorna null quando l'operazione viene cancellata (filePath == '')", async () => {
    vi.mocked(dialog.showSaveDialog).mockResolvedValue({
      canceled: false,
      filePath: '',
    });

    const provider = new ElectronDialogProvider();

    const result = await provider.selectSavePath('file.txt');
    expect(dialog.showSaveDialog).toHaveBeenCalledWith({
      defaultPath: 'file.txt',
    });
    expect(result).toBeNull();
  });
});
