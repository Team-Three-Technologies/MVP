export class DocumentClass {
  constructor(
    private uuid: string,
    private name: string,
    private version: string,
    private validFrom: Date,
    private validTo: Date | undefined,
    private dipUuid: string
  ) { }

  public getUuid(): string {
    return this.uuid;
  }

  public getName(): string {
    return this.name;
  }

  public getVersion(): string {
    return this.version;
  }

  public getValidFrom(): Date {
    return this.validFrom;
  }

  public getValidTo(): Date | undefined {
    return this.validTo;
  }

  public getDipUuid(): string {
    return this.dipUuid;
  }

  public setUuid(uuid: string): void {
    this.uuid = uuid;
  }

  public setName(name: string): void {
    this.name = name;
  }

  public setVersion(version: string): void {
    this.version = version;
  }

  public setValidFrom(validFrom: Date): void {
    this.validFrom = validFrom;
  }

  public setValidTo(validTo: Date): Date | void {
    this.validTo = validTo;
  }

  public setDipUuid(dipUuid: string): void {
    this.dipUuid = dipUuid;
  }
}