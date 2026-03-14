import { container } from 'tsyringe';
import { DocumentHandler } from './document.handler';

export function registerAllHandlers(): void {
  container.resolve(DocumentHandler).register();
}