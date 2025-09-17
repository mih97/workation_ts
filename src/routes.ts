import { Router } from "express";

import { workstationRouter } from './routes/workstation.routes';
import { authRouter } from './routes/auth.routes';

export const routes = Router();
routes.use("/auth",authRouter);
routes.use("/workstations", workstationRouter);