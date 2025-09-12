import request from "supertest";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import { DataSource } from "typeorm";
import { User } from "../src/models/user.entity";
import { describe, it, beforeAll, afterAll, beforeEach, expect } from "vitest";

// Build a test app with a test DataSource
function makeTestApp(ds: DataSource) {
  const app = express();
  app.use(helmet());
  app.use(cors({ origin: true, credentials: true }));
  app.use(express.json());


  const repo = ds.getRepository(User);

  const { Router } = require("express");
  const { UserService } = require("../src/modules/users/user.service");
  const { UserController } = require("../src/modules/users/user.controller");
  const { validateBody } = require("../src/middlewares/validate");
  const { CreateUserDto, UpdateUserDto } = require("../src/modules/users/user.dto");

  const svc = new UserService(repo);
  const ctl = new UserController(svc);
  const router = Router();
  router.get("/", ctl.getAll);
  router.get("/:id", ctl.getOne);
  router.post("/", validateBody(CreateUserDto), ctl.create);
  router.put("/:id", validateBody(UpdateUserDto), ctl.update);
  router.delete("/:id", ctl.delete);

  app.use("/users", router);
  return app;
}



let ds: DataSource;
let app: express.Express;

beforeAll(async () => {
  ds = new DataSource({
    type: "sqlite",
    database: ":memory:",
    synchronize: true,   // OK for tests
    entities: [User]
  });
  await ds.initialize();
  app = makeTestApp(ds);
});

afterAll(async () => {
  await ds.destroy();
});

beforeEach(async () => {
  await ds.getRepository(User).clear();
});

describe("Users CRUD (TypeORM)", () => {
  it("creates a user", async () => {
    const res = await request(app).post("/users").send({ name: "Alice", email: "a@x.com" });
    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({ name: "Alice", email: "a@x.com" });
  });

  it("lists users", async () => {
    await request(app).post("/users").send({ name: "B", email: "b@x.com" });
    const res = await request(app).get("/users");
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
  });

  it("updates a user", async () => {
    const created = await request(app).post("/users").send({ name: "C", email: "c@x.com" });
    const res = await request(app).put(`/users/${created.body.id}`).send({ name: "C2" });
    expect(res.status).toBe(200);
    expect(res.body.name).toBe("C2");
  });

  it("deletes a user", async () => {
    const created = await request(app).post("/users").send({ name: "D", email: "d@x.com" });
    const res = await request(app).delete(`/users/${created.body.id}`);
    expect(res.status).toBe(204);
  });

  it("validates bad input", async () => {
    const res = await request(app).post("/users").send({ name: "", email: "not-an-email" });
    expect(res.status).toBe(400);
  });
});