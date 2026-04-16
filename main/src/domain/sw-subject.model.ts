import { Subject } from './subject.model';
import { SubjectVisitor } from './subject.visitor.abstract';

export class SWSubject extends Subject {
  constructor(
    id: number | null,
    private systemDen: string,
  ) {
    super(id);
  }

  public getSystemDen(): string {
    return this.systemDen;
  }

  public setSystemDen(systemDen: string): void {
    this.systemDen = systemDen;
  }

  public accept<T>(visitor: SubjectVisitor<T>): T {
    return visitor.visitSwSubject(this);
  }
}
