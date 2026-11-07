import { Controller, Get, Post, Body, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { AuthGuard } from '../auth/auth.guard';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @UseGuards(AuthGuard)
  @Post()
  create(@Request() req: any, @Body() dto: CreateReviewDto) {
    return this.reviewsService.create(req.user.sub, dto);
  }

  @Get('team/:teamId/stats')
  getTeamStats(@Param('teamId') teamId: string) {
    return this.reviewsService.getTeamStats(+teamId);
  }

  @Get('team/:teamId')
  findAllByTeam(@Param('teamId') teamId: string) {
    return this.reviewsService.findAllByTeam(+teamId);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Request() req: any, @Param('id') id: string) {
    return this.reviewsService.remove(req.user.sub, +id);
  }
}
