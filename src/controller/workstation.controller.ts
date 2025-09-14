import { Request, Response, NextFunction } from "express";
import { WorkstationService } from '../services/workstation.service';
import { WorkstationResponseDto } from '../dto/workstationDto/response-workstation.dto';
import { CreateWorkstationDto } from '../dto/workstationDto/create-workstation.dto';
import { UpdateWorkstationDto } from '../dto/workstationDto/update-workstation.dto';
import { Workstation } from '../models/workstation.entity';
import { plainToInstance } from 'class-transformer';
import { validateBody } from '../middlewares/validate';


export class WorkstationController {
  constructor(private svc: WorkstationService) {}

  getAll = async (
    _req: Request,
    res: Response<WorkstationResponseDto[]>,
    next: NextFunction
  ): Promise<void> => {
    try {
      const entities: Workstation[] = await this.svc.getAll();
      const response: WorkstationResponseDto[] = plainToInstance(WorkstationResponseDto, entities, {
        excludeExtraneousValues: true,
      });
      res.json(response);
    } catch (err) {
      next(err);
    }
  };

  getOne = async (
    req: Request<{ id: string }>,
    res: Response<WorkstationResponseDto>,
    next: NextFunction
  ): Promise<void> => {
    try {
      const id = Number(req.params.id);
      const entity: Workstation = await this.svc.getById(id);
      const response = plainToInstance(WorkstationResponseDto, entity, {
        excludeExtraneousValues: true,
      });
      res.json(response);
    } catch (err) {
      next(err);
    }
  };

  create = [
    validateBody(CreateWorkstationDto),
    async (
      req: Request<{}, WorkstationResponseDto, CreateWorkstationDto>,
      res: Response<WorkstationResponseDto>,
      next: NextFunction
    ): Promise<void> => {
      try {
        const dto: CreateWorkstationDto = req.body;
        const entity: Workstation = plainToInstance(Workstation, dto);
        const saved: Workstation = await this.svc.create(entity);

        const response: WorkstationResponseDto = plainToInstance(WorkstationResponseDto, saved, {
          excludeExtraneousValues: true,
        });
        res.status(201).json(response);
      } catch (err) {
        next(err);
      }
    },
  ];

  update = [
    validateBody(UpdateWorkstationDto),
    async (
      req: Request<{ id: string }, WorkstationResponseDto, UpdateWorkstationDto>,
      res: Response<WorkstationResponseDto>,
      next: NextFunction
    ): Promise<void> => {
      try {
        const id = Number(req.params.id);
        const dto = req.body;
        const partial = plainToInstance(Workstation, dto);

        const updated = await this.svc.update(id, partial);

        const response = plainToInstance(WorkstationResponseDto, updated, {
          excludeExtraneousValues: true,
        });
        res.json(response);
      } catch (err) {
        next(err);
      }
    },
  ];

  delete = async (
    req: Request<{ id: string }>,
    res: Response<void>,
    next: NextFunction
  ): Promise<void> => {
    try {
      const id = Number(req.params.id);
      await this.svc.delete(id);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  };
}