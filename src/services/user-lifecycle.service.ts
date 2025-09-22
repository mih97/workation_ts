import crypto from 'crypto';

import bcrypt from 'bcrypt';


import { BadRequestError, ConflictError, NotFoundError } from '../core/httpErrors';
import { User } from '../models/user.entity';
import { UserRepository } from '../repositories/user.repository';
import { Role } from '../core/roles';

export class UserLifecycleService {
  constructor(private readonly userRepo: UserRepository) {}

  async inviteUser(email: string): Promise<User> {
    const existing: User | null = await this.userRepo.findByEmail(email);
    if (existing) {
      throw new BadRequestError("User with this email already invited or registered");
    }
    const tempPassword: string = crypto.randomBytes(9).toString("base64");
    const passwordHash: string = await bcrypt.hash(tempPassword, 10);

    const inviteToken = crypto.randomUUID();
    const inviteTokenExpiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24); // 24h

    const user:Promise<User> = this.userRepo.create({
      email,
      role: Role.USER,
      isActive: false,
      passwordHash,
      inviteToken,
      inviteTokenExpiresAt,
    });

    return this.userRepo.save(await user);
  }


  async acceptInvite(token: string, plainPassword: string): Promise<User> {
    const user = await this.userRepo.findByInviteToken(token);
    if (!user) {
      throw new NotFoundError("Invite token not found");
    }
    if (!user.inviteTokenExpiresAt || user.inviteTokenExpiresAt < new Date()) {
      throw new BadRequestError("Invite token expired");
    }

    user.passwordHash = await bcrypt.hash(plainPassword, 10);
    user.isActive = true;
    user.inviteToken = null;
    user.inviteTokenExpiresAt = null;

    return this.userRepo.save(user);
  }

  async enableUser(userId: number): Promise<User> {
    const id: number = Number(userId);
    const user: User | null = await this.userRepo.findById(id);
    if (!user) {
      throw new NotFoundError("User", userId);
    }
    if (user.isActive) {
      throw new ConflictError(`User ${userId} is already active`);
    }

    user.isActive = true;
    return this.userRepo.save(user);
  }

  async disableUser(userId: number): Promise<User> {
    const user = await this.userRepo.findById(userId);
    if (!user) {
      throw new NotFoundError("User", userId);
    }
    if (!user.isActive) {
      throw new ConflictError(`User with ID ${userId} is already disabled`);
    }

    user.isActive = false;
    return this.userRepo.save(user);
  }

  async assignRole(userId: number, role: Role): Promise<User> {
    const user: User | null = await this.userRepo.findById(userId);
    if (!user) {
      throw new NotFoundError("User", userId);
    }

    user.role = role;
    return this.userRepo.save(user);
  }

  async requestPasswordReset(email: string): Promise<User> {
    const user = await this.userRepo.findByEmail(email);
    if (!user) {
      throw new NotFoundError("User with this email");
    }
    if (!user.isActive) {
      throw new BadRequestError("Inactive users cannot request password reset");
    }

    user.resetToken = crypto.randomUUID();
    user.resetTokenExpiresAt = new Date(Date.now() + 1000 * 60 * 30); // 30 minutes
    return this.userRepo.save(user);
  }

  async resetPassword(token: string, newPassword: string): Promise<User> {
    const user = await this.userRepo.findByResetToken(token);
    if (!user) {
      throw new NotFoundError("Password reset token");
    }
    if (!user.resetTokenExpiresAt || user.resetTokenExpiresAt < new Date()) {
      throw new BadRequestError("Reset token expired");
    }

    user.passwordHash = await bcrypt.hash(newPassword, 10);
    user.resetToken = null;
    user.resetTokenExpiresAt = null;
    return this.userRepo.save(user);
  }

  async changePassword(userId: number, oldPassword: string, newPassword: string): Promise<User> {
    const user = await this.userRepo.findById(userId);
    if (!user) {
      throw new NotFoundError("User", userId);
    }

    const matches = await bcrypt.compare(oldPassword, user.passwordHash);
    if (!matches) {
      throw new BadRequestError("Old password is incorrect");
    }

    user.passwordHash = await bcrypt.hash(newPassword, 10);
    return this.userRepo.save(user);
  }
}
