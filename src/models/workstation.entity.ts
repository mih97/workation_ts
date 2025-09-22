import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"


@Entity({ name: "workstations" })
export class Workstation {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: "employee_name", type: "text" })
  employeeName!: string;

  @Column({ name: "origin_country", type: "text" })
  originCountry!: string;

  @Column({ name: "destination_country", type: "text" })
  destinationCountry!: string;

  @Column({ name: "working_days", type: "int", default: 0 })
  workingDays!: number;

  @Column({ name: "start_date", type: "timestamptz", default: () => "CURRENT_TIMESTAMP" })
  startDate!: Date;

  @Column({ name: "end_date", type: "timestamptz", default: () => "CURRENT_TIMESTAMP" })
  endDate!: Date;

  @Column({ type: "text" })
  risk!: string;
}