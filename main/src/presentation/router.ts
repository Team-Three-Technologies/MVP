import { container } from 'tsyringe';
import { ipcMain } from 'electron';
import { DipHandler } from './dip.handler';
import { DocumentHandler } from './document.handler';
import { IPC_CHANNELS } from '../../../shared/ipc-channels';
import { DipRequestDTO } from '../../../shared/request/dip.request.dto';
import { DocumentRequestDTO } from '../../../shared/request/document.request.dto';
import { FileRequestDTO } from '../../../shared/request/file.request.dto';
import { SearchRequestDTO } from '../../../shared/request/search.request.dto';

export function registerAllHandlers(): void {
  const dipHandler = container.resolve(DipHandler);
  const documentHandler = container.resolve(DocumentHandler);

  ipcMain.handle(IPC_CHANNELS.DIP_AUTO_IMPORT, () => dipHandler.autoImport());
  ipcMain.handle(IPC_CHANNELS.DIP_CONTENT, (_, dipRequestDto: DipRequestDTO) =>
    dipHandler.getDipContent(dipRequestDto),
  );
  ipcMain.on(IPC_CHANNELS.DIP_CHECK_INTEGRITY, (event, dipRequestDto: DipRequestDTO) =>
    dipHandler.checkDipIntegrity(event, dipRequestDto),
  );

  ipcMain.handle(IPC_CHANNELS.DOCUMENT_DETAILS, (_, documentRequestDto: DocumentRequestDTO) =>
    documentHandler.getDocumentDetails(documentRequestDto),
  );
  ipcMain.handle(IPC_CHANNELS.DOCUMENT_METADATA_SEARCH, (_, searchRequestDto: SearchRequestDTO) =>
    documentHandler.searchDocuments(searchRequestDto),
  );
  ipcMain.handle(IPC_CHANNELS.DOCUMENT_FILE_INTERNAL_PREVIEW, (_, fileRequestDto: FileRequestDTO) =>
    documentHandler.fileInternalPreview(fileRequestDto),
  );
  ipcMain.handle(IPC_CHANNELS.DOCUMENT_FILE_EXTERNAL_PREVIEW, (_, fileRequestDto: FileRequestDTO) =>
    documentHandler.fileExternalPreview(fileRequestDto),
  );
  ipcMain.handle(IPC_CHANNELS.DOCUMENT_EXPORT_FILE, (_, fileRequestDto: FileRequestDTO) =>
    documentHandler.exportFile(fileRequestDto),
  );
}
