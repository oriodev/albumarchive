import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ListService } from './lists.service';
import { CreateListDto } from './dto/create-list.dto';
import { List } from './schemas/list.schema';
import { UpdateListDto } from './dto/update-list.dto';

import { Query as ExpressQuery } from 'express-serve-static-core';

// USER NEEDS TO BE POPULUATED IN LIST.

@Controller('lists')
export class ListController {
    constructor(private listService: ListService) {}

    // GET.

    @Get('/all')
    async getAllLists(@Query() query: ExpressQuery): Promise<{ lists: List[]; total: number }> {
        return await this.listService.findAll(query)
    }

    @Get('/trending')
    async getTrendingLists(): Promise<List[]> {
        return await this.listService.getTrendingLists()
    }

    @Get(':id/id')
    async getListById(@Param('id') id: string): Promise<List> {
        return await this.listService.getListById(id)
    }

    @Get(':id/user')
    async getListByUserId(@Param('id') id: string): Promise<List[]> {
        return await this.listService.findByUserId(id);
    }

    @Get()
    async getListByName(@Query('user') user: string, @Query('slug') slug: string): Promise<List> {
        return await this.listService.findBySlug(user, slug);
    }

    @Get('/album-in-list')
    async isAlbumInList(@Query('list') list: string, @Query('album') album: string): Promise<Boolean> {
        return await this.listService.isAlbumInList(list, album)
    }

    // POST.

    @Post()
    async createList(@Body() list: CreateListDto): Promise<List> {
        return await this.listService.create(list)
    }

    // DELETE.

    @Delete(':id')
    async deleteList(@Param('id') id: string): Promise<List> {
        return await this.listService.deleteById(id)
    }

    // 

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
