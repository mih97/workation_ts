import "reflect-metadata";
import { DataSource } from "typeorm";
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

import { env } from "./env";
import { User } from "../models/user.entity";
import { Workstation } from '../models/workstation.entity';


export const AppDataSource = new DataSource({
  type: "postgres",
  host: env.DB.host,
  port: env.DB.port,
  username: env.DB.user,
  password: env.DB.pass,
  database: env.DB.name,
  entities: [User,Workstation],
  migrations: ["src/migrations/*.ts"],
  synchronize: false,
  logging: ["query", "error"],
  namingStrategy: new SnakeNamingStrategy(),
});