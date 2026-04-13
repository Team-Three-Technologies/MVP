import { SubjectVisitor } from './subject.visitor.abstract';

export abstract class Subject {
  constructor(
    private id: number | null
  ) { }

  public getId(): number | null {
    return this.id;
  }

  public setId(id: number): void {
    this.id = id;
  }

  public abstract accept<T>(visitor: SubjectVisitor<T>): T;
}