export class Email {
  private static PATTERN = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

  private constructor(
    private readonly value: string
  ) { }

  public static from(value: string): Email {
    if (!Email.PATTERN.test(value)) {
      throw new Error("Formato Email non valido");
    }
    return new Email(value);
  }

  public toString(): string {
    return this.value;
  }

  public equals(other: Email): boolean {
    return this.value === other.value;
  }
}