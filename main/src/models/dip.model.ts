export class Dip {
  constructor(
    readonly uuid: string,
    readonly creationDate: Date,
    readonly docsCount: number,
    readonly aipCount: number
  ) { }
}