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

  private getIpaCode(): string {
    return this.ipaCode;
  }

  private getIpaAooCode(): string {
    return this.ipaAooCode;
  }

  private getIpaUorCode(): string {
    return this.ipaUorCode;
  }

  public getDigitalAddresses(): string[] {
    return this.digitalAddresses;
  }

  private setIpaCode(ipaCode: string): void {
    this.ipaCode = ipaCode;
  }

  private setIpaAooCode(ipaAooCode: string): void {
    this.ipaAooCode = ipaAooCode;
  }

  private setIpaUorCode(ipaUorCode: string): void {
    this.ipaUorCode = ipaUorCode;
  }

  public setDigitalAddresses(digitalAddresses: string[]): void {
    this.digitalAddresses = digitalAddresses;
  }
  public accept(vis: SubjectVisitor): void {
      vis.visitPaiSubject(this);
  }
}
