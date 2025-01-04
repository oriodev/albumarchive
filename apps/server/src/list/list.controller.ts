import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ListService } from './list.service';
import { CreateListDto } from './dto/create-list.dto';
import { List } from './schemas/list.schema';
import { UpdateListDto } from './dto/update-list.dto';

@Controller('list')
export class ListController {
    constructor(private listService: ListService) {}

    @Get()
    async getListByName(@Query('user') user: string, @Query('slug') slug: string): Promise<List> {
        return await this.listService.findBySlug(user, slug);
    }

    @Get('/album-in-list')
    async isAlbumInList(@Query('list') list: string, @Query('album') album: string): Promise<Boolean> {
        return await this.listService.isAlbumInList(list, album)
    }

    @Post()
    async createList(@Body() list: CreateListDto): Promise<List> {
        return await this.listService.create(list)
    }

    @Delete(':id')
    async deleteList(@Param('id') id: string): Promise<List> {
        return await this.listService.deleteById(id)
    }

    @Put('/add-album')
    async addAlbum(
        @Query('id')
        id: string,
        @Body() body: { albumId: string }
    ): Promise<List> {
        return this.listService.addAlbum(id, body.albumId)
    }

    @Put('/delete-album/:id')
    async deleteAlbum(
        @Param('id')
        id: string,
        @Body() body: { albumId: string }
    ): Promise<List> {
        return this.listService.removeAlbum(id, body.albumId)
    }
    
    @Put(':id')
    async updateList(
        @Param('id')
        id: string,
        @Body() list: UpdateListDto
    ): Promise<List> {
        return this.listService.updateById(id, list)
    }
}
