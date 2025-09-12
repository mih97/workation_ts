import { Workstation } from '../models/workstation.entity';
import { WorkstationRepository } from '../repositories/workstation.repository';


export class WorkstationService {
  constructor(private readonly repo: WorkstationRepository) {}

  async list(): Promise<Workstation[]> {
    return this.repo.findAll();
  }

  async get(id: number): Promise<Workstation> {
    return this.repo.findById(id);
  }

  async create(entity: Workstation): Promise<Workstation> {
    return this.repo.create(entity);
  }

  async update(id: number, partial: Partial<Workstation>): Promise<Workstation> {
    return this.repo.update(id, partial);
  }

  async remove(id: number): Promise<void> {
    await this.repo.delete(id);
  }
}