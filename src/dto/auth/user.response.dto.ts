import { Role } from '../../core/roles';

export class UserResponseDto {
  id!: number;
  email!: string;
  role!: Role;
}