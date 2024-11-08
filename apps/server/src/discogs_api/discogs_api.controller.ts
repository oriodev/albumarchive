import { Controller, Get, Query } from '@nestjs/common';
import { DiscogsApiService } from './discogs_api.service';
import { Query as ExpressQuery } from 'express-serve-static-core';


@Controller('discogs')
export class DiscogsApiController {
    constructor(private readonly discogsApiService: DiscogsApiService) {}

    @Get()
    async getRecords(@Query() query: ExpressQuery) {
        console.log('hellooo?')
        return await this.discogsApiService.searchAlbum(query)
    }
}
