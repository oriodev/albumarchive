import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { AlbumService } from './album.service';
import { Album } from './schemas/album.schema';
import { CreateAlbumDto } from './dto/create-album.dto';

import { Query as ExpressQuery } from 'express-serve-static-core';

@Controller('albums')
export class AlbumController {
    constructor(private albumService: AlbumService) {}

    // GET.

    @Get()
    async getAllAlbums(@Query() query: ExpressQuery): Promise<{ albums: Album[]; total: number }> {
        return await this.albumService.getAllAlbums(query)
    }

    @Get(':title/title')
    async getAlbumByTitle(
        @Param('title')
        title: string
    ): Promise<Album> {
        return await this.albumService.getAlbumByTitle(title)
    }

    @Get(':id/id')
    async getAlbumById(
        @Param('id')
        id: string
    ): Promise<Album> {
        return await this.albumService.getAlbumById(id)
    }

    @Get(':artist/artist')
    async getAlbumsByArtist(
        @Param('artist')
        artistName: string
    ): Promise<Album[]> {
        return await this.albumService.getAlbumsByArtist(artistName)
    }


    // POST.

    @Post()
    async createAlbum(@Body() album: CreateAlbumDto): Promise<Album> {
        return this.albumService.create(album)
    }
}