import { Subject } from './subject.model';
import {SubjectVisitor} from './subject.visitor.abstract';

export class PAISubject extends Subject {
  constructor(
    id: number,
    private ipaCode: string,
    private ipaAooCode: string,
    private ipaUorCode: string,
    private digitalAddresses: string[]
  ) {
    super(id);
  }

  public getIpaCode(): string {
    return this.ipaCode;
  }

  public getIpaAooCode(): string {
    return this.ipaAooCode;
  }

  public getIpaUorCode(): string {
    return this.ipaUorCode;
  }

  public getDigitalAddresses(): string[] {
    return this.digitalAddresses;
  }

  public setIpaCode(ipaCode: string): void {
    this.ipaCode = ipaCode;
  }

  public setIpaAooCode(ipaAooCode: string): void {
    this.ipaAooCode = ipaAooCode;
  }

  public setIpaUorCode(ipaUorCode: string): void {
    this.ipaUorCode = ipaUorCode;
  }

  public setDigitalAddresses(digitalAddresses: string[]): void {
    this.digitalAddresses = digitalAddresses;
  }
  public accept(vis: SubjectVisitor): void {
      vis.visitPaiSubject(this);
  }
}
