import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany
} from 'typeorm';

import { Company } from "./company.entity";
import { Employee } from './employee.entity';

@Entity({ name: "departments" })
export class Department {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: "name", type: "text" })
  name!: string;

  @ManyToOne(() => Company, (company) => company.departments, { onDelete: "CASCADE" })
  company!: Company;

  @OneToMany(() => Employee, (employee) => employee.department)
  employees!: Employee[];

  @CreateDateColumn({ name: "created_at", type: "timestamptz", default: () => "CURRENT_TIMESTAMP" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at", type: "timestamptz", default: () => "CURRENT_TIMESTAMP" })
  updatedAt!: Date;
}

