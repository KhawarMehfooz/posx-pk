import { Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  // Create user
  create(data: Prisma.UserCreateInput): Promise<User> {
    return this.prisma.user.create({ data });
  }

  // Get all users
  findAll(): Promise<User[]> {
    return this.prisma.user.findMany();
  }

  // Get one user by ID
  findOne(id: number): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  // Update user
  update(id: number, data: Prisma.UserUpdateInput): Promise<User> {
    return this.prisma.user.update({
      where: { id },
      data,
    });
  }

  // Delete user
  remove(id: number): Promise<User> {
    return this.prisma.user.delete({
      where: { id },
    });
  }
}
