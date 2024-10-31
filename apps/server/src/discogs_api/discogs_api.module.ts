import { Module } from '@nestjs/common';
import { DiscogsApiService } from './discogs_api.service';
import { DiscogsApiController } from './discogs_api.controller';
import { HttpModule, HttpService } from '@nestjs/axios';

@Module({
  providers: [DiscogsApiService],
  controllers: [DiscogsApiController],
  imports: [HttpModule]
})
export class DiscogsApiModule {}
