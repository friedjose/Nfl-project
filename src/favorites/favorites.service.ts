import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class FavoritesService {
  constructor(private prisma: PrismaService) {}

  async toggle(userId: number, teamId: number) {
    const existing = await this.prisma.favorite.findUnique({
      where: {
        userId_teamId: { userId, teamId },
      },
    });

    if (existing) {
      await this.prisma.favorite.delete({ where: { id: existing.id } });
      return { favorited: false };
    }

    await this.prisma.favorite.create({ data: { userId, teamId } });
    return { favorited: true };
  }

  async findUserFavorites(userId: number) {
    return this.prisma.favorite.findMany({
      where: { userId },
      include: { team: true }, 
    });
  }
}