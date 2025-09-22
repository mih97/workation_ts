import { IsDateString, IsInt, IsOptional, IsString, Length, Min } from "class-validator";
import { Expose } from 'class-transformer';

export class UpdateWorkstationDto {
  @IsOptional() @IsString() @Length(1, 120)
  @Expose()
  employeeName?: string;

  @IsOptional() @IsString() @Length(1, 120)
  @Expose()
  originCountry?: string;

  @IsOptional() @IsString() @Length(1, 120)
  @Expose()
  destinationCountry?: string;

  @IsOptional() @IsInt() @Min(0)
  @Expose()
  workingDays?: number;

  @IsOptional() @IsDateString()
  @Expose()
  startDate?: string;

  @IsOptional() @IsDateString()
  @Expose()
  endDate?: string;

  @IsOptional() @IsString() @Length(1, 50)
  @Expose()
  risk?: string;
}