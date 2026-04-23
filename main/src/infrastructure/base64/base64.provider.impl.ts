import { injectable } from 'tsyringe';
import { Base64Provider } from './base64.provider.interface';
import { Buffer } from 'node:buffer';

@injectable()
export class Base64ProviderImpl implements Base64Provider {
  public decodeToBytes(base64: string): Buffer {
    return Buffer.from(base64, 'base64');
  }
}
