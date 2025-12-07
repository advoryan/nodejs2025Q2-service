import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { DatabaseService } from '../database/database.service';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { AlbumEntity } from '../../common/entities/album.entity';

@Injectable()
export class AlbumsService {
  constructor(private readonly database: DatabaseService) {}

  findAll(): AlbumEntity[] {
    return this.database.albums;
  }

  findOne(id: string): AlbumEntity {
    return this.getAlbumById(id);
  }

  create(createAlbumDto: CreateAlbumDto): AlbumEntity {
    const newAlbum: AlbumEntity = {
      id: randomUUID(),
      name: createAlbumDto.name,
      year: createAlbumDto.year,
      artistId: createAlbumDto.artistId ?? null,
    };

    this.database.albums.push(newAlbum);
    return newAlbum;
  }

  update(id: string, updateAlbumDto: UpdateAlbumDto): AlbumEntity {
    const album = this.getAlbumById(id);

    album.name = updateAlbumDto.name;
    album.year = updateAlbumDto.year;
    album.artistId = updateAlbumDto.artistId ?? null;

    return album;
  }

  remove(id: string): void {
    const index = this.database.albums.findIndex((album) => album.id === id);

    if (index === -1) {
      throw new NotFoundException('Album not found');
    }

    this.database.albums.splice(index, 1);
    this.database.favorites.albums.delete(id);

    this.database.tracks.forEach((track) => {
      if (track.albumId === id) {
        track.albumId = null;
      }
    });
  }

  private getAlbumById(id: string): AlbumEntity {
    const album = this.database.albums.find((item) => item.id === id);

    if (!album) {
      throw new NotFoundException('Album not found');
    }

    return album;
  }
}
