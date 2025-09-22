import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

import { Department } from "./department.entity";
import { User } from "./user.entity";

@Entity({ name: "employees" })
export class Employee {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: "first_name", type: "text" })
  firstName!: string;

  @Column({ name: "last_name", type: "text" })
  lastName!: string;

  @Column({ name: "position", type: "text", nullable: true })
  position?: string;

  @Column({ name: "hire_date", type: "timestamptz", default: () => "CURRENT_TIMESTAMP" })
  hireDate!: Date;

  @ManyToOne(() => Department, (department) => department.employees, { onDelete: "CASCADE" })
  department!: Department;

  //Optional link between employee record and system user account
  @OneToOne(() => User, { nullable: true, onDelete: "SET NULL" })
  @JoinColumn({ name: "user_id" })
  user?: User;

  @CreateDateColumn({ name: "created_at", type: "timestamptz", default: () => "CURRENT_TIMESTAMP" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at", type: "timestamptz", default: () => "CURRENT_TIMESTAMP" })
  updatedAt!: Date;
}