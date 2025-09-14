import { AppDataSource } from '../config/data-source';
import { Router } from 'express';
import { validateBody } from '../middlewares/validate';
import { Workstation } from '../models/workstation.entity';
import { WorkstationService } from '../services/workstation.service';
import { WorkstationController } from '../controller/workstation.controller';
import { CreateWorkstationDto } from '../dto/workstationDto/create-workstation.dto';
import { UpdateWorkstationDto } from '../dto/workstationDto/update-workstation.dto';
import { WorkstationRepository } from '../repositories/workstation.repository';

const workstationRepository: WorkstationRepository = new WorkstationRepository(AppDataSource.getRepository(Workstation));
const workstationService = new WorkstationService(workstationRepository);
const workstationController = new WorkstationController(workstationService)

export const workstationRouter: Router = Router();

workstationRouter.get("/", workstationController.getAll);
workstationRouter.get("/:id", workstationController.getOne);
workstationRouter.post("/", validateBody(CreateWorkstationDto), workstationController.create);
workstationRouter.put("/:id", validateBody(UpdateWorkstationDto), workstationController.update);
workstationRouter.delete("/:id", workstationController.delete);