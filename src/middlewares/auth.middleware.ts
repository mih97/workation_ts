import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { ForbiddenError, UnauthorizedError } from '../core/httpErrors';
import { Role } from '../core/roles';
import { PUBLIC_ROUTES } from '../config/security.config';

export function authMiddleware(req: Request, _res: Response, next: NextFunction) {
  const isPublic:boolean = PUBLIC_ROUTES.some(
    route => route.path === req.path && route.method === req.method
  );

  if (isPublic) {
    return next();
  }

  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    throw new UnauthorizedError("Missing or invalid Authorization header");
  }

  try {
    const token = header.split(" ")[1];
    (req as any).user = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    next();
  } catch {
    throw new UnauthorizedError("Invalid or expired token");
  }
}

export function authorize(...allowedRoles: Role[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    const user = req.user;
    if (!user) {
      return next(new ForbiddenError("No authenticated user"));
    }

    if (!allowedRoles.includes(user.role)) {
      return next(new ForbiddenError("You do not have permission to perform this action"));
    }

    next();
  };
}