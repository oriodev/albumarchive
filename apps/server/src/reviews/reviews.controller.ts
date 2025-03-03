import { Body, Controller, Delete, Get, Param, Post, Put, Query, Request } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { Reviews } from './schemas/reviews.schema';

import { Query as ExpressQuery } from 'express-serve-static-core';

@Controller('reviews')
export class ReviewsController {
    constructor(private reviewsService: ReviewsService) {}

    @Get()
    async getReview(@Query('user') user: string, @Query('album') album: string): Promise<Reviews> {
        return await this.reviewsService.getReview(user, album);
    }

    @Get('/albums')
    async getAllReviewsByAlbum(@Query() query: ExpressQuery, @Request() req): Promise<{ reviews: Reviews[]; total: number }> {
        const excludeUserId = req.user.id
        return await this.reviewsService.getAllAlbumReviews(query, excludeUserId)
    }

    @Get('/users')
    async getAllReviewsByUser(@Query() query: ExpressQuery): Promise<{ reviews: Reviews[]; total: number }> {
        return await this.reviewsService.getAllByUser(query)
    }

    @Get(':albumId/total')
    async getTotalRating(@Param('albumId') albumId): Promise<number> {
        return await this.reviewsService.getAlbumRating(albumId)
    }

    @Get(':albumId/ratingscount')
    async getNumberOfRatings(@Param('albumId') albumId): Promise<{}> {
        return await this.reviewsService.getRatingsCount(albumId)
    }

    @Post()
    async createReview(@Body() review: Reviews): Promise<Reviews> {
        return await this.reviewsService.create(review)
    }

    @Put(':id')
    async editReview(
        @Param('id')
        id: string,
        @Body() review: Reviews
    ): Promise<Reviews> {
        console.log()
        return this.reviewsService.editById(review, id)
    }

    @Delete(':id')
    async deleteReview(@Param('id') id: string): Promise<Reviews> {
        return await this.reviewsService.deleteReview(id)
    }
    
}
