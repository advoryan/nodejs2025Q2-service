import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { DatabaseService } from '../database/database.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { SafeUser, UserEntity } from '../../common/entities/user.entity';

@Injectable()
export class UsersService {
  constructor(private readonly database: DatabaseService) {}

  findAll(): SafeUser[] {
    return this.database.users.map((user) => this.toSafeUser(user));
  }

  findOne(id: string): SafeUser {
    const user = this.getUserById(id);
    return this.toSafeUser(user);
  }

  create(createUserDto: CreateUserDto): SafeUser {
    const timestamp = Date.now();
    const newUser: UserEntity = {
      id: randomUUID(),
      login: createUserDto.login,
      password: createUserDto.password,
      version: 1,
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    this.database.users.push(newUser);
    return this.toSafeUser(newUser);
  }

  updatePassword(id: string, updatePasswordDto: UpdatePasswordDto): SafeUser {
    const user = this.getUserById(id);

    if (user.password !== updatePasswordDto.oldPassword) {
      throw new ForbiddenException('Old password is incorrect');
    }

    user.password = updatePasswordDto.newPassword;
    user.version += 1;
    user.updatedAt = Date.now();

    return this.toSafeUser(user);
  }

  remove(id: string): void {
    const index = this.database.users.findIndex((user) => user.id === id);

    if (index === -1) {
      throw new NotFoundException('User not found');
    }

    this.database.users.splice(index, 1);
  }

  private getUserById(id: string): UserEntity {
    const user = this.database.users.find((item) => item.id === id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  private toSafeUser(user: UserEntity): SafeUser {
    const { password, ...safeUser } = user;
    return safeUser;
  }
}
