import { Module } from '@nestjs/common';
import { ReviewsController } from './reviews.controller';
import { ReviewsService } from './reviews.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ReviewsSchema } from './schemas/reviews.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Reviews', schema: ReviewsSchema }]),
  ],
  controllers: [ReviewsController],
  providers: [ReviewsService]
})
export class ReviewsModule {}
