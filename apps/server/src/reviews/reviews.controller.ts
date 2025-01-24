import { Body, Controller, Post } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { Reviews } from './schemas/reviews.schema';

@Controller('reviews')
export class ReviewsController {
    constructor(private reviewsService: ReviewsService) {}

    @Post()
    async createReview(@Body() review: Reviews): Promise<Reviews> {
        return await this.reviewsService.create(review)
    }
    
}
