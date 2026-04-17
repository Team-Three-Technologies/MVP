export interface Base64Provider {
  decodeToBytes(base64: string): Buffer;
}
