import { Subject } from './subject.model';

export class PAESubject extends Subject {
  constructor(
    id: number,
    private administrationDen: string,
    private officeDen: string | undefined,
    private digitalAddresses: string[]
  ) {
    super(id);
  }

  public getAdministrationDen(): string {
    return this.administrationDen;
  }

  public getOfficeDen(): string | undefined {
    return this.officeDen;
  }

  public getDigitalAddresses(): string[] {
    return this.digitalAddresses;
  }

  public setAdministrationDen(administrationDen: string): void {
    this.administrationDen = administrationDen;
  }

  public setOfficeDen(officeDen: string): void {
    this.officeDen = officeDen;
  }

  public setDigitalAddresses(digitalAddresses: string[]): void {
    this.digitalAddresses = digitalAddresses;
  }
}