import { Module } from '@nestjs/common';
import { RatingsController } from './ratings.controller';
import { RatingsService } from './ratings.service';
import { MongooseModule } from '@nestjs/mongoose';
import { RatingsSchema } from './schemas/ratings.schema';
import { ReviewsSchema } from 'src/reviews/schemas/reviews.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Ratings', schema: RatingsSchema }]),
    MongooseModule.forFeature([{ name: 'Reviews', schema: ReviewsSchema }]),
  ],
  controllers: [RatingsController],
  providers: [RatingsService]
})
export class RatingsModule {}
