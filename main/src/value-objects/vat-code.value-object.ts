export class VatCode {
  private static PATTERN = /^[0-9]{11}$/;

  private constructor(private readonly value: string) { }

  static from(value: string): VatCode {
    if (!VatCode.PATTERN.test(value)) {
      throw new Error("Formato Partita IVA non valido");
    }
    return new VatCode(value);
  }

  toString(): string {
    return this.value;
  }

  equals(other: VatCode): boolean {
    return this.value === other.value;
  }
}