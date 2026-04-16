import { IpcResponse } from '../../../shared/ipc-response';

export function ok<T>(data: T): IpcResponse<T> {
  return { data, error: null };
}

export function fail(message: string): IpcResponse<never> {
  return { data: null, error: message };
}
