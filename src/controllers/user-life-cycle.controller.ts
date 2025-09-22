import { Request, Response, NextFunction } from "express";
import { plainToInstance } from "class-transformer";

import { UserLifecycleService } from "../services/user-lifecycle.service";
import { UserResponseDto } from "../dto/auth/user.response.dto";
import { validateBody } from '../middlewares/validate';
import { AssignRoleDto } from '../dto/user/assign-role.dto';
import { BadRequestError, UnauthorizedError } from '../core/httpErrors';
import { ChangePasswordDto, ResetPasswordDto } from '../dto/user/reset-password.dto';
import { ActivateUserDto } from '../dto/user/activate-user.dto';
import { User } from '../models/user.entity';

export class UserLifeCycleController {
  constructor(private readonly lifecycle: UserLifecycleService) {}

  invite = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { email } = req.body;
      const user: User = await this.lifecycle.inviteUser(email);
      res.status(201).json(plainToInstance(UserResponseDto, user));
    } catch (err) {
      next(err);
    }
  };

  enable = async (
    req: Request<{ id: string }>,
    res: Response<ActivateUserDto>,
    next: NextFunction
  ): Promise<void> => {
    try {
      const id: number = Number(req.params.id);
      const user: User = await this.lifecycle.enableUser(id);
      res.status(200).json(plainToInstance(ActivateUserDto, user));
    } catch (err) {
      next(err);
    }
  };

  disable = async (
    req: Request<{ id: string }, {}, {}>,
    res: Response<UserResponseDto>,
    next: NextFunction
  ): Promise<void> => {
    try {
      const idParam: string = req.params.id;
      const userId: number = Number(idParam);

      if (!idParam || Number.isNaN(userId)) {
        return next(new BadRequestError("Invalid user id parameter"));
      }

      const user = await this.lifecycle.disableUser(userId);
      res.status(200).json(plainToInstance(UserResponseDto, user));
    } catch (err) {
      next(err);
    }
  };

  assignRole = [
    validateBody(AssignRoleDto),
    async (
      req: Request<{ id: string }, {}, AssignRoleDto>,
      res: Response,
      next: NextFunction
    ): Promise<void> => {
      try {
        const user: User = await this.lifecycle.assignRole(Number(req.params.id), req.body.role);
        res.status(200).json(plainToInstance(UserResponseDto, user));
      } catch (err) {
        next(err);
      }
    }
  ];

  requestPasswordReset = async (
    req: Request<{}, {}, { email: string }>,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { email } = req.body;
      const user: User = await this.lifecycle.requestPasswordReset(email);
      res.status(200).json({ message: "Password reset requested", email: user.email });
    } catch (err) {
      next(err);
    }
  };

  resetPassword = [
    validateBody(ResetPasswordDto),
    async (
      req: Request<{}, {}, ResetPasswordDto>,
      res: Response<UserResponseDto>,
      next: NextFunction
    ): Promise<void> => {
      try {
        const dto:ResetPasswordDto = plainToInstance(ResetPasswordDto, req.body);
        const user: User = await this.lifecycle.resetPassword(dto.token, dto.newPassword);
        res.status(200).json(plainToInstance(UserResponseDto, user));
      } catch (err) {
        next(err);
      }
    },
  ];

  acceptInvite = async (
    req: Request<{}, {}, { token: string; password: string }>,
    res: Response<UserResponseDto>,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { token, password } = req.body;
      const user: User = await this.lifecycle.acceptInvite(token, password);
      res.status(200).json(plainToInstance(UserResponseDto, user));
    } catch (err) {
      next(err);
    }
  };

  changePassword = [
    validateBody(ChangePasswordDto),
    async (
      req: Request<{}, {}, ChangePasswordDto>,
      res: Response<UserResponseDto>,
      next: NextFunction
    ): Promise<void> => {
      try {
        if (!req.user) {
          throw new UnauthorizedError("User not authenticated");
        }
        const dto = plainToInstance(ChangePasswordDto, req.body);
        const user = await this.lifecycle.changePassword(req.user.sub, dto.oldPassword, dto.newPassword);
        res.status(200).json(plainToInstance(UserResponseDto, user));
      } catch (err) {
        next(err);
      }
    },
  ];
}
