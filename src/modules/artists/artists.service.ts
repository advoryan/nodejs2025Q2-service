import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { DatabaseService } from '../database/database.service';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { ArtistEntity } from '../../common/entities/artist.entity';

@Injectable()
export class ArtistsService {
  constructor(private readonly database: DatabaseService) {}

  findAll(): ArtistEntity[] {
    return this.database.artists;
  }

  findOne(id: string): ArtistEntity {
    return this.getArtistById(id);
  }

  create(createArtistDto: CreateArtistDto): ArtistEntity {
    const newArtist: ArtistEntity = {
      id: randomUUID(),
      ...createArtistDto,
    };

    this.database.artists.push(newArtist);
    return newArtist;
  }

  update(id: string, updateArtistDto: UpdateArtistDto): ArtistEntity {
    const artist = this.getArtistById(id);

    artist.name = updateArtistDto.name;
    artist.grammy = updateArtistDto.grammy;

    return artist;
  }

  remove(id: string): void {
    const index = this.database.artists.findIndex((artist) => artist.id === id);

    if (index === -1) {
      throw new NotFoundException('Artist not found');
    }

    this.database.artists.splice(index, 1);
    this.database.favorites.artists.delete(id);

    this.database.albums.forEach((album) => {
      if (album.artistId === id) {
        album.artistId = null;
      }
    });

    this.database.tracks.forEach((track) => {
      if (track.artistId === id) {
        track.artistId = null;
      }
    });
  }

  private getArtistById(id: string): ArtistEntity {
    const artist = this.database.artists.find((item) => item.id === id);

    if (!artist) {
      throw new NotFoundException('Artist not found');
    }

    return artist;
  }
}
