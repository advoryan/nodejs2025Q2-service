import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { ArtistEntity } from '../../common/entities/artist.entity';
import { AlbumEntity } from '../../common/entities/album.entity';
import { TrackEntity } from '../../common/entities/track.entity';

export interface FavoritesResponse {
  artists: ArtistEntity[];
  albums: AlbumEntity[];
  tracks: TrackEntity[];
}

@Injectable()
export class FavoritesService {
  constructor(private readonly database: DatabaseService) {}

  findAll(): FavoritesResponse {
    return {
      artists: this.findSelectedEntities(this.database.artists, this.database.favorites.artists),
      albums: this.findSelectedEntities(this.database.albums, this.database.favorites.albums),
      tracks: this.findSelectedEntities(this.database.tracks, this.database.favorites.tracks),
    };
  }

  addArtist(id: string): ArtistEntity {
    const artist = this.database.artists.find((item) => item.id === id);

    if (!artist) {
      throw new UnprocessableEntityException('Artist does not exist');
    }

    this.database.favorites.artists.add(id);
    return artist;
  }

  removeArtist(id: string): void {
    if (!this.database.favorites.artists.has(id)) {
      throw new NotFoundException('Artist is not in favorites');
    }

    this.database.favorites.artists.delete(id);
  }

  addAlbum(id: string): AlbumEntity {
    const album = this.database.albums.find((item) => item.id === id);

    if (!album) {
      throw new UnprocessableEntityException('Album does not exist');
    }

    this.database.favorites.albums.add(id);
    return album;
  }

  removeAlbum(id: string): void {
    if (!this.database.favorites.albums.has(id)) {
      throw new NotFoundException('Album is not in favorites');
    }

    this.database.favorites.albums.delete(id);
  }

  addTrack(id: string): TrackEntity {
    const track = this.database.tracks.find((item) => item.id === id);

    if (!track) {
      throw new UnprocessableEntityException('Track does not exist');
    }

    this.database.favorites.tracks.add(id);
    return track;
  }

  removeTrack(id: string): void {
    if (!this.database.favorites.tracks.has(id)) {
      throw new NotFoundException('Track is not in favorites');
    }

    this.database.favorites.tracks.delete(id);
  }

  private findSelectedEntities<T extends { id: string }>(
    items: T[],
    selected: Set<string>,
  ): T[] {
    return items.filter((item) => selected.has(item.id));
  }
}
