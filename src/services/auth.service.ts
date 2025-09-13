import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { RegisterDto } from '../dto/auth/register.dto';
import { User } from '../models/user.entity';
import { UserRepository } from '../repositories/user.repository';
import { LoginDto } from '../dto/auth/login.dto';
import { env } from '../config/env';

export class AuthService {
  constructor(private readonly userRepo: UserRepository) {}

  async register(dto: RegisterDto): Promise<User> {
    const passwordHash: string = await bcrypt.hash(dto.password, 10);
    return this.userRepo.create({ email: dto.email, passwordHash });
  }

  async login(dto: LoginDto): Promise<{ accessToken: string }> {
    const user: User = await this.userRepo.findByEmail(dto.email);
    const valid: boolean = await bcrypt.compare(dto.password, user.passwordHash);
    if (!valid) throw new Error("Invalid credentials");

    const accessToken = jwt.sign(
      { sub: user.id, role: user.role },
      env.JWT_SECRET!,
      { expiresIn: "15m" }
    );

    return { accessToken };
  }
}