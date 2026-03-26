import { UUID } from '../value-objects/uuid.value-object';

export class File {
  constructor(
    private uuid: UUID,
    private path: string,
    private extension: string,
    private size: string
  ) { }

  getUuid(): UUID {
    return this.uuid;
  }

  getPath(): string {
    return this.path;
  }

  getExtension(): string {
    return this.extension;
  }

  getSize(): string {
    return this.size;
  }

  setUuid(uuid: UUID): void {
    this.uuid = uuid;
  }

  setPath(path: string): void {
    this.path = path;
  }

  setExtension(extension: string): void {
    this.extension = extension;
  }

  setSize(size: string): void {
    this.size = size;
  }
}