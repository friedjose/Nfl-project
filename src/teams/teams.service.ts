import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { PrismaService } from '../prisma.service';

@Injectable()
export class TeamsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateTeamDto) {
    return this.prisma.team.create({ data: dto });
  }

  async findAll() {
    return this.prisma.team.findMany();
  }

  async findOne(id: number) {
    const team = await this.prisma.team.findUnique({ where: { id } });
    if (!team) throw new NotFoundException('Equipo no encontrado');
    return team;
  }

  async update(id: number, dto: UpdateTeamDto) {
    await this.findOne(id); 
    return this.prisma.team.update({ where: { id }, data: dto });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.team.delete({ where: { id } });
  }
}