import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findOne(username: string) {
    return this.prisma.user.findUnique({ where: { username } });
  }

  async create(username: string, hashedPassword: string) {
    return this.prisma.user.create({
      data: { username, password: hashedPassword },
    });
  }
}
