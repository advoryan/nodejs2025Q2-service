import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { PrismaService } from '../prisma/prisma.service';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { ArtistEntity } from '../../common/entities/artist.entity';

@Injectable()
export class ArtistsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(): Promise<ArtistEntity[]> {
    return this.prisma.artist.findMany();
  }

  async findOne(id: string): Promise<ArtistEntity> {
    return this.getArtistById(id);
  }

  create(createArtistDto: CreateArtistDto): Promise<ArtistEntity> {
    return this.prisma.artist.create({
      data: {
        id: randomUUID(),
        ...createArtistDto,
      },
    });
  }

  async update(
    id: string,
    updateArtistDto: UpdateArtistDto,
  ): Promise<ArtistEntity> {
    await this.getArtistById(id);

    return this.prisma.artist.update({
      where: { id },
      data: {
        name: updateArtistDto.name,
        grammy: updateArtistDto.grammy,
      },
    });
  }

  async remove(id: string): Promise<void> {
    await this.getArtistById(id);
    await this.prisma.artist.delete({ where: { id } });
  }

  private async getArtistById(id: string): Promise<ArtistEntity> {
    const artist = await this.prisma.artist.findUnique({ where: { id } });

    if (!artist) {
      throw new NotFoundException('Artist not found');
    }

    return artist;
  }
}
