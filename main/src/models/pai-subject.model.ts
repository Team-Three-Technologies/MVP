import { Subject } from './subject.model';
import { Email } from '../value-objects/email.value-object';

export class PAISubject extends Subject {
  constructor(
    id: number,
    private ipaCode: string,
    private ipaAooCode: string,
    private ipaUorCode: string,
    private digitalAddresses: Email[]
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

  public getDigitalAddresses(): Email[] {
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

  public setDigitalAddresses(digitalAddresses: Email[]): void {
    this.digitalAddresses = digitalAddresses;
  }
}