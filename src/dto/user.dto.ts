import { IsEmail, IsOptional, IsString, MinLength } from "class-validator";

export class CreateUserDto {
  @IsString() @MinLength(1)
  name!: string;

  @IsEmail()
  email!: string;
}

export class UpdateUserDto {
  @IsOptional() @IsString() @MinLength(1)
  name?: string;

  @IsOptional() @IsEmail()
  email?: string;
}