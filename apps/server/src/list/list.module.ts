import { Module } from '@nestjs/common';
import { ListController } from './list.controller';
import { ListService } from './list.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ListSchema } from './schemas/list.schema';
import { UsersModule } from 'src/users/users.module';
import { AlbumModule } from 'src/album/album.module';
import { AlbumSchema } from 'src/album/schemas/album.schema';
import { AlbumService } from 'src/album/album.service';
import { UserSchema } from 'src/auth/schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'List', schema: ListSchema }]),
    MongooseModule.forFeature([{ name: 'Album', schema: AlbumSchema }]),
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    UsersModule,
    AlbumModule
  ],
  controllers: [ListController],
  providers: [ListService, AlbumService]
})
export class ListModule {}
