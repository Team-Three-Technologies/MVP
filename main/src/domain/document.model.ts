import { File } from './file.model';
import { Metadata } from './metadata.model';
import { Subject } from './subject.model';
import { RolesTypeEnum } from './roles-type.enum';

export class Document {
  constructor(
    private uuid: string,
    private path: string,
    private main: File,
    private attachments: File[],
    private metadata: Metadata[],
    private subjects: Map<Subject, RolesTypeEnum>,
    private conservationProcessUuid: string,
  ) {}

  public getUuid(): string {
    return this.uuid;
  }

  public getPath(): string {
    return this.path;
  }

  public getMain(): File {
    return this.main;
  }

  public getAttachments(): File[] {
    return this.attachments;
  }

  public getMetadata(): Metadata[] {
    return this.metadata;
  }

  public getSubjects(): Map<Subject, RolesTypeEnum> {
    return this.subjects;
  }

  public getConservationProcessUuid(): string {
    return this.conservationProcessUuid;
  }

  public setUuid(uuid: string): void {
    this.uuid = uuid;
  }

  public setPath(path: string): void {
    this.path = path;
  }

  public setMain(main: File): void {
    this.main = main;
  }

  public setAttachments(attachments: File[]): void {
    this.attachments = attachments;
  }

  public setMetadata(metadata: Metadata[]): void {
    this.metadata = metadata;
  }

  public setSubjects(subject: Map<Subject, RolesTypeEnum>): void {
    this.subjects = subject;
  }

  public setConservationProcessUuid(conservationProcessUuid: string): void {
    this.conservationProcessUuid = conservationProcessUuid;
  }

  public getMetadataValue(name: string): string | null {
    return this.metadata.find((metadata) => metadata.getName() === name)?.getValue() ?? null;
  }
}
