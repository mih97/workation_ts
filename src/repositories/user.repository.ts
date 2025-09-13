import { Repository } from "typeorm";
import { User } from '../models/user.entity';
import { NotFoundError } from '../core/httpErrors';

export class UserRepository {
  constructor(private readonly repo: Repository<User>) {}

  async findById(id: number): Promise<User> {
    const entity = await this.repo.findOneBy({ id });
    if (!entity) throw new NotFoundError("User", id);
    return entity;
  }

  async findByEmail(email: string): Promise<User> {
    const entity = await this.repo.findOneBy({ email });
    if (!entity) throw new Error("Invalid credentials");
    return entity;
  }

  async create(user: Partial<User>): Promise<User> {
    const entity = this.repo.create(user);
    return this.repo.save(entity);
  }
}