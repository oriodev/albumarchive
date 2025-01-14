import { Module } from '@nestjs/common';
import { RatingsController } from './ratings.controller';
import { RatingsService } from './ratings.service';
import { MongooseModule } from '@nestjs/mongoose';
import { RatingsSchema } from './schemas/ratings.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Ratings', schema: RatingsSchema }]),
  ],
  controllers: [RatingsController],
  providers: [RatingsService]
})
export class RatingsModule {}
