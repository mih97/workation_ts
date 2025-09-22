import { IsEnum } from "class-validator";

import { Role } from "../../core/roles";

export class AssignRoleDto {
  @IsEnum(Role, { message: "role must be one of: user, manager, admin" })
  role!: Role;
}