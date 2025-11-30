import { IsBoolean, IsString, MinLength } from 'class-validator';

export class UpdateArtistDto {
  @IsString()
  @MinLength(1)
  name: string;

  @IsBoolean()
  grammy: boolean;
}
