import { Body, Controller, Delete, Get, Param, Post, Query } from '@nestjs/common';
import { LikesService } from './likes.service';
import { Likes } from './schemas/likes.schema';

@Controller('likes')
export class LikesController {
        constructor(private likesService: LikesService) {}
    
        @Get()
        async getRating(@Query('user') user: string, @Query('list') list: string): Promise<Likes> {
            return await this.likesService.getLike(user, list);
        }
    
        @Get(':listId')
        async getTotalLikes(@Param('listId') listId): Promise<number> {
            return await this.likesService.getListLikes(listId)
        }
        
        @Post()
        async createLike(@Body() like: Likes): Promise<Likes> {
            return await this.likesService.create(like)
        }
    
        @Delete(':id')
        async deleteLike(@Param('id') id: string): Promise<Likes> {
            return await this.likesService.deleteLike(id)
        }
}
