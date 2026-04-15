export class File {
  constructor(
    private uuid: string,
    private path: string,
    private size: string
  ) { }

  public getUuid(): string {
    return this.uuid;
  }

  public getPath(): string {
    return this.path;
  }

  public getSize(): string {
    return this.size;
  }

  public setUuid(uuid: string): void {
    this.uuid = uuid;
  }

  public setPath(path: string): void {
    this.path = path;
  }

  public setSize(size: string): void {
    this.size = size;
  }

  public getFilename(): string {
    const full = this.getBasename();
    const i = full.lastIndexOf('.');
    if (i <= 0) return full;
    return full.slice(0, i);
  }

  public getExtension(): string {
    const full = this.getBasename();
    const i = full.lastIndexOf('.');
    if (i <= 0 || i === full.length - 1) return '';
    return full.slice(i + 1).toLowerCase();
  }

  private getBasename(): string {
    const normalized = this.path.replace(/\\/g, '/');
    const parts = normalized.split('/');
    return parts[parts.length - 1] ?? '';
  }
}