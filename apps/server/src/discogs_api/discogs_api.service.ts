import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { Query } from 'express-serve-static-core';
import { Album } from 'src/album/schemas/album.schema';


@Injectable()
export class DiscogsApiService {
    private readonly searchUrl = 'https://api.discogs.com/database/search';
    private readonly authHeaderTokens = `Discogs key=${process.env.DISCOG_KEY}, secret=${process.env.DISCOG_SECRET}`;

    constructor(private readonly httpService: HttpService) {}

    async searchAlbum(query: Query): Promise<{albums: Album[], total: number}> {
        try {
            const response = await firstValueFrom(this.httpService.get(this.searchUrl, {
                params: {
                    q: query.search,
                    type: 'release',
                    page: query.page,
                    per_page: 25
                },
                headers: {
                    Authorization: this.authHeaderTokens
                }
            }));

            const uniqueAlbums = new Set();
            const formattedResponse: Album[] = [];

            response.data.results.forEach((album) => {
                const [albumArtist, albumTitle] = album.title.split(' - ').map(part => part.trim());
                const uniqueKey = `${albumTitle}-${albumArtist}`;
                
                if (!uniqueAlbums.has(uniqueKey)) {

                    uniqueAlbums.add(uniqueKey);
                    formattedResponse.push({
                        title: albumTitle,
                        artist: albumArtist,
                        genre: album.genre,
                        coverImage: album.cover_image,
                        releaseDate: album.year,
                        overallRating: null,
                        reviews: null
                    })
                }
            })

            const total = response.data.pagination.pages

            return {albums: formattedResponse, total};
        } catch (error) {
            console.error('Error fetching album:', error);
            throw new Error('Failed to fetch album data');
        }
    }
}