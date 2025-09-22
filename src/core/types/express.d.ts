import { Role } from "../core/roles";

declare global {
  namespace Express {
    interface UserPayload {
      sub: number;     // JWT subject = user id
      role: Role;
    }

    interface Request {
      user?: UserPayload;
    }
  }
}
