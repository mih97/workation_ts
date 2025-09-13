import { Router } from "express";
import { userRouter } from "./routes/user.routes";
import { workstationRouter } from './routes/workstation.routes';
import { authRouter } from './routes/auth.routes';

export const routes = Router();
routes.use("/auth",authRouter);
routes.use("/users", userRouter);
routes.use("/workstations", workstationRouter);