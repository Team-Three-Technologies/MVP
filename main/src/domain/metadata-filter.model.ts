export class MetadataFilter {
  constructor(
    private type: string,
    private value: string,
  ) {}

  public getType(): string {
    return this.type;
  }

  public getValue(): string {
    return this.value;
  }

  public setType(type: string): void {
    this.type = type;
  }

  public setValue(value: string): void {
    this.value = value;
  }
}
