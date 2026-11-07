// src/reviews/reviews.service.ts
import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { PrismaService } from '../prisma.service';

@Injectable()
export class ReviewsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: number, dto: CreateReviewDto) {
    return this.prisma.review.upsert({
      where: {
        userId_teamId: {
          userId,
          teamId: dto.teamId,
        },
      },
      update: {
        rating: dto.rating,
        comment: dto.comment,
      },
      create: {
        rating: dto.rating,
        comment: dto.comment,
        teamId: dto.teamId,
        userId,
      },
    });
  }

  async findAllByTeam(teamId: number) {
    return this.prisma.review.findMany({
      where: { teamId },
      include: {
        user: { select: { username: true } }, // solo el username, nunca el password
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async remove(userId: number, id: number) {
    const review = await this.prisma.review.findUnique({ where: { id } });
    if (!review) throw new NotFoundException('Reseña no encontrada');
    if (review.userId !== userId) {
      throw new ForbiddenException('No puedes eliminar la reseña de otro usuario');
    }
    return this.prisma.review.delete({ where: { id } });
  }
  async getTeamStats(teamId: number) {
    const result = await this.prisma.review.aggregate({
      where: { teamId },
      _avg: { rating: true },
      _count: { rating: true },
    });

    return {
      average: result._avg.rating ?? 0,
      total: result._count.rating,
    };
  }
}
