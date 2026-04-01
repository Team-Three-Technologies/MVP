import { Subject } from './subject.model';

export class PFSubject extends Subject {
  constructor(
    id: number,
    private name: string,
    private surname: string,
    private cf: string,
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

  public setDigitalAddresses(digitalAddresses: string[]): void {
    this.digitalAddresses = digitalAddresses;
  }
}