import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { AlbumEntity } from '../../common/entities/album.entity';

@Injectable()
export class AlbumsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(): Promise<AlbumEntity[]> {
    return this.prisma.album.findMany();
  }

  async findOne(id: string): Promise<AlbumEntity> {
    return this.getAlbumById(id);
  }

  create(createAlbumDto: CreateAlbumDto): Promise<AlbumEntity> {
    return this.prisma.album.create({
      data: {
        id: randomUUID(),
        name: createAlbumDto.name,
        year: createAlbumDto.year,
        artistId: createAlbumDto.artistId ?? null,
      },
    });
  }

  async update(
    id: string,
    updateAlbumDto: UpdateAlbumDto,
  ): Promise<AlbumEntity> {
    await this.getAlbumById(id);

    return this.prisma.album.update({
      where: { id },
      data: {
        name: updateAlbumDto.name,
        year: updateAlbumDto.year,
        artistId: updateAlbumDto.artistId ?? null,
      },
    });
  }

  async remove(id: string): Promise<void> {
    await this.getAlbumById(id);
    await this.prisma.album.delete({ where: { id } });
  }

  private async getAlbumById(id: string): Promise<AlbumEntity> {
    const album = await this.prisma.album.findUnique({ where: { id } });

    if (!album) {
      throw new NotFoundException('Album not found');
    }

    return album;
  }
}
