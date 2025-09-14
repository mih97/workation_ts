import express from "express";
import cors from "cors";
import helmet from "helmet";
import { routes } from "./routes";
import { errorHandler } from "./middlewares/errorHandler";
import { NotFoundError } from './core/httpErrors';
import { authMiddleware } from './middlewares/auth.middleware';

const app = express();
app.use(helmet());
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

app.use(authMiddleware);
app.use(routes);

app.use((_req, _res, next) => {
  next(new NotFoundError("Route"));
});

app.use(errorHandler); 

export default app;