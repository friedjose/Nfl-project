import { Module } from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { FavoritesController } from './favorites.controller';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [FavoritesController],
  providers: [PrismaService, FavoritesService],
})
export class FavoritesModule {}