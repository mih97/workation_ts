import { IsDateString, IsInt, IsString, Length, Min } from "class-validator";
import { Expose } from "class-transformer";

export class CreateWorkstationDto {
  @IsString() @Length(1, 120)
  @Expose()
  employeeName!: string;

  @IsString() @Length(1, 120)
  @Expose()
  originCountry!: string;

  @IsString() @Length(1, 120)
  @Expose()
  destinationCountry!: string;

  @IsInt() @Min(0)
  @Expose()
  workingDays!: number;

  @IsDateString()
  @Expose()
  startDate!: string;

  @IsDateString()
  @Expose()
  endDate!: string;

  @IsString() @Length(1, 50)
  @Expose()
  risk!: string;
}