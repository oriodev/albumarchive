import { Module } from '@nestjs/common';
import { ReviewsController } from './reviews.controller';
import { ReviewsService } from './reviews.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ReviewsSchema } from './schemas/reviews.schema';
import { Ratings, RatingsSchema } from 'src/ratings/schemas/ratings.schema';
import { RatingsService } from 'src/ratings/ratings.service';
import { UserSchema } from 'src/auth/schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Reviews', schema: ReviewsSchema }]),
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    MongooseModule.forFeature([{ name: 'Ratings', schema: RatingsSchema }]),
  ],
  controllers: [ReviewsController],
  providers: [ReviewsService]
})
export class ReviewsModule {}
