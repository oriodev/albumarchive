import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AlbumModule } from './album/album.module';
import { DiscogsApiModule } from './discogs_api/discogs_api.module';
import { ListModule } from './list/list.module';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true
    }),
    MongooseModule.forRoot(process.env.DB_URI),
    AlbumModule,
    DiscogsApiModule,
    ListModule
  ],
  controllers: [AppController],
})
export class AppModule {}