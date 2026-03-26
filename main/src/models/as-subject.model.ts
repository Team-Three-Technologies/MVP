import { Subject } from './subject.model';
import { CF } from '../value-objects/cf.value-object';
import { Email } from '../value-objects/email.value-object';

export class ASSubject extends Subject {
  constructor(
    id: number,
    private name: string,
    private surname: string,
    private cf: CF,
    private organizationDen: string,
    private officeDen: string,
    private digitalAddresses: Email[]
  ) {
    super(id);
  }

  public getName(): string {
    return this.name;
  }

  public getSurname(): string {
    return this.surname;
  }

  public getCf(): CF {
    return this.cf;
  }

  public getOrganizationDen(): string {
    return this.organizationDen;
  }

  public getOfficeDen(): string {
    return this.officeDen;
  }

  public getDigitalAddresses(): Email[] {
    return this.digitalAddresses;
  }

  public setName(name: string): void {
    this.name = name;
  }

  public setSurname(surname: string): void {
    this.surname = surname;
  }

  public setCf(cf: CF): void {
    this.cf = cf;
  }

  public setOrganizationDen(organizationDen: string): void {
    this.organizationDen = organizationDen;
  }

  public setOfficeDen(officeDen: string): void {
    this.officeDen = officeDen;
  }

  public setDigitalAddresses(digitalAddresses: Email[]): void {
    this.digitalAddresses = digitalAddresses;
  }
}