import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { AlbumService } from './album.service';
import { Album } from './schemas/album.schema';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';

import { Query as ExpressQuery } from 'express-serve-static-core';
import { Public } from 'utils/public.decorator';

@Controller('album')
export class AlbumController {
    constructor(private albumService: AlbumService) {}

    @Get()
    async getAllAlbums(@Query() query: ExpressQuery): Promise<Album[]> {
        return await this.albumService.findAll(query)
    }

    @Post()
    async createAlbum(@Body() album: CreateAlbumDto): Promise<Album> {
        return this.albumService.create(album)
    }

    @Get(':id')
    async getAlbum(
        @Param('id')
        id: string
    ): Promise<Album> {
        return await this.albumService.findById(id)
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
