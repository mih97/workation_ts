import { Expose } from "class-transformer";

import { Role } from "../../core/roles";

export class UserResponseDto {
  @Expose()
  id!: number;

  @Expose()
  email!: string;

  @Expose()
  role!: Role;

  @Expose()
  active!: boolean;

  @Expose()
  createdAt!: Date;

  @Expose()
  updatedAt!: Date;
}