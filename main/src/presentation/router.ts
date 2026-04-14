import { container } from 'tsyringe';
import { ipcMain } from 'electron';
import { DipHandler } from './dip.handler';
import { DocumentHandler } from './document.handler';
import { IPC_CHANNELS } from '../../ipc-channels';
import { DocumentRequestDTO } from '../../../shared/document.request.dto';

export function registerAllHandlers(): void {
  const dipHandler = container.resolve(DipHandler);
  const documentHandler = container.resolve(DocumentHandler);

  ipcMain.handle(IPC_CHANNELS.DIP_AUTO_IMPORT, () => dipHandler.autoImport());

  ipcMain.handle(IPC_CHANNELS.DOCUMENT_DETAILS, (_, documentRequestDto: DocumentRequestDTO) => documentHandler.getDocumentDetails(documentRequestDto));
}