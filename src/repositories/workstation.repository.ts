import { Repository } from 'typeorm';
import { Workstation } from '../models/workstation.entity';
import { NotFoundError } from '../core/httpErrors';

export class WorkstationRepository {
  constructor(private readonly repo: Repository<Workstation>) {}

  async findAll(): Promise<Workstation[]> {
    return this.repo.find();
  }

  async findById(id: number): Promise<Workstation> {
    const entity: Workstation | null = await this.repo.findOneBy({ id });
    if (!entity) throw new NotFoundError("Workstation", id);
    return entity;
  }

  async create(entity: Workstation): Promise<Workstation> {
    const newEntity: Workstation = this.repo.create(entity);
    return this.repo.save(newEntity);
  }

  async update(id: number, partial: Partial<Workstation>): Promise<Workstation> {
    const entity: Workstation = await this.findById(id);
    Object.assign(entity, partial);
    return this.repo.save(entity);
  }

  async delete(id: number): Promise<void> {
    const result = await this.repo.delete(id);
    if (result.affected === 0) throw new NotFoundError("Workstation", id);
  }
}