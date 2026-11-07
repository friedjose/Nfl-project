import { Controller, Post, Get, Param, UseGuards, Request } from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { AuthGuard } from '../auth/auth.guard';

@Controller('favorites')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @UseGuards(AuthGuard)
  @Post(':teamId')
  toggle(@Request() req: any, @Param('teamId') teamId: string) {
    return this.favoritesService.toggle(req.user.sub, +teamId);
  }

  @UseGuards(AuthGuard)
  @Get()
  findMyFavorites(@Request() req: any) {
    return this.favoritesService.findUserFavorites(req.user.sub);
  }
}