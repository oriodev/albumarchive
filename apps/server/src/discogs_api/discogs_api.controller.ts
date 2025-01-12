import { Controller, Get, Query } from '@nestjs/common';
import { DiscogsApiService } from './discogs_api.service';
import { Query as ExpressQuery } from 'express-serve-static-core';
import { Album } from 'src/album/schemas/album.schema';


@Controller('discogs')
export class DiscogsApiController {
    constructor(private readonly discogsApiService: DiscogsApiService) {}

    @Get()
    async getRecords(@Query() query: ExpressQuery): Promise<{albums: Album[], total: number}> {
        return await this.discogsApiService.searchAlbum(query)
    }
}
