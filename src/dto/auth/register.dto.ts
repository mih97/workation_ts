import { IsEmail, Length } from "class-validator";

export class RegisterDto {
  @IsEmail()
  email!: string;

  @Length(8, 100)
  password!: string;
}