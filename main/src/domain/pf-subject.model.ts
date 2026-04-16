import { Subject } from './subject.model';
import { SubjectVisitor } from './subject.visitor.abstract';
import { Person } from './person.model';

export class PFSubject extends Subject {
  constructor(
    id: number | null,
    private person: Person,
    private digitalAddresses: string[],
  ) {
    super(id);
  }

  public getName(): string | undefined {
    return this.person.getName();
  }

  public getSurname(): string | undefined {
    return this.person.getSurname();
  }

  public getCf(): string | undefined {
    return this.person.getCf();
  }

  public getDigitalAddresses(): string[] {
    return this.digitalAddresses;
  }

  public setName(name: string): void {
    this.person.setName(name);
  }

  public setSurname(surname: string): void {
    this.person.setSurname(surname);
  }

  public setCf(cf: string): void {
    this.person.setCf(cf);
  }

  public setDigitalAddresses(digitalAddresses: string[]): void {
    this.digitalAddresses = digitalAddresses;
  }

  public accept<T>(visitor: SubjectVisitor<T>): T {
    return visitor.visitPfSubject(this);
  }
}
