import { Subject } from './subject.model';
import { VatCode } from './value-objects/vat-code.value-object';
import { Email } from './value-objects/email.value-object';

export class PGSubject extends Subject {
  constructor(
    id: number,
    private organizationDen: string,
    private vatCode: VatCode,
    private officeDen: string,
    private digitalAddresses: Email[]
  ) {
    super(id);
  }

  public getOrganizationDen(): string {
    return this.organizationDen;
  }

  public getVatCode(): VatCode {
    return this.vatCode;
  }

  public getOfficeDen(): string {
    return this.officeDen;
  }

  public getDigitalAddresses(): Email[] {
    return this.digitalAddresses;
  }

  public setOrganizationDen(organizationDen: string): void {
    this.organizationDen = organizationDen;
  }

  public setVatCode(vatCode: VatCode): void {
    this.vatCode = vatCode;
  }

  public setOfficeDen(officeDen: string): void {
    this.officeDen = officeDen;
  }

  public setDigitalAddresses(digitalAddresses: Email[]): void {
    this.digitalAddresses = digitalAddresses;
  }
}