import request from 'supertest';
import express, { Express, Router } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { DataSource } from 'typeorm';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';

import { User } from '../src/models/user.entity';
import { errorHandler } from '../src/middlewares/errorHandler';
import { AuthService } from '../src/services/auth.service';
import { AuthController } from '../src/controller/auth.controller';
import { validateBody } from '../src/middlewares/validate';
import { RegisterDto } from '../src/dto/auth/register.dto';
import { LoginDto } from '../src/dto/auth/login.dto';
import { UserRepository } from '../src/repositories/user.repository';

function makeTestApp(ds: DataSource): Express {
  const app = express();
  app.use(helmet());
  app.use(cors({ origin: true, credentials: true }));
  app.use(express.json());

  const repo: UserRepository = new UserRepository(ds.getRepository(User));
  const svc = new AuthService(repo);
  const ctl = new AuthController(svc);

  const router: Router = Router();
  router.post("/register", validateBody(RegisterDto), ctl.register);
  router.post("/login", validateBody(LoginDto), ctl.login);

  app.use("/auth", router);
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
    database: process.env.DB_NAME ?? "appdb_test",
    synchronize: true,  // OK in tests only
    dropSchema: true,   // ensure clean DB before each test suite
    entities: [User],
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
  await ds.getRepository(User).clear();
});

describe("AuthController (register & login)", () => {
  it("registers a new user", async () => {
    const res = await request(app).post("/auth/register").send({
      email: "alice@example.com",
      password: "Secret123",
    });

    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({ email: "alice@example.com", role: "user" });
    expect(res.body).not.toHaveProperty("passwordHash");
    expect(res.body).not.toHaveProperty("refreshToken");

    const saved = await ds.getRepository(User).findOneByOrFail({ email: "alice@example.com" });
    expect(saved.passwordHash).not.toBe("Secret123");
  });

  it("rejects duplicate email registration", async () => {
    await request(app).post("/auth/register").send({
      email: "bob@example.com",
      password: "Secret123",
    });

    const res = await request(app).post("/auth/register").send({
      email: "bob@example.com",
      password: "Another123",
    });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("Email already in use.");
  });

  it("logs in a registered user and returns tokens", async () => {
    await request(app).post("/auth/register").send({
      email: "charlie@example.com",
      password: "Secret123",
    });

    const res = await request(app).post("/auth/login").send({
      email: "charlie@example.com",
      password: "Secret123",
    });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("accessToken");
    expect(res.body).toHaveProperty("refreshToken");
  });

  it("rejects invalid password", async () => {
    await request(app).post("/auth/register").send({
      email: "dora@example.com",
      password: "Secret123",
    });

    const res = await request(app).post("/auth/login").send({
      email: "dora@example.com",
      password: "WrongPass",
    });

    expect(res.status).toBe(401);
    expect(res.body.error).toBe("Invalid credentials");
  });

  it("rejects invalid input", async () => {
    const res = await request(app).post("/auth/register").send({
      email: "not-an-email",
      password: "123", // too short
    });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("Validation failed");
    expect(res.body.details).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ field: "email" }),
        expect.objectContaining({ field: "password" }),
      ])
    );
  });
});