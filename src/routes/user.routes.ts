import { Router } from "express";
import { AppDataSource } from "../config/data-source";
import { User } from "../models/user.entity";
import { UserService } from "../services/user.service";
import { UserController } from "../controller/user.controller";
import { validateBody } from "../middlewares/validate";
import { CreateUserDto, UpdateUserDto } from "../dto/user.dto";
import { Repository } from 'typeorm';

const userRepository: Repository<User> = AppDataSource.getRepository(User);
const userService = new UserService(userRepository);
const userController = new UserController(userService);

export const userRouter: Router = Router();

userRouter.get("/", userController.getAll);
userRouter.get("/:id", userController.getOne);
userRouter.post("/", validateBody(CreateUserDto), userController.create);
userRouter.put("/:id", validateBody(UpdateUserDto), userController.update);
userRouter.delete("/:id", userController.delete);