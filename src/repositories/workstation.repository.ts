import { DeleteResult, Repository } from 'typeorm';

import { Workstation } from "../models/workstation.entity";

export class WorkstationRepository {
  constructor(private readonly repo: Repository<Workstation>) {}

  async findAll(): Promise<Workstation[]> {
    return this.repo.find();
  }

  async findById(id: number): Promise<Workstation | null> {
    return this.repo.findOneBy({ id });
  }

  async create(data: Partial<Workstation>): Promise<Workstation> {
    const entity:Workstation = this.repo.create(data);
    return this.repo.save(entity);
  }

  async update(entity: Workstation): Promise<Workstation> {
    return this.repo.save(entity);
  }

  async delete(id: number): Promise<number> {
    const result: DeleteResult = await this.repo.delete(id);
    return result.affected ?? 0; // service will decide if 0 means NotFound
  }
}