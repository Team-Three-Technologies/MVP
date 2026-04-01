import { UUID } from './value-objects/uuid.value-object';

export class ConservationProcess {
  constructor(
    private uuid: UUID,
    private creationDate: Date,
    private totalSize: string,
    private sipCount: number,
    private documentsCount: number,
    private filesCount: number,
    private documentClassUuid: UUID
  ) { }

  public getUuid(): UUID {
    return this.uuid;
  }

  public getCreationDate(): Date {
    return this.creationDate;
  }

  public getTotalSize(): string {
    return this.totalSize;
  }

  public getSipCount(): number {
    return this.sipCount;
  }

  public getDocumentsCount(): number {
    return this.documentsCount;
  }

  public getFilesCount(): number {
    return this.filesCount;
  }

  public getDocumentClassUuid(): UUID {
    return this.documentClassUuid;
  }

  public setUuid(uuid: UUID): void {
    this.uuid = uuid;
  }

  public setCreationDate(creationDate: Date): void {
    this.creationDate = creationDate;
  }

  public setTotalSize(totalSize: string): void {
    this.totalSize = totalSize;
  }

  public setSipCount(sipCount: number): void {
    this.sipCount = sipCount;
  }

  public setDocumentsCount(documentsCount: number): void {
    this.documentsCount = documentsCount;
  }

  public setFilesCount(filesCount: number): void {
    this.filesCount = filesCount;
  }

  public setDocumentClassUuid(documentClassUuid: UUID): void {
    this.documentClassUuid = documentClassUuid;
  }
}