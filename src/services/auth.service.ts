import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { UserRepository } from '../repositories/user.repository';
import { RegisterDto } from '../dto/auth/register.dto';
import { BadRequestError, UnauthorizedError } from '../core/httpErrors';
import { LoginDto } from '../dto/auth/login.dto';
import { env } from '../config/env';
import { User } from '../models/user.entity';
import { UserResponseDto } from '../dto/auth/user.response.dto';
import { QueryFailedError } from 'typeorm';
import { Role } from '../core/roles';

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export class AuthService {
  constructor(private readonly userRepo: UserRepository) {}

  async register(dto: RegisterDto): Promise<UserResponseDto> {
    const passwordHash = await bcrypt.hash(dto.password, 10);

    try {
      const user = await this.userRepo.create({
        email: dto.email,
        passwordHash,
        role: Role.USER,
      });

      return this.toResponse(user);
    } catch (err: unknown) {
      if (err instanceof QueryFailedError) {
        const driverErr = (err as any).driverError;
        if (driverErr?.code === "23505") {
          throw new BadRequestError("Email already in use.");
        }
      }
      throw err; // rethrow anything else
    }
  }

  async login(dto: LoginDto): Promise<AuthTokens> {
    const user = await this.userRepo.findByEmail(dto.email);
    if (!user) {
      throw new UnauthorizedError("Invalid credentials");
    }

    const valid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!valid) {
      throw new UnauthorizedError("Invalid credentials");
    }

    const accessToken = jwt.sign(
      { sub: user.id, role: user.role },
      env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    const refreshToken = jwt.sign({ sub: user.id }, env.JWT_REFRESH_SECRET, {
      expiresIn: "7d",
    });

    user.refreshToken = refreshToken;
    await this.userRepo.save(user);

    return { accessToken, refreshToken };
  }

  private toResponse(user: User): UserResponseDto {
    return {
      id: user.id,
      email: user.email,
      role: user.role,
    };
  }
}