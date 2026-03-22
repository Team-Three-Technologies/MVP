export class Dip {
  constructor(
    readonly hash: string,
    readonly uuid: string,
    readonly creationDate: Date,
    readonly docsCount: number,
    readonly aipCount: number
  ) { }
}