import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { randomUUID } from 'crypto';
import { User } from '@prisma/client';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { SafeUser, UserEntity } from '../../common/entities/user.entity';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<SafeUser[]> {
    const users = await this.prisma.user.findMany();
    return users.map((user) => this.toSafeUser(user));
  }

  async findOne(id: string): Promise<SafeUser> {
    const user = await this.getUserById(id);
    return this.toSafeUser(user);
  }

  async create(createUserDto: CreateUserDto): Promise<SafeUser> {
    const timestamp = BigInt(Date.now());
    const user = await this.prisma.user.create({
      data: {
        id: randomUUID(),
        login: createUserDto.login,
        password: createUserDto.password,
        version: 1,
        createdAt: timestamp,
        updatedAt: timestamp,
      },
    });

    return this.toSafeUser(user);
  }

  async updatePassword(
    id: string,
    updatePasswordDto: UpdatePasswordDto,
  ): Promise<SafeUser> {
    const user = await this.getUserById(id);

    if (user.password !== updatePasswordDto.oldPassword) {
      throw new ForbiddenException('Old password is incorrect');
    }

    const timestamp = BigInt(Date.now());
    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: {
        password: updatePasswordDto.newPassword,
        version: user.version + 1,
        updatedAt: timestamp,
      },
    });

    return this.toSafeUser(updatedUser);
  }

  async remove(id: string): Promise<void> {
    await this.getUserById(id);
    await this.prisma.user.delete({ where: { id } });
  }

  private async getUserById(id: string): Promise<User> {
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  private toSafeUser(user: User): SafeUser {
    const entity = this.toUserEntity(user);
    return {
      id: entity.id,
      login: entity.login,
      version: entity.version,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }

  private toUserEntity(user: User): UserEntity {
    return {
      id: user.id,
      login: user.login,
      password: user.password,
      version: user.version,
      createdAt: Number(user.createdAt),
      updatedAt: Number(user.updatedAt),
    };
  }
}
