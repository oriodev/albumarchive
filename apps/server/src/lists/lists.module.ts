import { Module } from '@nestjs/common';
import { ListController } from './lists.controller';
import { ListService } from './lists.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ListSchema } from './schemas/list.schema';
import { UsersModule } from 'src/users/users.module';
import { AlbumModule } from 'src/albums/album.module';
import { AlbumSchema } from 'src/albums/schemas/album.schema';
import { AlbumService } from 'src/albums/album.service';
import { UserSchema } from 'src/auth/schemas/user.schema';
import { LikesSchema } from 'src/likes/schemas/likes.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'List', schema: ListSchema }]),
    MongooseModule.forFeature([{ name: 'Album', schema: AlbumSchema }]),
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    MongooseModule.forFeature([{ name: 'Likes', schema: LikesSchema }]),
    UsersModule,
    AlbumModule
  ],
  controllers: [ListController],
  providers: [ListService, AlbumService]
})
export class ListModule {}
