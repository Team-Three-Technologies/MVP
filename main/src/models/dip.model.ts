import { UUID } from '../value-objects/uuid.value-object';

export class Dip {
  constructor(
    readonly uuid: UUID,
    readonly creationDate: Date,
    readonly docsCount: number,
    readonly aipCount: number
  ) { }
}