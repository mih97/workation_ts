import { Router } from "express";

import { UserRepository } from '../repositories/user.repository';
import { AuthService } from '../services/auth.service';
import { AuthController } from '../controllers/auth.controller';
import { AppDataSource } from '../config/data-source';
import { User } from '../models/user.entity';

const repo = new UserRepository(AppDataSource.getRepository(User));
const service = new AuthService(repo);
const controller = new AuthController(service);

export const authRouter: Router = Router();

authRouter.post("/register", controller.register);
authRouter.post("/login", controller.login);