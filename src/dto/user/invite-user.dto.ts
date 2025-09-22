import { IsEmail, IsEnum } from "class-validator";
import { Expose } from "class-transformer";

import { Role } from "../../core/roles";

export class InviteUserDto {
  @IsEmail()
  @Expose()
  email!: string;

  @IsEnum(Role)
  @Expose()
  role!: Role.USER;
}