import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

import { Role } from '../core/roles';

@Entity({ name: "users" })
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "varchar", length: 160, unique: true })
  email!: string;

  @Column({ type: "varchar", length: 255 })
  passwordHash!: string;

  @Column({ type: "enum", enum: Role, default: Role.USER })
  role!: Role;

  @Column({ type: "varchar", length: 255, nullable: true })
  refreshToken?: string;
}