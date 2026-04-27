import { inject, injectable } from 'tsyringe';
import { TOKENS } from '../infrastructure/di/tokens';
import { DeleteDipUseCase } from './delete-dip.use-case';
import { DipRepository } from '../repositories/dip.repository.interface';

@injectable()
export class DeleteDipService implements DeleteDipUseCase {
  constructor(
    @inject(TOKENS.DipRepository)
    private readonly dipRepository: DipRepository,
  ) {}

  public async execute(dipUuid: string): Promise<void> {
    await this.dipRepository.deleteByUuid(dipUuid);
  }
}
