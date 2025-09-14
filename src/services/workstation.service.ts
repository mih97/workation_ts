import { Workstation } from "../models/workstation.entity";
import { NotFoundError } from "../core/httpErrors";
import { WorkstationRepository } from '../repositories/workstation.repository';

export class WorkstationService {
  constructor(private readonly repo: WorkstationRepository) {}

  async getAll(): Promise<Workstation[]> {
    return this.repo.findAll();
  }

  async getById(id: number): Promise<Workstation> {
    const entity = await this.repo.findById(id);
    if (!entity) throw new NotFoundError("Workstation", id);
    return entity;
  }

  async create(data: Partial<Workstation>): Promise<Workstation> {
    return this.repo.create(data);
  }

  async update(id: number, partial: Partial<Workstation>): Promise<Workstation> {
    const entity = await this.repo.findById(id);
    if (!entity) throw new NotFoundError("Workstation", id);

    Object.assign(entity, partial);
    return this.repo.update(entity);
  }

  async delete(id: number): Promise<void> {
    const affected = await this.repo.delete(id);
    if (affected === 0) throw new NotFoundError("Workstation", id);
  }
}