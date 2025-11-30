import { IsInt, IsOptional, IsString, MinLength } from 'class-validator';
import { IsUUID } from 'class-validator';

export class CreateAlbumDto {
  @IsString()
  @MinLength(1)
  name: string;

  @IsInt()
  year: number;

  @IsOptional()
  @IsUUID('4')
  artistId: string | null;
}
