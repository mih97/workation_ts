import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn
} from 'typeorm';

import { Role } from '../core/roles';
import { Employee } from './employee.entity';

@Entity({ name: "users" })
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "text", unique: true })
  email!: string;

  @Column({ name: "password_hash", type: "text" })
  passwordHash!: string;

  @Column({ type: "enum", enum: Role, default: Role.USER })
  role!: Role;

  @Column({ name: "refresh_token", type: "text", nullable: true })
  refreshToken?: string;

  @Column({ name: "is_active", type: "boolean", default: false })
  isActive!: boolean;

  // Invitation token for self-service onboarding
  @Column({ name: "reset_token", type: "text", nullable: true })
  resetToken?: string | null = null;

  @Column({ name: "reset_expires_at", type: "timestamptz", nullable: true })
  resetTokenExpiresAt?:  Date | null = null;

  // Invitation token for self-service onboarding
  @Column({ name: "invite_token", type: "text", nullable: true })
  inviteToken?: string | null;

  @Column({ name: "invite_expires_at", type: "timestamptz", nullable: true })
  inviteTokenExpiresAt?:  Date | null;

  @CreateDateColumn({ name: "created_at", type: "timestamptz", default: () => "CURRENT_TIMESTAMP" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at", type: "timestamptz", default: () => "CURRENT_TIMESTAMP" })
  updatedAt!: Date;

  @OneToOne(() => Employee, (emp) => emp.user, { onDelete: "CASCADE" })
  @JoinColumn({ name: "employee_id" })
  employee!: Employee;
}