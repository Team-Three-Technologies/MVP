export class UUID {
  private static PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

  private constructor(
    private readonly value: string
  ) { }

  public static from(value: string): UUID {
    if (!UUID.PATTERN.test(value)) {
      throw new Error("Formato UUID non valido");
    }
    return new UUID(value);
  }

  public toString(): string {
    return this.value;
  }

  public equals(other: UUID): boolean {
    return this.value === other.value;
  }
}