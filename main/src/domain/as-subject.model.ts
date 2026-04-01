import { Subject } from './subject.model';

export class ASSubject extends Subject {
  constructor(
    id: number,
    private name: string,
    private surname: string,
    private cf: string,
    private organizationDen: string,
    private officeDen: string,
    private digitalAddresses: string[]
  ) {
    super(id);
  }

  public getName(): string {
    return this.name;
  }

  public getSurname(): string {
    return this.surname;
  }

  public getCf(): string {
    return this.cf;
  }

  public getOrganizationDen(): string {
    return this.organizationDen;
  }

  public getOfficeDen(): string {
    return this.officeDen;
  }

  public getDigitalAddresses(): string[] {
    return this.digitalAddresses;
  }

  public setName(name: string): void {
    this.name = name;
  }

  public setSurname(surname: string): void {
    this.surname = surname;
  }

  public setCf(cf: string): void {
    this.cf = cf;
  }

  public setOrganizationDen(organizationDen: string): void {
    this.organizationDen = organizationDen;
  }

  public setOfficeDen(officeDen: string): void {
    this.officeDen = officeDen;
  }

  public setDigitalAddresses(digitalAddresses: string[]): void {
    this.digitalAddresses = digitalAddresses;
  }
}