import { Subject } from './subject.model';

export class SWSubject extends Subject {
  constructor(
    id: number,
    private systemDen: string
  ) {
    super(id);
  }

  public getSystemDen(): string {
    return this.systemDen;
  }

  public setSystemDen(systemDen: string): void {
    this.systemDen = systemDen;
  }
}