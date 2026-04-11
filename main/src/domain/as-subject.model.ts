import { Subject } from './subject.model';
import {SubjectVisitor} from './subject.visitor.abstract';
import {Person} from './person.model';

export class ASSubject extends Subject {
  constructor(
    id: number,
    private person : Person,
    private organizationDen: string,
    private officeDen: string,
    private digitalAddresses: string[]
  ) {
    super(id);
  }

  public getName(): string {
    return this.person.getName();
  }

  public getSurname(): string {
    return this.person.getSurname();
  }

  public getCf(): string {
    return this.person.getCF();
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
    this.person.setCF(cf);
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
  public accept(vis: SubjectVisitor): void {
      vis.visitAsSubject(this);
  }
}
