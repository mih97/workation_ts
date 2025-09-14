export class UserResponseDto {
  id!: number;
  email!: string;
  role!: "user" | "admin";
}