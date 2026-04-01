import { Subject } from './subject.model';

export class PGSubject extends Subject {
  constructor(
    id: number,
    private organizationDen: string,
    private vatCode: string,
    private officeDen: string,
    private digitalAddresses: string[]
  ) {
    super(id);
  }

  public getOrganizationDen(): string {
    return this.organizationDen;
  }

  public getVatCode(): string {
    return this.vatCode;
  }

  public getOfficeDen(): string {
    return this.officeDen;
  }

  public getDigitalAddresses(): string[] {
    return this.digitalAddresses;
  }

  public setOrganizationDen(organizationDen: string): void {
    this.organizationDen = organizationDen;
  }

  public setVatCode(vatCode: string): void {
    this.vatCode = vatCode;
  }

  public setOfficeDen(officeDen: string): void {
    this.officeDen = officeDen;
  }

  public setDigitalAddresses(digitalAddresses: string[]): void {
    this.digitalAddresses = digitalAddresses;
  }
}