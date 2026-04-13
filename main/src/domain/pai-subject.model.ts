import { Subject } from './subject.model';
import { SubjectVisitor } from './subject.visitor.abstract';

export class PAISubject extends Subject {
  constructor(
    id: number | null,
    private administrationDen: string,
    private ipaCode: string,
    private aooAdministrationDen: string | undefined,
    private ipaAooCode: string | undefined,
    private uorAdministrationDen: string | undefined,
    private ipaUorCode: string | undefined,
    private digitalAddresses: string[]
  ) {
    super(id);
  }

  public getAdministrationDen(): string {
    return this.administrationDen;
  }

  public getIpaCode(): string {
    return this.ipaCode;
  }

  public getAooAdministrationDen(): string | undefined {
    return this.aooAdministrationDen;
  }

  public getIpaAooCode(): string | undefined {
    return this.ipaAooCode;
  }

  public getUorAdministrationDen(): string | undefined {
    return this.uorAdministrationDen;
  }

  public getIpaUorCode(): string | undefined {
    return this.ipaUorCode;
  }

  public getDigitalAddresses(): string[] {
    return this.digitalAddresses;
  }

  public setAdministrationDen(administrationDen: string): void {
    this.administrationDen = administrationDen;
  }

  public setIpaCode(ipaCode: string): void {
    this.ipaCode = ipaCode;
  }

  public setAooAdministrationDen(aooAdministrationDen: string): void {
    this.aooAdministrationDen = aooAdministrationDen;
  }

  public setIpaAooCode(ipaAooCode: string): void {
    this.ipaAooCode = ipaAooCode;
  }

  public setUorAdministrationDen(uorAdministrationDen: string): void {
    this.uorAdministrationDen = uorAdministrationDen;
  }

  public setIpaUorCode(ipaUorCode: string): void {
    this.ipaUorCode = ipaUorCode;
  }

  public setDigitalAddresses(digitalAddresses: string[]): void {
    this.digitalAddresses = digitalAddresses;
  }

  public accept<T>(visitor: SubjectVisitor<T>): T {
    return visitor.visitPaiSubject(this);
  }
}