import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from "typeorm";

import { Department } from "./department.entity";

@Entity({ name: "companies" })
export class Company {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: "name", type: "text", unique: true })
  name!: string;

  @Column({ name: "address", type: "text", nullable: true })
  address?: string;

  @CreateDateColumn({ name: "created_at", type: "timestamptz", default: () => "CURRENT_TIMESTAMP" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at", type: "timestamptz", default: () => "CURRENT_TIMESTAMP" })
  updatedAt!: Date;

  @OneToMany(() => Department, (dept) => dept.company)
  departments!: Department[];
}