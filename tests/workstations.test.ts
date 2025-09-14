import request from "supertest";
import express, { Express, Router } from "express";
import cors from "cors";
import helmet from "helmet";
import { DataSource } from "typeorm";
import { describe, it, beforeAll, afterAll, beforeEach, expect } from "vitest";

import { Workstation } from "../src/models/workstation.entity";
import { validateBody } from "../src/middlewares/validate";
import { errorHandler } from "../src/middlewares/errorHandler";
import { WorkstationRepository } from '../src/repositories/workstation.repository';
import { WorkstationService } from '../src/services/workstation.service';
import { WorkstationController } from '../src/controller/workstation.controller';
import { CreateWorkstationDto } from '../src/dto/workstationDto/create-workstation.dto';
import { UpdateWorkstationDto } from '../src/dto/workstationDto/update-workstation.dto';

function makeTestApp(ds: DataSource): Express {
  const app = express();
  app.use(helmet());
  app.use(cors({ origin: true, credentials: true }));
  app.use(express.json());

  const repo = new WorkstationRepository(ds.getRepository(Workstation));
  const svc = new WorkstationService(repo);
  const ctl = new WorkstationController(svc);

  const router: Router = Router();
  router.get("/", ctl.getAll.bind(ctl));
  router.get("/:id", ctl.getOne.bind(ctl));
  router.post("/", validateBody(CreateWorkstationDto), ctl.create);
  router.put("/:id", validateBody(UpdateWorkstationDto), ctl.update);
  router.delete("/:id", ctl.delete.bind(ctl));

  app.use("/workstations", router);
  app.use(errorHandler);

  return app;
}

let ds: DataSource;
let app: Express;

beforeAll(async () => {
    ds = new DataSource({
      type: "postgres",
      host: process.env.DB_HOST ?? "localhost",
      port: Number(process.env.DB_PORT ?? 5432),
      username: process.env.DB_USER ?? "postgres",
      password: process.env.DB_PASS ?? "postgres",
      database: process.env.DB_NAME ?? "appdb_test", //  separate test DB
      synchronize: true,
      dropSchema: true,
      entities: [Workstation],
    });
    await ds.initialize();
    app = makeTestApp(ds);
  });

  afterAll(async () => {
    if (ds.isInitialized) {
      await ds.destroy();
    }
  });

  beforeEach(async () => {
    await ds.getRepository(Workstation).clear();
  });

  describe("Workstations CRUD", () => {
    it("creates a workstation", async () => {
      const res = await request(app).post("/workstations").send({
        employeeName: "Alice",
        originCountry: "Germany",
        destinationCountry: "Spain",
        workingDays: 30,
        startDate: "2025-01-01T00:00:00Z",
        endDate: "2025-01-31T00:00:00Z",
        risk: "low",
      });

      expect(res.status).toBe(201);
      expect(res.body).toMatchObject({
        employeeName: "Alice",
        originCountry: "Germany",
        destinationCountry: "Spain",
        risk: "low",
      });
    });

    it("lists workstations", async () => {
      await request(app).post("/workstations").send({
        employeeName: "Bob",
        originCountry: "France",
        destinationCountry: "Italy",
        workingDays: 10,
        startDate: "2025-01-10T00:00:00Z",
        endDate: "2025-01-20T00:00:00Z",
        risk: "medium",
      });

      const res = await request(app).get("/workstations");
      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(1);
      expect(res.body[0]).toMatchObject({ employeeName: "Bob" });
    });

    it("updates a workstation", async () => {
      const created = await request(app).post("/workstations").send({
        employeeName: "Charlie",
        originCountry: "UK",
        destinationCountry: "USA",
        workingDays: 5,
        startDate: "2025-02-01T00:00:00Z",
        endDate: "2025-02-06T00:00:00Z",
        risk: "high",
      });

      const res = await request(app)
        .put(`/workstations/${created.body.id}`)
        .send({ workingDays: 10, risk: "low" });

      expect(res.status).toBe(200);
      expect(res.body).toMatchObject({ workingDays: 10, risk: "low" });
    });

    it("deletes a workstation", async () => {
      const created = await request(app).post("/workstations").send({
        employeeName: "Dora",
        originCountry: "Germany",
        destinationCountry: "Poland",
        workingDays: 15,
        startDate: "2025-03-01T00:00:00Z",
        endDate: "2025-03-16T00:00:00Z",
        risk: "medium",
      });

      const res = await request(app).delete(`/workstations/${created.body.id}`);
      expect(res.status).toBe(204);
    });

    it("validates bad input", async () => {
      const res = await request(app).post("/workstations").send({
        employeeName: "", // invalid
        originCountry: "Germany",
        destinationCountry: "Spain",
        workingDays: -5, // invalid
      });

      expect(res.status).toBe(400);
      expect(res.body.error).toBe("Validation failed");
      expect(res.body.details).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ field: "employeeName" }),
          expect.objectContaining({ field: "workingDays" }),
        ])
      );
    });
  });