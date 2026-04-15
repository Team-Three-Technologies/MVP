import { container } from "tsyringe";
import { ipcMain, IpcMainInvokeEvent } from "electron";
import { IPC_CHANNELS } from "../../ipc-channels";
import { DipHandler } from "./dip.handler";

export function registerAllHandlers(): void {
  const dipHandler = container.resolve(DipHandler);

  ipcMain.handle(IPC_CHANNELS.DIP_AUTO_IMPORT, () => dipHandler.autoImport());
  // TODO: connect these to actual DipHandler methods when implemented
  ipcMain.handle(
    IPC_CHANNELS.DIP_LOAD_DOCUMENTS,
    (_: IpcMainInvokeEvent) => [],
  );
  ipcMain.handle(
    IPC_CHANNELS.DIP_SEARCH_DOCUMENTS,
    (_: IpcMainInvokeEvent, filters: unknown) => [],
  );
  ipcMain.handle(
    IPC_CHANNELS.DIP_LOAD_DOCUMENT_FILE,
    (_: IpcMainInvokeEvent, filePath: string) =>
      dipHandler.loadDocumentFile(filePath),
  );
  ipcMain.handle(
    IPC_CHANNELS.DIP_LOAD_DIP_INFO,
    () => dipHandler.loadDipInfo(),
  );
}
