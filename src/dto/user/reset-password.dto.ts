import { IsEmail, IsString, Length } from "class-validator";
import { Expose } from "class-transformer";

export class RequestPasswordResetDto {
  @IsEmail()
  @Expose()
  email!: string;
}

export class ResetPasswordDto {
  @IsString()
  @Expose()
  token!: string;

  @IsString()
  @Length(8, 128) // adjust as needed
  @Expose()
  newPassword!: string;
}

export class ChangePasswordDto {
  @IsString()
  @Expose()
  oldPassword!: string;

  @IsString()
  @Length(8, 128)
  @Expose()
  newPassword!: string;
}