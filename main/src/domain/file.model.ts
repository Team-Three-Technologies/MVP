export class File {
  constructor(
    private uuid: string,
    private path: string,
    private size: string
  ) { }

  getUuid(): string {
    return this.uuid;
  }

  getPath(): string {
    return this.path;
  }

  getSize(): string {
    return this.size;
  }

  setUuid(uuid: string): void {
    this.uuid = uuid;
  }

  setPath(path: string): void {
    this.path = path;
  }

  setSize(size: string): void {
    this.size = size;
  }
}