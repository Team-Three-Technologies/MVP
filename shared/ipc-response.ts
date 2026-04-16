export interface IpcResponse<T = void> {
  data: T | null;
  error: string | null;
}
