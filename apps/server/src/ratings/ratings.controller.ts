import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { Ratings } from './schemas/ratings.schema';
import { RatingsService } from './ratings.service';

@Controller('ratings')
export class RatingsController {
    constructor(private ratingsService: RatingsService) {}

    @Get()
    async getRating(@Query('user') user: string, @Query('album') album: string): Promise<Ratings> {
        return await this.ratingsService.getRating(user, album);
    }

    @Get(':albumId')
    async getTotalRating(@Param('albumId') albumId): Promise<number> {
        return await this.ratingsService.getAlbumRating(albumId)
    }
    
    @Post()
    async createList(@Body() rating: Ratings): Promise<Ratings> {
        return await this.ratingsService.create(rating)
    }

    @Put(':id')
    async updateRating(@Param('id') id: string, @Body() body: { rating: number }): Promise<Ratings> {
        return await this.ratingsService.updateById(id, body.rating)
    }

    @Delete(':id')
    async deleteRating(@Param('id') id: string): Promise<Ratings> {
        return await this.ratingsService.deleteRating(id)
    }
}
