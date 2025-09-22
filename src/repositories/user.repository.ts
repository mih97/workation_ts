import { Repository } from "typeorm";

import { User } from '../models/user.entity';

export class UserRepository {

  constructor(private readonly repo: Repository<User>) {
  }

  async create(data: Partial<User>): Promise<User> {
    const entity: User = this.repo.create(data);
    return this.repo.save(entity);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.repo.findOne({ where: { email } });
  }

  async findByInviteToken(token: string): Promise<User | null> {
    return this.repo.findOne({ where: { inviteToken: token } });
  }

  async findByResetToken(token: string): Promise<User | null> {
    return this.repo.findOneBy({ resetToken: token });
  }

  async findById(id: number): Promise<User | null> {
    return this.repo.findOne({ where: { id } });
  }

  async save(user: User): Promise<User> {
    return this.repo.save(user);
  }

  async delete(id: number): Promise<void> {
    await this.repo.delete(id);
  }
}