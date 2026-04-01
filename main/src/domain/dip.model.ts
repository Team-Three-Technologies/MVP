export class Dip {
  constructor(
    private processUuid: string,
    private creationDate: Date,
    private documentsCount: number,
    private aipCount: number
  ) { }

  public getProcessUuid(): string {
    return this.processUuid;
  }

  public getCreationDate(): Date {
    return this.creationDate;
  }

  public getDocumentsCount(): number {
    return this.documentsCount;
  }

  public getAipCount(): number {
    return this.aipCount;
  }

  public setProcessUuid(processUuid: string): void {
    this.processUuid = processUuid;
  }

  public setCreationDate(creationDate: Date): void {
    this.creationDate = creationDate;
  }

  public setDocumentsCount(documentsCount: number): void {
    this.documentsCount = documentsCount;
  }

  public setAipCount(aipCount: number): void {
    this.aipCount = aipCount;
  }
}