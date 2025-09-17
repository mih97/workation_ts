import { plainToInstance } from "class-transformer";
import { validate, ValidationError } from "class-validator";
import { Request, Response, NextFunction } from "express";

/**
 * Converts a string into a machine-friendly error code.
 * Example: "employeeName" + "isLength" -> "EMPLOYEE_NAME_IS_LENGTH"
 */
function toErrorCode(field: string, constraint: string): string {
  return `${field}_${constraint}`.toUpperCase();
}

function formatValidationErrors(errors: ValidationError[]): { field: string; code: string; message: string }[] {
  return errors.flatMap(err => {
    if (!err.constraints) return [];
    return Object.entries(err.constraints).map(([constraint, msg]) => ({
      field: err.property,
      code: toErrorCode(err.property, constraint),
      message: msg,
    }));
  });
}

export function validateBody<T extends object>(dtoClass: new () => T) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const dto = plainToInstance(dtoClass, req.body);
    const errors = await validate(dto, { whitelist: true, forbidNonWhitelisted: true });

    if (errors.length > 0) {
      res.status(400).json({
        error: "Validation failed",
        details: formatValidationErrors(errors),
      });
      return;
    }

    req.body = dto;
    next();
  };
}