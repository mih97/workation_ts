import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { Request, Response, NextFunction } from "express";

export function validateBody<T>(dtoClass: new () => T) {
  return async (req: Request<{}, any, T>, res: Response, next: NextFunction) => {
    const dto: T = plainToInstance(dtoClass, req.body);
    const errors = await validate(dto as object);
    if (errors.length > 0) {
      return res.status(400).json({ message: "Validation failed", errors });
    }
    req.body = dto;
    next();
  };
}