import { Router } from "express";
import { userRouter } from "./routes/user.routes";
import { workstationRouter } from './routes/workstation.routes';

export const routes = Router();
routes.use("/users", userRouter);
routes.use("/workstations", workstationRouter);