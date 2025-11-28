import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { BadRequestException } from '@nestjs/common';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) { }

  async create(dto: CreateCategoryDto) {
    const exists = await this.prisma.category.findUnique({
      where: { name: dto.name },
    });

    if (exists) {
      throw new BadRequestException('Category name already exists');
    }

    return this.prisma.category.create({ data: dto });
  }

  async findAll(page = 1, limit = 10, search = '') {
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      this.prisma.category.findMany({
        where: {
          name: { contains: search },
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.category.count({
        where: {
          name: { contains: search },
        },
      }),
    ]);

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: number) {
    const category = await this.prisma.category.findUnique({
      where: { id },
    });

    if (!category) throw new NotFoundException('Category not found');

    return category;
  }

  async update(id: number, dto: UpdateCategoryDto) {
    await this.findOne(id);
    return this.prisma.category.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.category.delete({ where: { id } });
  }
}
