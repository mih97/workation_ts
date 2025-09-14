import { AppDataSource } from '../config/data-source';
import { Router } from 'express';
import { validateBody } from '../middlewares/validate';
import { Workstation } from '../models/workstation.entity';
import { WorkstationService } from '../services/workstation.service';
import { WorkstationController } from '../controller/workstation.controller';
import { CreateWorkstationDto } from '../dto/workstationDto/create-workstation.dto';
import { UpdateWorkstationDto } from '../dto/workstationDto/update-workstation.dto';
import { WorkstationRepository } from '../repositories/workstation.repository';
import { authorize } from '../middlewares/auth.middleware';
import { Role } from '../core/roles';

const workstationRepository: WorkstationRepository = new WorkstationRepository(AppDataSource.getRepository(Workstation));
const workstationService = new WorkstationService(workstationRepository);
const workstationController = new WorkstationController(workstationService)

export const workstationRouter: Router = Router();

workstationRouter.get("/", authorize(Role.USER, Role.MANAGER, Role.ADMIN),workstationController.getAll);
workstationRouter.get("/:id", authorize(Role.USER, Role.MANAGER, Role.ADMIN), workstationController.getOne);
workstationRouter.post("/", authorize(Role.MANAGER, Role.ADMIN),validateBody(CreateWorkstationDto), workstationController.create);
workstationRouter.put("/:id",authorize(Role.MANAGER, Role.ADMIN), validateBody(UpdateWorkstationDto), workstationController.update);
workstationRouter.delete("/:id",authorize(Role.ADMIN), workstationController.delete);