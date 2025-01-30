import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
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
    async getAllReviews(@Query() query: ExpressQuery): Promise<{ reviews: Reviews[]; total: number }> {
        return await this.reviewsService.findAll(query)
    }

    @Get('/users')
    async getAllReviewsByUser(@Query() query: ExpressQuery): Promise<{ reviews: Reviews[]; total: number }> {
        return await this.reviewsService.findAllByUser(query)
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
    async deleteRating(@Param('id') id: string): Promise<Reviews> {
        return await this.reviewsService.deleteReview(id)
    }
    
}
