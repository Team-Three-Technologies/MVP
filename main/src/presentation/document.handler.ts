import { inject, injectable } from 'tsyringe';
import { TOKENS } from '../infrastructure/di/tokens';
import { IpcResponse } from '../../../shared/ipc-response';
import { ok, fail } from './ipc-response.utils';
import { GetDocumentDetailsUseCase } from '../application/get-document-details.use-case';
import { DocumentRequestDTO } from '../../../shared/document.request.dto';

@injectable()
export class DocumentHandler {
  constructor(
    @inject(TOKENS.GetDocumentDetailsUseCase)
    private readonly getDocumentDetailsUseCase: GetDocumentDetailsUseCase
  ) { }

  public async getDocumentDetails(documentRequestDto: DocumentRequestDTO): Promise<IpcResponse<void>> {
    try {
      const document = await this.getDocumentDetailsUseCase.execute(documentRequestDto.documentUuid);
      return ok(undefined);
    } catch (e) {
      return fail((e as Error).message);
    }
  }
}