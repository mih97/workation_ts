import { Request, Response, NextFunction } from "express";
import { UserService } from "../services/user.service";

export class UserController {
  constructor(private svc: UserService) {}

  getAll = async (_req: Request, res: Response, next: NextFunction) => {
    try { res.json(await this.svc.list()); } catch (e) { next(e); }
  };

  getOne = async (req: Request, res: Response, next: NextFunction) => {
    try { res.json(await this.svc.get(Number(req.params.id))); } catch (e) {
      if ((e as Error).message === "NOT_FOUND") return res.status(404).json({ message: "User not found" });
      next(e);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction) => {
    try { res.status(201).json(await this.svc.create(req.body)); } catch (e) { next(e); }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try { res.json(await this.svc.update(Number(req.params.id), req.body)); } catch (e) {
      if ((e as Error).message === "NOT_FOUND") return res.status(404).json({ message: "User not found" });
      next(e);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try { await this.svc.remove(Number(req.params.id)); res.status(204).send(); } catch (e) {
      if ((e as Error).message === "NOT_FOUND") return res.status(404).json({ message: "User not found" });
      next(e);
    }
  };
}