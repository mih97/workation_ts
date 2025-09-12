import express from "express";
import cors from "cors";
import helmet from "helmet";
import { routes } from "./routes";
import { errorHandler } from "./middlewares/errorHandler";

const app = express();
app.use(helmet());
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

app.use(routes);
app.use(errorHandler); 

export default app;