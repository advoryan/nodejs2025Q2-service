import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { ArtistEntity } from '../../common/entities/artist.entity';
import { AlbumEntity } from '../../common/entities/album.entity';
import { TrackEntity } from '../../common/entities/track.entity';
import { PrismaService } from '../prisma/prisma.service';

export interface FavoritesResponse {
  artists: ArtistEntity[];
  albums: AlbumEntity[];
  tracks: TrackEntity[];
}

@Injectable()
export class FavoritesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<FavoritesResponse> {
    const [artists, albums, tracks] = await Promise.all([
      this.prisma.favoriteArtist.findMany({ include: { artist: true } }),
      this.prisma.favoriteAlbum.findMany({ include: { album: true } }),
      this.prisma.favoriteTrack.findMany({ include: { track: true } }),
    ]);

    return {
      artists: artists.map((entry) => entry.artist),
      albums: albums.map((entry) => entry.album),
      tracks: tracks.map((entry) => entry.track),
    };
  }

  async addArtist(id: string): Promise<ArtistEntity> {
    const artist = await this.prisma.artist.findUnique({ where: { id } });

    if (!artist) {
      throw new UnprocessableEntityException('Artist does not exist');
    }

    await this.prisma.favoriteArtist.upsert({
      where: { artistId: id },
      update: {},
      create: { artistId: id },
    });

    return artist;
  }

  async removeArtist(id: string): Promise<void> {
    const favorite = await this.prisma.favoriteArtist.findUnique({
      where: { artistId: id },
    });

    if (!favorite) {
      throw new NotFoundException('Artist is not in favorites');
    }

    await this.prisma.favoriteArtist.delete({ where: { artistId: id } });
  }

  async addAlbum(id: string): Promise<AlbumEntity> {
    const album = await this.prisma.album.findUnique({ where: { id } });

    if (!album) {
      throw new UnprocessableEntityException('Album does not exist');
    }

    await this.prisma.favoriteAlbum.upsert({
      where: { albumId: id },
      update: {},
      create: { albumId: id },
    });

    return album;
  }

  async removeAlbum(id: string): Promise<void> {
    const favorite = await this.prisma.favoriteAlbum.findUnique({
      where: { albumId: id },
    });

    if (!favorite) {
      throw new NotFoundException('Album is not in favorites');
    }

    await this.prisma.favoriteAlbum.delete({ where: { albumId: id } });
  }

  async addTrack(id: string): Promise<TrackEntity> {
    const track = await this.prisma.track.findUnique({ where: { id } });

    if (!track) {
      throw new UnprocessableEntityException('Track does not exist');
    }

    await this.prisma.favoriteTrack.upsert({
      where: { trackId: id },
      update: {},
      create: { trackId: id },
    });

    return track;
  }

  async removeTrack(id: string): Promise<void> {
    const favorite = await this.prisma.favoriteTrack.findUnique({
      where: { trackId: id },
    });

    if (!favorite) {
      throw new NotFoundException('Track is not in favorites');
    }

    await this.prisma.favoriteTrack.delete({ where: { trackId: id } });
  }
}
