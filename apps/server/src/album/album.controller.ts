import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { AlbumService } from './album.service';
import { Album } from './schemas/album.schema';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';

import { Query as ExpressQuery } from 'express-serve-static-core';

@Controller('album')
export class AlbumController {
    constructor(private albumService: AlbumService) {}

    
    @Post()
    async createAlbum(@Body() album: CreateAlbumDto): Promise<Album> {
        return this.albumService.create(album)
    }
    
    @Get('/by-title/')
    async getAlbumByTitle(
        @Query('title')
        title: string
    ): Promise<Album> {
        return await this.albumService.findByName(title)
    }

    @Get(':id')
    async getAlbum(
        @Param('id')
        id: string
    ): Promise<Album> {
        return await this.albumService.findById(id)
    }

    @Get(':artist/artist')
    async getAlbumsByArtist(
        @Param('artist')
        artistName: string
    ): Promise<Album[]> {
        return await this.albumService.findByArtist(artistName)
    }

    @Get(':genre/genre')
    async getAlbumsByGenre(
        @Param('genre')
        genre: string
    ): Promise<Album[]> {
        return await this.albumService.findByGenre(genre)
    }

    @Get()
    async getAllAlbums(@Query() query: ExpressQuery): Promise<{ albums: Album[]; total: number }> {
        return await this.albumService.findAll(query)
    }

    @Put(':id')
    async updateAlbum(
        @Param('id')
        id: string,
        @Body() album: UpdateAlbumDto
    ): Promise<Album> {
        return this.albumService.updateById(id, album)
    }

    @Delete(':id')
    async deleteAlbum(
        @Param('id')
        id: string
    ): Promise<Album> {
        return this.albumService.deleteById(id)
    }
}
