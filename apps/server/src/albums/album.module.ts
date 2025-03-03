import { Module } from '@nestjs/common';
import { AlbumService } from './album.service';
import { AlbumController } from './album.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { AlbumSchema } from './schemas/album.schema';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  providers: [AlbumService],
  controllers: [AlbumController],
  imports: [
    MongooseModule.forFeature([{ name: 'Album', schema: AlbumSchema}]),
    AuthModule,
  ]
})
export class AlbumModule {}
