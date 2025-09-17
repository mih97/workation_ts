import { Request, Response, NextFunction } from "express";

import { HttpError } from "../core/httpErrors";


export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  if (err instanceof HttpError) {
    res.status(err.status).json({
      error: err.message,
      code: err.code,
    });
    return;
  }

  console.error("Unexpected error:", err);

  res.status(500).json({
    error: "Internal Server Error",
    code: "INTERNAL_SERVER_ERROR",
  });
}