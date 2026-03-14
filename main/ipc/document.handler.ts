import { injectable, inject } from 'tsyringe';
import { TOKENS } from '../infrastructure/tokens';
import { ok, fail } from '../../shared/ipc-response';
import type { DocumentUseCase } from '../use-cases/document.use-case';
import type { IpcResponse } from '../../shared/ipc-response';
import type { DocumentDto, CreateDocumentDto } from '../../shared/dto';

@injectable()
export class DocumentHandler {
  constructor(
    @inject(TOKENS.DocumentUseCase)
    private readonly useCase: DocumentUseCase
  ) { }

  list(): IpcResponse<DocumentDto[]> {
    try {
      return ok(this.useCase.findAll());
    } catch (e) {
      return fail((e as Error).message);
    }
  }

  save(dto: CreateDocumentDto): IpcResponse<DocumentDto> {
    try {
      return ok(this.useCase.save(dto));
    } catch (e) {
      return fail((e as Error).message);
    }
  }

  delete(id: string): IpcResponse<null> {
    try {
      this.useCase.delete(id);
      return ok(null);
    } catch (e) {
      return fail((e as Error).message);
    }
  }

}