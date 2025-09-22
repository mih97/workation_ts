import { IsEnum } from "class-validator";
import { Expose } from "class-transformer";

import { Role } from "../../core/roles";

export class AssignRoleDto {
  @IsEnum(Role)
  @Expose()
  role!: Role;
}