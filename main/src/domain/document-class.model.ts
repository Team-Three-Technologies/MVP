import { UUID } from './value-objects/uuid.value-object';

export class DocumentClass {
  constructor(
    private uuid: UUID,
    private name: string,
    private version: string,
    private validFrom: Date,
    private validTo: Date | undefined,
    private dipUuid: UUID
  ) { }

  public getUuid(): UUID {
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

  public getDipUuid(): UUID {
    return this.dipUuid;
  }

  public setUuid(uuid: UUID): void {
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

  public setDipUuid(dipUuid: UUID): void {
    this.dipUuid = dipUuid;
  }
}