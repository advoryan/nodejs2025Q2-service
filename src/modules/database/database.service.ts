import { Injectable } from '@nestjs/common';
import { UserEntity } from '../../common/entities/user.entity';
import { ArtistEntity } from '../../common/entities/artist.entity';
import { AlbumEntity } from '../../common/entities/album.entity';
import { TrackEntity } from '../../common/entities/track.entity';
import { FavoritesStore } from '../../common/entities/favorites.entity';

@Injectable()
export class DatabaseService {
  users: UserEntity[] = [];
  artists: ArtistEntity[] = [];
  albums: AlbumEntity[] = [];
  tracks: TrackEntity[] = [];
  favorites: FavoritesStore = {
    artists: new Set<string>(),
    albums: new Set<string>(),
    tracks: new Set<string>(),
  };
}
