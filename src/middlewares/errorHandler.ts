import { Request, Response, NextFunction } from "express";
import { HttpError } from "../core/httpErrors";

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  if (err instanceof HttpError) {
    return res
      .status(err.status)
      .json({ message: err.message, details: err.details ?? null });
  }

  console.error("Unexpected error:", err);
  return res.status(500).json({ message: "Internal server error" });
}