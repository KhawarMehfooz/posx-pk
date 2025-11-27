import { Controller, Post, Get, Param, Body, Put, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from '@prisma/client';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() body: { email: string; name?: string }): Promise<User> {
    return this.usersService.create(body);
  }

  @Get()
  findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<User | null> {
    return this.usersService.findOne(Number(id));
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() body: { email?: string; name?: string },
  ): Promise<User> {
    return this.usersService.update(Number(id), body);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<User> {
    return this.usersService.remove(Number(id));
  }
}
