import { Router } from "express";

import { AppDataSource } from "../config/data-source";
import { User } from "../models/user.entity";
import { UserRepository } from "../repositories/user.repository";
import { UserLifecycleService } from "../services/user-lifecycle.service";
import { validateBody } from "../middlewares/validate";
import { InviteUserDto } from "../dto/user/invite-user.dto";
import { ActivateUserDto } from "../dto/user/activate-user.dto";
import { ChangePasswordDto, RequestPasswordResetDto, ResetPasswordDto } from '../dto/user/reset-password.dto';
import { AssignRoleDto } from "../dto/user/assign-role.dto";
import { Role } from "../core/roles";
import { UserLifeCycleController } from '../controllers/user-life-cycle.controller';
import { authMiddleware, authorize } from '../middlewares/auth.middleware';

const userRepo = new UserRepository(AppDataSource.getRepository(User));
const lifecycleSvc = new UserLifecycleService(userRepo);
const lifecycleCtl = new UserLifeCycleController(lifecycleSvc);

export const userLifecycleRouter: Router = Router();

// Public routes
userLifecycleRouter.post("/activate", validateBody(ActivateUserDto), lifecycleCtl.acceptInvite);
userLifecycleRouter.post("/request-reset", validateBody(RequestPasswordResetDto), lifecycleCtl.requestPasswordReset);
userLifecycleRouter.post("/reset-password", validateBody(ResetPasswordDto), lifecycleCtl.resetPassword);

// Protected routes (admin only)
userLifecycleRouter.post(
  "/invite",
  authMiddleware,
  authorize(Role.ADMIN),
  validateBody(InviteUserDto),
  lifecycleCtl.invite
);

userLifecycleRouter.post(
  "/enable/:id",
  authMiddleware,
  authorize(Role.ADMIN),
  lifecycleCtl.enable
);

userLifecycleRouter.post(
  "/disable/:id",
  authMiddleware,
  authorize(Role.ADMIN),
  lifecycleCtl.disable
);

userLifecycleRouter.post(
  "/assign-role/:id",
  authMiddleware,
  authorize(Role.ADMIN),
  validateBody(AssignRoleDto),
  lifecycleCtl.assignRole
);

userLifecycleRouter.post(
  "/change-password",
  authMiddleware,
  validateBody(ChangePasswordDto),
  lifecycleCtl.changePassword);
