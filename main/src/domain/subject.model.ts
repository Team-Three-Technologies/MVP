import {SubjectVisitor} from './subject.visitor.abstract';
export abstract class Subject {
  constructor(
    private id: number
  ) { }

  public getId(): number {
    return this.id;
  }

  public setId(id: number): void {
    this.id = id;
  }
  public abstract accept(vis:SubjectVisitor):void;
}
