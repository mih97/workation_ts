import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { UnauthorizedError } from '../core/httpErrors';

export function authMiddleware(req: Request, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    throw new UnauthorizedError("Missing or invalid Authorization header");
  }

  const token = header.split(" ")[1];

  try {
    (req as any).user = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    next();
  } catch (err) {
    throw new UnauthorizedError("Invalid or expired token");
  }
}