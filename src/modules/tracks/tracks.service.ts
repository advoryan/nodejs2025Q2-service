import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { TrackEntity } from '../../common/entities/track.entity';

@Injectable()
export class TracksService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(): Promise<TrackEntity[]> {
    return this.prisma.track.findMany();
  }

  async findOne(id: string): Promise<TrackEntity> {
    return this.getTrackById(id);
  }

  create(createTrackDto: CreateTrackDto): Promise<TrackEntity> {
    return this.prisma.track.create({
      data: {
        id: randomUUID(),
        name: createTrackDto.name,
        duration: createTrackDto.duration,
        artistId: createTrackDto.artistId ?? null,
        albumId: createTrackDto.albumId ?? null,
      },
    });
  }

  async update(
    id: string,
    updateTrackDto: UpdateTrackDto,
  ): Promise<TrackEntity> {
    await this.getTrackById(id);

    return this.prisma.track.update({
      where: { id },
      data: {
        name: updateTrackDto.name,
        duration: updateTrackDto.duration,
        artistId: updateTrackDto.artistId ?? null,
        albumId: updateTrackDto.albumId ?? null,
      },
    });
  }

  async remove(id: string): Promise<void> {
    await this.getTrackById(id);
    await this.prisma.track.delete({ where: { id } });
  }

  private async getTrackById(id: string): Promise<TrackEntity> {
    const track = await this.prisma.track.findUnique({ where: { id } });

    if (!track) {
      throw new NotFoundException('Track not found');
    }

    return track;
  }
}
