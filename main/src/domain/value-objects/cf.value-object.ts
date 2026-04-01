export class CF {
  private static PATTERN = /^[A-Z]{6}[0-9]{2}[A-Z][0-9]{2}[A-Z][0-9]{3}[A-Z]$/;

  private constructor(
    private readonly value: string
  ) { }

  public static from(value: string): CF {
    if (!CF.PATTERN.test(value)) {
      throw new Error("Formato CF non valido");
    }
    return new CF(value);
  }

  public toString(): string {
    return this.value;
  }

  public equals(other: CF): boolean {
    return this.value === other.value;
  }
}