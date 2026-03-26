import { CF } from '../value-objects/cf.value-object';
import { Email } from '../value-objects/email.value-object';
import { Subject } from './subject.model';

export class PFSubject extends Subject {
  constructor(
    id: number,
    private name: string,
    private surname: string,
    private cf: CF,
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

  public setDigitalAddresses(digitalAddresses: Email[]): void {
    this.digitalAddresses = digitalAddresses;
  }
}