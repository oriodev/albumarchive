import { Body, Controller, Delete, Param, Post, Put } from '@nestjs/common';
import { ListService } from './list.service';
import { CreateListDto } from './dto/create-list.dto';
import { List } from './schemas/list.schema';
import { UpdateListDto } from './dto/update-list.dto';

@Controller('list')
export class ListController {
    constructor(private listService: ListService) {}

    @Post()
    async createList(@Body() list: CreateListDto): Promise<List> {
        return await this.listService.create(list)
    }

    @Delete(':id')
    async deleteList(@Param('id') id: string): Promise<List> {
        return await this.listService.deleteById(id)
    }

    @Put(':id')
    async updateList(
        @Param('id')
        id: string,
        @Body() list: UpdateListDto
    ): Promise<List> {
        return this.listService.updateById(id, list)
    }

    // @Put('/addalbum/:id')
    // async addAlbum(
    //     @Param('id')
    //     id: string,
    //     @Body() body: { albumId: string }
    // ): Promise<List> {
    //     return this.listService.addAlbum(id, body.albumId)
    // }

    @Put('/deletealbum/:id')
    async deleteAlbum(
        @Param('id')
        id: string,
        @Body() body: { albumId: string }
    ): Promise<List> {
        return this.listService.removeAlbum(id, body.albumId)
    }
    
}
