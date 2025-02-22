import { Module } from '@nestjs/common';
import { LikesController } from './likes.controller';
import { LikesService } from './likes.service';
import { LikesSchema } from './schemas/likes.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { ListSchema } from 'src/list/schemas/list.schema';

@Module({
    imports: [
      MongooseModule.forFeature([{ name: 'Likes', schema: LikesSchema }]),
      MongooseModule.forFeature([{ name: 'List', schema: ListSchema }]),
    ],
  controllers: [LikesController],
  providers: [LikesService]
})
export class LikesModule {}
