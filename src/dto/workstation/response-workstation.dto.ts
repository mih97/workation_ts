import { Expose } from 'class-transformer';

export class WorkstationResponseDto {
  @Expose()
  id!: number;

  @Expose()
  employeeName!: string;

  @Expose()
  originCountry!: string;

  @Expose()
  destinationCountry!: string;

  @Expose()
  workingDays!: number;

  @Expose()
  startDate!: Date;

  @Expose()
  endDate!: Date;

  @Expose()
  risk!: string;
}