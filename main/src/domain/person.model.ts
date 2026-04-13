export class Person {
  constructor(
    private name: string | undefined,
    private surname: string | undefined,
    private cf: string | undefined
  ) { }

  public getName(): string | undefined {
    return this.name;
  }

  public getSurname(): string | undefined {
    return this.surname;
  }

  public getCf(): string | undefined {
    return this.cf;
  }

  public setName(name: string): void {
    this.name = name;
  }

  public setSurname(surname: string): void {
    this.surname = surname;
  }

  public setCf(cf: string): void {
    this.cf = cf;
  }
}