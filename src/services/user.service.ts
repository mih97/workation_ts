import { DeleteResult, Repository } from 'typeorm';
import { User } from "../models/user.entity";

export class UserService {
  constructor(private userRepository: Repository<User>) {}

  list(): Promise<User[]> {
    return this.userRepository.find();
  }

  async get(id: number): Promise<User> {
    const user: User | null = await this.userRepository.findOneBy({ id });
    if (!user) throw new Error("NOT_FOUND");
    return user;
  }

  create(data: Pick<User, "name" | "email">): Promise<User> {
    const entity: User = this.userRepository.create(data);
    return this.userRepository.save(entity);
  }

  async update(id: number, patch: Partial<Pick<User, "name" | "email">>): Promise<User> {
    const user: User | null = await this.userRepository.findOneBy({ id });
    if (!user) throw new Error("NOT_FOUND");
    Object.assign(user, patch);
    return this.userRepository.save(user);
  }

  async remove(id: number) :Promise<void> {
    const res: DeleteResult = await this.userRepository.delete(id);
    if (!res.affected) throw new Error("NOT_FOUND");
  }
}