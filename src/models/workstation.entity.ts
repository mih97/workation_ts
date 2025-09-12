import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

@Entity({ name: "workstations" })
export class Workstation {
  @PrimaryGeneratedColumn()
  id!: number;


  @Column({ type: "varchar", length: 120 })
  employeeName!: string;

  @Column({ type: "varchar", length: 120 })
  originCountry!: string;

  @Column({ type: "varchar", length: 120 })
  destinationCountry!: string;

  @Column({ type: "int", default: 0 })
  workingDays!: number;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  startDate!: Date;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  endDate!: Date;

  @Column({ type: "varchar", length: 50 })
  risk!: string;
}