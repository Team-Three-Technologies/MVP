export interface IpcResponse<T = void> {
  data: T | null;
  error: string | null;
}

export function ok<T>(data: T): IpcResponse<T> {
  return { data, error: null };
}

export function fail(message: string): IpcResponse<never> {
  return { data: null, error: message };
}