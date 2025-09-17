import { QueryFailedError } from "typeorm";

/** Minimal shape of a Postgres driver error we care about. */
export interface PgDriverError {
  code: string;            // e.g. "23505" (unique_violation)
  constraint?: string;
  detail?: string;
}

/** Try to extract a typed driver error object (no `any`). */
export function getPgDriverError(err: QueryFailedError): PgDriverError | null {
  const raw: unknown = err.driverError;
  if (typeof raw !== "object" || raw === null) return null;

  const rec = raw as Record<string, unknown>;
  const code = rec.code;
  if (typeof code !== "string") return null;

  return {
    code,
    constraint: typeof rec.constraint === "string" ? rec.constraint : undefined,
    detail: typeof rec.detail === "string" ? rec.detail : undefined,
  };
}

/** True for Postgres unique-violation (SQLSTATE 23505). */
export function isPgUniqueViolation(e: unknown): e is QueryFailedError {
  if (!(e instanceof QueryFailedError)) return false;
  const drv = getPgDriverError(e);
  return drv?.code === "23505";
}