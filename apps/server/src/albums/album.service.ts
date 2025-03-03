import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Album } from './schemas/album.schema';
import { Query } from 'express-serve-static-core';


@Injectable()
export class AlbumService {
    constructor(
        @InjectModel(Album.name)
        private albumModel: mongoose.Model<Album>
    ) {}

    // GET.

    /**
     * returns all albums, paginated, with optional search query. also returns total.
     * @param query 
     * @returns Promise<{Album[]; total: number }>
     */
    async getAllAlbums(query: Query): Promise<{ albums: Album[]; total: number }> {

        const resPerPage = 25
        const currentPage = Number(query.page) || 1
        const skip = resPerPage * (currentPage - 1)

        const search = query.search ? {
            $or: [
                { title: {
                    $regex: query.search,
                    $options: 'i'
                }},
                {artist: {
                    $regex: query.search,
                    $options: 'i'
                }}
            ]
        } : {}

        const total = await this.albumModel.countDocuments({ ...search }).exec();
    
        const albums = await this.albumModel
            .find({ ...search })
            .limit(resPerPage)
            .skip(skip);
    
        return { albums, total };
    }

    /**
     * returns an album by its title.
     * @param title 
     * @returns Promise<Album>
     */
    async getAlbumByTitle(title: string): Promise<Album> {

        const album = await this.albumModel.findOne({ title: title })

        if (!album) {
            throw new NotFoundException('album not found')
        }

        return album;
    }

    /**
     * returns an album by id.
     * @param id
     * @returns  Promise<Album>
     */
    async getAlbumById(id: string): Promise<Album> {

        const isValidId = mongoose.isValidObjectId(id)

        if (!isValidId) {
            throw new BadRequestException('please enter a valid mongo id')
        }

        const album = await this.albumModel.findById(id);

        if (!album) {
            throw new NotFoundException('album not found')
        }

        return album;
    }

    /**
     * returns an album by artist name.
     * @param artistName 
     * @returns Promise<Album[]>
     */
    async getAlbumsByArtist(artistName: string): Promise<Album[]> {
        const albums = await this.albumModel.find({ artist: artistName })

        return albums
    }

    // POST.

    /**
     * creates an album.
     * @param album
     * @returns Promise<Album>
     */
    async create(album: Album): Promise<Album> {
        const data = Object.assign(album)
        const res = await this.albumModel.create(data);
        
        return res;
    }
}

