import { Module } from '@nestjs/common';
import { LikesController } from './likes.controller';
import { LikesService } from './likes.service';
import { LikesSchema } from './schemas/likes.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
    imports: [
      MongooseModule.forFeature([{ name: 'Likes', schema: LikesSchema }]),
    ],
  controllers: [LikesController],
  providers: [LikesService]
})
export class LikesModule {}
