import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { DatabaseService } from '../database/database.service';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { TrackEntity } from '../../common/entities/track.entity';

@Injectable()
export class TracksService {
  constructor(private readonly database: DatabaseService) {}

  findAll(): TrackEntity[] {
    return this.database.tracks;
  }

  findOne(id: string): TrackEntity {
    return this.getTrackById(id);
  }

  create(createTrackDto: CreateTrackDto): TrackEntity {
    const newTrack: TrackEntity = {
      id: randomUUID(),
      name: createTrackDto.name,
      duration: createTrackDto.duration,
      artistId: createTrackDto.artistId ?? null,
      albumId: createTrackDto.albumId ?? null,
    };

    this.database.tracks.push(newTrack);
    return newTrack;
  }

  update(id: string, updateTrackDto: UpdateTrackDto): TrackEntity {
    const track = this.getTrackById(id);

    track.name = updateTrackDto.name;
    track.duration = updateTrackDto.duration;
    track.artistId = updateTrackDto.artistId ?? null;
    track.albumId = updateTrackDto.albumId ?? null;

    return track;
  }

  remove(id: string): void {
    const index = this.database.tracks.findIndex((track) => track.id === id);

    if (index === -1) {
      throw new NotFoundException('Track not found');
    }

    this.database.tracks.splice(index, 1);
    this.database.favorites.tracks.delete(id);
  }

  private getTrackById(id: string): TrackEntity {
    const track = this.database.tracks.find((item) => item.id === id);

    if (!track) {
      throw new NotFoundException('Track not found');
    }

    return track;
  }
}
