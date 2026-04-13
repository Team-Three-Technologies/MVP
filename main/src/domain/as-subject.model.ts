import { Subject } from './subject.model';
import { SubjectVisitor } from './subject.visitor.abstract';
import { Person } from './person.model';

export class ASSubject extends Subject {
  constructor(
    id: number | null,
    private person: Person,
    private organizationDen: string,
    private officeDen: string,
    private digitalAddresses: string[]
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
    this.person.setName(name);
  }

  public setSurname(surname: string): void {
    this.person.setSurname(surname);
  }

  public setCf(cf: string): void {
    this.person.setCf(cf);
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

  public accept<T>(visitor: SubjectVisitor<T>): T {
    return visitor.visitAsSubject(this);
  }
}