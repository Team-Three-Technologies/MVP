import { inject, injectable } from 'tsyringe';
import { TOKENS } from '../infrastructure/tokens';
import { ok, fail, IpcResponse } from '../../../shared/ipc-response';

@injectable()
export class DialogHandler {
  constructor() { }
}