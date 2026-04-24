import { File } from './file.model';
import { Metadata } from './metadata.model';

export class Document {
  constructor(
    private uuid: string,
    private path: string,
    private main: File,
    private attachments: File[],
    private metadata: Metadata[],
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

  public setConservationProcessUuid(conservationProcessUuid: string): void {
    this.conservationProcessUuid = conservationProcessUuid;
  }

  public getMetadataValueByName(name: string): string | null {
    return this.metadata.find((metadata) => metadata.getName() === name)?.getValue() ?? null;
  }

  public getMetadataValueByRegex(name: RegExp): string | null {
    return this.metadata.find((metadata) => metadata.getName().match(name))?.getValue() ?? null;
  }
}
