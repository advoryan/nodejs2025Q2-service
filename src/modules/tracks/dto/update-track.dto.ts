import { IsInt, IsOptional, IsString, MinLength, IsUUID } from 'class-validator';

export class UpdateTrackDto {
  @IsString()
  @MinLength(1)
  name: string;

  @IsOptional()
  @IsUUID('4')
  artistId: string | null;

  @IsOptional()
  @IsUUID('4')
  albumId: string | null;

  @IsInt()
  duration: number;
}
