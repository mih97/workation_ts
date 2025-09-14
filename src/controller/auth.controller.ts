import { Request, Response, NextFunction } from "express";
import { plainToInstance } from "class-transformer"
import { validateBody } from '../middlewares/validate';
import { RegisterDto } from '../dto/auth/register.dto';
import { AuthService } from '../services/auth.service';
import { User } from '../models/user.entity';
import { LoginDto } from '../dto/auth/login.dto';
import { UserResponseDto } from '../dto/auth/user.response.dto';

export class AuthController {
  constructor(private readonly svc: AuthService) {}

  register = [
    validateBody(RegisterDto),
    async (
      req: Request<{}, User, RegisterDto>,
      res: Response<UserResponseDto>,
      next: NextFunction
    ): Promise<void> => {
      try {
        const dto: RegisterDto = req.body;
        const entity: RegisterDto = plainToInstance(RegisterDto, dto);
        const user: UserResponseDto = await this.svc.register(entity);
        res.status(201).json(user);
      } catch (err) {
        next(err);
      }
    },
  ];

  login = [
    validateBody(LoginDto),
    async (
      req: Request<{}, { accessToken: string }, LoginDto>,
      res: Response<{ accessToken: string }>,
      next: NextFunction
    ): Promise<void> => {
      try {
        const dto: LoginDto = req.body;
        const creds: LoginDto = plainToInstance(LoginDto, dto);
        const token = await this.svc.login(creds);
        res.status(200).json(token);
      } catch (err) {
        next(err);
      }
    },
  ];
}