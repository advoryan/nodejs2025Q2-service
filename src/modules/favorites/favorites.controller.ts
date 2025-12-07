import {
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { FavoritesService } from './favorites.service';

@Controller('favs')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Get()
  findAll() {
    return this.favoritesService.findAll();
  }

  @Post('artist/:id')
  addArtist(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    return this.favoritesService.addArtist(id);
  }

  @Delete('artist/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeArtist(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ) {
    await this.favoritesService.removeArtist(id);
  }

  @Post('album/:id')
  addAlbum(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    return this.favoritesService.addAlbum(id);
  }

  @Delete('album/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeAlbum(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ) {
    await this.favoritesService.removeAlbum(id);
  }

  @Post('track/:id')
  addTrack(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    return this.favoritesService.addTrack(id);
  }

  @Delete('track/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeTrack(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ) {
    await this.favoritesService.removeTrack(id);
  }
}
