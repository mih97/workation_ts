import { Router } from "express";

import { workstationRouter } from './routes/workstation.routes';
import { authRouter } from './routes/auth.routes';
import { userLifecycleRouter } from './routes/user-lifecycle.routes';

export const routes = Router();
routes.use("/auth",authRouter);
routes.use("/users", userLifecycleRouter);
routes.use("/workstations", workstationRouter);