import request from "supertest";
import express, { Express, Router } from "express";
import helmet from "helmet";
import cors from "cors";
import { DataSource } from 'typeorm';
import { beforeAll, afterAll, beforeEach, describe, it, expect } from "vitest";

import { User } from "../src/models/user.entity";
import { UserRepository } from "../src/repositories/user.repository";
import { UserLifecycleService } from "../src/services/user-lifecycle.service";
import { validateBody } from "../src/middlewares/validate";
import { errorHandler } from "../src/middlewares/errorHandler";
import { InviteUserDto } from "../src/dto/user/invite-user.dto";
import { ActivateUserDto } from "../src/dto/user/activate-user.dto";
import { AssignRoleDto } from "../src/dto/user/assign-role.dto";
import { ResetPasswordDto, RequestPasswordResetDto } from "../src/dto/user/reset-password.dto";
import { UserLifeCycleController } from '../src/controllers/user-life-cycle.controller';
import { Employee } from '../src/models/employee.entity';
import { Department } from '../src/models/department.entity';
import { Company } from '../src/models/company.entity';
import bcrypt from 'bcrypt';
import { Role } from '../src/core/roles';
import { authMiddleware } from '../src/middlewares/auth.middleware';
import { AuthService } from '../src/services/auth.service';
import { AuthController } from '../src/controllers/auth.controller';
import { RegisterDto } from '../src/dto/auth/register.dto';
import { LoginDto } from '../src/dto/auth/login.dto';

function makeTestApp(ds: DataSource): Express {
  const repo = new UserRepository(ds.getRepository(User));
  const svc = new UserLifecycleService(repo);
  const ctl = new UserLifeCycleController(svc)

  const router: Router = Router();
  router.post("/invite", validateBody(InviteUserDto), ctl.invite);
  router.post("/activate", validateBody(ActivateUserDto), ctl.acceptInvite);
  router.post("/disable/:id", ctl.disable);
  router.post("/request-reset", validateBody(RequestPasswordResetDto), ctl.requestPasswordReset);
  router.post("/reset-password", validateBody(ResetPasswordDto), ctl.resetPassword);
  router.post("/assign-role/:id", validateBody(AssignRoleDto), ctl.assignRole);

  const authSvc = new AuthService(repo);
  const authCtl = new AuthController(authSvc);

  const authRouter: Router = Router();
  authRouter.post("/register", validateBody(RegisterDto), authCtl.register);
  authRouter.post("/login", validateBody(LoginDto), authCtl.login);


  const app: Express = express();
  app.use(helmet());
  app.use(cors({ origin: true, credentials: true }));
  app.use(express.json());
  app.use(authMiddleware);
  app.use("/users", router);
  app.use("/auth", authRouter);
  app.use(errorHandler);

  return app;
}

let ds: DataSource;
let app: Express;
let adminToken: string;

beforeAll(async () => {
  ds = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "postgres",
    database: "appdb_test",
    synchronize: true,   //tests only
    dropSchema: true,
    entities: [User,Employee,Department,Company],
  });
  await ds.initialize();
  app = makeTestApp(ds);
});

afterAll(async () => {
  if (ds.isInitialized) await ds.destroy();
});

beforeEach(async () => {
  await ds.query('TRUNCATE TABLE employees, users RESTART IDENTITY CASCADE');
  const adminRepo = ds.getRepository(User);
  const admin: User = adminRepo.create({
    email: "admin@example.com",
    passwordHash: await bcrypt.hash("AdminPass123", 10),
    role: Role.ADMIN,
    isActive: true,
  });
  await adminRepo.save(admin);

  // 🔐 Log in seeded admin to get JWT
  const res = await request(app).post("/auth/login").send({
    email: "admin@example.com",
    password: "AdminPass123",
  });

  adminToken = res.body.accessToken;
});

describe("User Lifecycle (integration)", () => {
  it("invites a new user (admin only)", async () => {
    const res = await request(app)
      .post("/users/invite")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        email: "newuser@example.com",
        role: "user",
      });

    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({
      email: "newuser@example.com",
      role: "user",
      isActive: false,
    });

    const dbUser = await ds.getRepository(User).findOneByOrFail({
      email: "newuser@example.com",
    });
    expect(dbUser.inviteToken).toBeTruthy();
  });

  it("rejects invite without admin token", async () => {
    const res = await request(app)
      .post("/users/invite")
      .send({ email: "noauth@example.com", role: "user" });

    expect(res.status).toBe(401);  // or 403 depending on your middleware
  });


  it("assigns a role to a user (admin only)", async () => {
    // first invite with admin
    const invite = await request(app)
      .post("/users/invite")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        email: "manager@example.com",
        role: "user",
      });

    const userId = invite.body.id;

    // then assign role with admin
    const res = await request(app)
      .post(`/users/assign-role/${userId}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ role: "manager" });

    expect(res.status).toBe(200);
    expect(res.body.role).toBe("manager");

    const dbUser = await ds.getRepository(User).findOneByOrFail({ id: userId });
    expect(dbUser.role).toBe("manager");
  });

  it("requests a password reset and successfully resets the password", async () => {
    // 1. Invite new user (requires admin auth!)
    const invite = await request(app)
      .post("/users/invite")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        email: "resetme@example.com",
        role: "user",
      });

    const token = invite.body.inviteToken;

    // 2. Activate the account with initial password
    const activateRes = await request(app).post("/users/activate").send({
      token,
      password: "Initial123",
    });
    expect(activateRes.status).toBe(200);

    // 3. Request reset
    const resetReq = await request(app).post("/users/request-reset").send({
      email: "resetme@example.com",
    });
    expect(resetReq.status).toBe(200);

    // 4. Confirm reset token in DB
    const dbUser = await ds.getRepository(User).findOneByOrFail({
      email: "resetme@example.com",
    });
    expect(dbUser.resetToken).toBeTruthy();

    // 5. Perform reset with token + new password
    const resetRes = await request(app).post("/users/reset-password").send({
      token: dbUser.resetToken,
      newPassword: "NewSecret123",
    });
    expect(resetRes.status).toBe(200);

    // 6. Check DB updated hash
    const updated = await ds.getRepository(User).findOneByOrFail({
      email: "resetme@example.com",
    });
    expect(updated.passwordHash).not.toBe("NewSecret123"); // should be hashed
  });

  it("activates a user via invite token (self-service)", async () => {
    // Admin invites a user
    const inviteRes = await request(app)
      .post("/users/invite")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ email: "selfactivate@example.com", role: "user" });

    const inviteToken = inviteRes.body.inviteToken;
    expect(inviteToken).toBeTruthy();

    // User activates account with password
    const res = await request(app)
      .post("/users/activate")
      .send({ token: inviteToken, password: "Secret123" });

    expect(res.status).toBe(200);
    expect(res.body.isActive).toBe(true);

    const dbUser = await ds.getRepository(User).findOneByOrFail({
      email: "selfactivate@example.com",
    });
    expect(dbUser.isActive).toBe(true);
    expect(dbUser.passwordHash).not.toBe("Secret123"); // hashed
  });

});