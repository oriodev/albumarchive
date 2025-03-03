import { Module } from '@nestjs/common';
import { DiscogsApiService } from './discogs.service';
import { DiscogsApiController } from './discogs.controller';
import { HttpModule, HttpService } from '@nestjs/axios';

@Module({
  providers: [DiscogsApiService],
  controllers: [DiscogsApiController],
  imports: [HttpModule]
})
export class DiscogsApiModule {}
