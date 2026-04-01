import { MetadataTypeEnum } from './metadata-type.enum';

export class Metadata {
  constructor(
    private name: string,
    private value: string,
    private type: MetadataTypeEnum
  ) { }

  public getName(): string {
    return this.name;
  }

  public getValue(): string {
    return this.value;
  }

  public getType(): MetadataTypeEnum {
    return this.type;
  }

  public setName(name: string): void {
    this.name = name;
  }

  public setValue(value: string): void {
    this.value = value;
  }

  public setType(type: MetadataTypeEnum): void {
    this.type = type;
  }
}