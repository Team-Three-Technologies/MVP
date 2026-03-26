import { Subject } from './subject.model';
import { Email } from '../value-objects/email.value-object';

export class PAESubject extends Subject {
  constructor(
    id: number,
    private administrationDen: string,
    private officeDen: string,
    private digitalAddresses: Email[]
  ) {
    super(id);
  }

  public getAdministrationDen(): string {
    return this.administrationDen;
  }

  public getOfficeDen(): string {
    return this.officeDen;
  }

  public getDigitalAddresses(): Email[] {
    return this.digitalAddresses;
  }

  public setAdministrationDen(administrationDen: string): void {
    this.administrationDen = administrationDen;
  }

  public setOfficeDen(officeDen: string): void {
    this.officeDen = officeDen;
  }

  public setDigitalAddresses(digitalAddresses: Email[]): void {
    this.digitalAddresses = digitalAddresses;
  }
}