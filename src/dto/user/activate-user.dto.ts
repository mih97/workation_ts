import { IsString, Length } from "class-validator";
import { Expose } from "class-transformer";

export class ActivateUserDto {
  @IsString()
  @Expose()
  token!: string;

  @IsString()
  @Length(8, 255) // enforce minimum length
  @Expose()
  password!: string;
}